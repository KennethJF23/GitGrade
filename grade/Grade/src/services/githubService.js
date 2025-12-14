import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

// LLM API configuration
const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY || '';
// Use LLM when an API key is provided (LLM-only mode per user request)
const USE_LLM = !!LLM_API_KEY;
// Optional GitHub token to raise rate limits and access private data when available
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';

// Helper to call OpenAI Chat Completions
const callOpenAI = async (messages, model = 'gpt-4', max_tokens = 1200) => {
  if (!LLM_API_KEY) throw new Error('OpenAI API key not configured');
  const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
    model,
    messages,
    temperature: 0.6,
    max_tokens
  }, {
    headers: {
      'Authorization': `Bearer ${LLM_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return resp.data.choices?.[0]?.message?.content || null;
};

// Browser-safe base64 -> UTF-8 decoder
const base64ToUtf8 = (b64) => {
  if (!b64) return '';
  try {
    // atob -> bytes -> TextDecoder for correct UTF-8 handling
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch (e) {
    // fallback using decodeURIComponent trick
    try {
      return decodeURIComponent(Array.prototype.map.call(atob(b64), c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (err) {
      return atob(b64);
    }
  }
};

// Parse GitHub URL
export const parseGithubUrl = (url) => {
  const regex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(regex);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace('.git', '')
  };
};

// Analyze folder structure
const analyzeStructure = (contents) => {
  if (!contents || contents.length === 0) {
    return { score: 0, fileCount: 0, folderCount: 0, organized: false };
  }

  const files = contents.filter(item => item.type === 'file');
  const folders = contents.filter(item => item.type === 'dir');
  
  const hasSource = folders.some(f => ['src', 'source', 'app', 'lib'].includes(f.name.toLowerCase()));
  const hasTests = folders.some(f => ['test', 'tests', '__tests__', 'spec'].includes(f.name.toLowerCase()));
  const hasDocs = folders.some(f => ['docs', 'documentation'].includes(f.name.toLowerCase()));
  const hasConfig = files.some(f => ['.gitignore', '.editorconfig', 'package.json', 'requirements.txt'].includes(f.name.toLowerCase()));
  
  const organized = hasSource || (folders.length > 0 && files.length < 10);
  const score = (hasSource ? 3 : 0) + (hasTests ? 2 : 0) + (hasDocs ? 2 : 0) + (hasConfig ? 1 : 0);
  
  return { score, fileCount: files.length, folderCount: folders.length, organized, hasSource, hasTests, hasDocs, hasConfig };
};

// Analyze README quality
const analyzeReadme = (readme) => {
  if (!readme || !readme.content) {
    return { score: 0, length: 0, hasSections: false };
  }
  
  const content = base64ToUtf8(readme.content);
  const length = content.length;
  
  const hasTitle = /^#\s+/m.test(content);
  const hasDescription = length > 100;
  const hasInstallation = /install|setup|getting started/i.test(content);
  const hasUsage = /usage|example|how to/i.test(content);
  const hasContributing = /contribut/i.test(content);
  const hasLicense = /license/i.test(content);
  const hasImages = /!\[.*\]\(.*\)/g.test(content);
  const hasCodeBlocks = /```/g.test(content);
  
  const score = (hasTitle ? 1 : 0) + (hasDescription ? 2 : 0) + (hasInstallation ? 2 : 0) + (hasUsage ? 2 : 0) + 
                (hasContributing ? 1 : 0) + (hasLicense ? 1 : 0) + (hasImages ? 1 : 0) + (hasCodeBlocks ? 1 : 0);
  
  return { score, length, hasSections: hasInstallation && hasUsage, hasTitle, hasDescription, hasInstallation, hasUsage, hasContributing, hasLicense };
};

// Detect test files
const detectTests = (contents) => {
  if (!contents || contents.length === 0) return false;
  
  const testPatterns = [
    /test.*\.js$/, /.*\.test\.js$/, /.*\.spec\.js$/,
    /test.*\.py$/, /.*_test\.py$/, /.*\.test\.py$/,
    /test.*\.ts$/, /.*\.test\.ts$/, /.*\.spec\.ts$/,
    /__tests__/, /spec\//
  ];
  
  return contents.some(item => testPatterns.some(pattern => pattern.test(item.name)));
};

// Analyze commits
const analyzeCommits = (commits) => {
  if (!commits || commits.length === 0) {
    return { consistency: 'none', avgMessageLength: 0, recentActivity: false, total: 0, recentCount: 0, veryRecentCount: 0, meaningfulPercentage: 0 };
  }
  
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const recentCommits = commits.filter(c => new Date(c.commit.author.date) > threeMonthsAgo);
  const veryRecentCommits = commits.filter(c => new Date(c.commit.author.date) > oneMonthAgo);
  
  const messages = commits.map(c => c.commit.message);
  const avgLength = messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length;
  const meaningfulCommits = messages.filter(msg => msg.length > 10 && !/^(update|fix|.)$/i.test(msg)).length;
  
  const consistency = recentCommits.length > 20 ? 'high' : recentCommits.length > 10 ? 'medium' : 'low';
  
  return {
    total: commits.length,
    recentCount: recentCommits.length,
    veryRecentCount: veryRecentCommits.length,
    consistency,
    avgMessageLength: Math.round(avgLength),
    meaningfulPercentage: Math.round((meaningfulCommits / messages.length) * 100),
    recentActivity: veryRecentCommits.length > 0
  };
};

// Analyze Git practices
const analyzeGitPractices = (branches, pullRequests) => {
  const branchCount = branches?.length || 0;
  const prCount = pullRequests?.length || 0;
  const mergedPRs = pullRequests?.filter(pr => pr.merged_at).length || 0;
  
  const usesFeatureBranches = branchCount > 1;
  const usesPRs = prCount > 0;
  const goodMergeRate = prCount > 0 ? (mergedPRs / prCount) > 0.5 : false;
  
  const score = (usesFeatureBranches ? 3 : 0) + (usesPRs ? 4 : 0) + (goodMergeRate ? 3 : 0);
  
  return { score, branchCount, prCount, mergedPRs, usesFeatureBranches, usesPRs, goodMergeRate };
};

// Fetch repository data
export const fetchRepoData = async (owner, repo) => {
  const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

  const repoUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
  const contributorsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors`;
  const commitsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=100`;
  const issuesUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=all&per_page=100`;
  const languagesUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`;
  const branchesUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/branches`;
  const pullsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=all&per_page=100`;
  const contentsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`;
  const readmeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`;

  // Fetch all endpoints concurrently but don't fail entirely if one endpoint errors.
  const urls = [repoUrl, contributorsUrl, commitsUrl, issuesUrl, languagesUrl, branchesUrl, pullsUrl, contentsUrl, readmeUrl];
  const results = await Promise.allSettled(urls.map(u => axios.get(u, { headers })));

  // Provide sane defaults for endpoints that may be missing (empty repos, no readme, etc.)
  const defaults = [null, [], [], [], {}, [], [], [], null];
  const responses = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    // Map common GitHub API responses to safe defaults but attach error metadata
    const err = r.reason;
    const status = err && err.response && err.response.status;
    const message = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : (err && err.message) || 'request failed';
    // 409 = empty repository for commits endpoint
    if (status === 409 && urls[i] === commitsUrl) return { data: [], _errorStatus: status, _errorMessage: message };
    // 404 for contents/readme -> treat as missing
    if (status === 404 && (urls[i] === contentsUrl || urls[i] === readmeUrl)) return { data: defaults[i], _errorStatus: status, _errorMessage: message };
    // 403 rate limit or other permissions issue -> attach metadata
    if (status === 403) return { data: defaults[i], _errorStatus: status, _errorMessage: message };
    // otherwise return default placeholder with metadata
    return { data: defaults[i], _errorStatus: status, _errorMessage: message };
  });

  const [repoResponse, contributorsResponse, commitsResponse, issuesResponse, languagesResponse, branchesResponse, pullRequestsResponse, contentsResponse, readmeResponse] = responses;

  // If GitHub rate limit is hit or permissions denied for the repo, surface a clear error
  if (repoResponse && repoResponse._errorStatus === 403 && /rate limit exceeded/i.test(repoResponse._errorMessage || '')) {
    throw new Error('GitHub API rate limit exceeded for unauthenticated requests. Set VITE_GITHUB_TOKEN in .env to increase rate limits and retry.');
  }

  const folderStructure = analyzeStructure(contentsResponse?.data || []);
  const readmeQuality = analyzeReadme(readmeResponse?.data || null);
  const hasTests = detectTests(contentsResponse?.data || []);
  const commitAnalysis = analyzeCommits(commitsResponse?.data || []);
  const gitPractices = analyzeGitPractices(branchesResponse?.data || [], pullRequestsResponse?.data || []);

  return {
    repo: repoResponse?.data || null,
    contributors: contributorsResponse?.data || [],
    commits: commitsResponse?.data || [],
    issues: issuesResponse?.data || [],
    languages: languagesResponse?.data || {},
    branches: branchesResponse?.data || [],
    pullRequests: pullRequestsResponse?.data || [],
    contents: contentsResponse?.data || [],
    readme: readmeResponse?.data || null,
    folderStructure,
    readmeQuality,
    hasTests,
    commitAnalysis,
    gitPractices
  };
};

// Calculate score
export const calculateScore = (data) => {
  const { repo, contributors, folderStructure, readmeQuality, hasTests, commitAnalysis, gitPractices } = data;

  const hasTopics = repo.topics && repo.topics.length > 0;
  const languageCount = Object.keys(data.languages || {}).length;
  const testScore = hasTests ? 8 : 0;
  const codeQualityScore = testScore + (hasTopics ? 5 : 0) + Math.min(7, languageCount * 2);

  const structureScore = folderStructure ? folderStructure.score : 0;
  const organizationScore = Math.min(15, structureScore * 1.5);

  const readmeScore = readmeQuality ? readmeQuality.score : 0;
  const hasDescription = repo.description && repo.description.length > 20;
  const hasLicense = repo.license !== null;
  const documentationScore = Math.min(20, (readmeScore * 1.5) + (hasDescription ? 3 : 0) + (hasLicense ? 2 : 0));

  const testCoverageScore = hasTests ? 10 : 0;
  const issuesManaged = repo.has_issues ? 3 : 0;
  const maintainabilityScore = testCoverageScore + issuesManaged + Math.min(2, contributors.length * 0.5);

  const starsScore = Math.min(5, (repo.stargazers_count / 50) * 5);
  const forksScore = Math.min(3, (repo.forks_count / 20) * 3);
  const relevanceScore = starsScore + forksScore + (repo.homepage ? 2 : 0);

  const consistencyMap = { high: 10, medium: 6, low: 3, none: 0 };
  const consistencyScore = consistencyMap[commitAnalysis?.consistency || 'none'];

  const gitPracticesScore = gitPractices ? gitPractices.score : 0;

  const totalScore = Math.min(100, Math.round(codeQualityScore + organizationScore + documentationScore + maintainabilityScore + relevanceScore + consistencyScore + gitPracticesScore));

  const rating = totalScore >= 85 ? 'Advanced' : totalScore >= 65 ? 'Intermediate' : 'Beginner';
  const badge = totalScore >= 85 ? 'Gold' : totalScore >= 65 ? 'Silver' : 'Bronze';

  return {
    totalScore,
    rating,
    badge,
    breakdown: [
      { category: 'Code Quality & Readability', score: Math.round(codeQualityScore), maxScore: 20 },
      { category: 'Project Structure & Organization', score: Math.round(organizationScore), maxScore: 15 },
      { category: 'Documentation & Clarity', score: Math.round(documentationScore), maxScore: 20 },
      { category: 'Test Coverage & Maintainability', score: Math.round(maintainabilityScore), maxScore: 15 },
      { category: 'Real-world Relevance', score: Math.round(relevanceScore), maxScore: 10 },
      { category: 'Commit Consistency', score: Math.round(consistencyScore), maxScore: 10 },
      { category: 'Version Control Practices', score: Math.round(gitPracticesScore), maxScore: 10 }
    ]
  };
};

// Generate summary
export const generateSummary = async (scoreData, repoData) => {
  // LLM-only behavior: require LLM when enabled
  if (USE_LLM) {
    const { repo, contributors, commits, folderStructure, readmeQuality, hasTests, commitAnalysis, gitPractices } = repoData;
    const prompt = `You are an expert code reviewer. Given the repository metadata and score, produce a concise JSON with keys: analysis (2-3 sentences), strengths (array of 3-5), improvements (array of 3-5).\n\n` +
      `Repository: ${repo.full_name}\nDescription: ${repo.description || 'No description'}\nStars: ${repo.stargazers_count} | Forks: ${repo.forks_count}\n` +
      `Files: ${folderStructure.fileCount} | Folders: ${folderStructure.folderCount} | Has tests: ${hasTests ? 'Yes' : 'No'}\n` +
      `README score: ${readmeQuality.score} | Commit consistency: ${commitAnalysis.consistency} | Git practices score: ${gitPractices.score}\n` +
      `Current Score: ${scoreData.totalScore}/100\n\nRespond ONLY with valid JSON. Use arrays for strengths/improvements.`;

    try {
      const content = await callOpenAI([
        { role: 'system', content: 'You are an honest mentor and code reviewer.' },
        { role: 'user', content: prompt }
      ]);
      if (!content) throw new Error('empty LLM response');
      const parsed = JSON.parse(content);
      return {
        methodology: `LLM-powered analysis across 7 dimensions.`,
        analysis: parsed.analysis,
        strengths: parsed.strengths,
        improvements: parsed.improvements
      };
    } catch (err) {
      console.warn(`LLM analysis failed, falling back to rule-based summary: ${err.message}`);
      // fall through to rule-based summary below
    }
  }

  // If LLM not enabled, return rule-based fallback (kept for compatibility)
  const { repo } = repoData;
  const score = scoreData.totalScore;

  const strengths = [];
  const improvements = [];

  scoreData.breakdown.forEach(item => {
    const percentage = (item.score / item.maxScore) * 100;
    if (percentage >= 70) {
      strengths.push(`Strong ${item.category.toLowerCase()} with ${item.score}/${item.maxScore} points`);
    } else if (percentage < 50) {
      improvements.push(`Improve ${item.category.toLowerCase()} (currently ${item.score}/${item.maxScore})`);
    }
  });

  const methodology = `This repository was evaluated across 7 key dimensions: Code Quality & Readability (20pts), Project Structure & Organization (15pts), Documentation & Clarity (20pts), Test Coverage & Maintainability (15pts), Real-world Relevance (10pts), Commit Consistency (10pts), and Version Control Practices (10pts).`;

  const analysis = score >= 80 
    ? `Excellent repository health with a score of ${score}/100. Strong practices across multiple dimensions.`
    : score >= 60
    ? `Good potential with a score of ${score}/100. Solid foundations with room for improvement.`
    : score >= 40
    ? `Moderate score of ${score}/100. Several areas need attention to improve quality.`
    : `Score of ${score}/100 indicates significant room for improvement. Focus on the recommendations below.`;

  return {
    methodology,
    analysis,
    strengths: strengths.length > 0 ? strengths : ['Repository has basic structure in place'],
    improvements: improvements.length > 0 ? improvements : ['Continue maintaining current standards']
  };
};

// Generate roadmap
export const generateRoadmap = async (scoreData, repoData) => {
  // If LLM-only mode is enabled, generate roadmap via LLM
  if (USE_LLM) {
    try {
      const { repo, folderStructure, readmeQuality, hasTests, commitAnalysis, gitPractices } = repoData;
      const prompt = `You are a software project mentor. Given the repository metadata and score, produce a practical 4-phase roadmap as JSON with keys: phases (array) and outcomes (array). Each phase must include timeline and tasks (title, description, priority).\n\nRepository: ${repo.full_name}\nScore: ${scoreData.totalScore}/100\nFiles: ${folderStructure.fileCount} | Folders: ${folderStructure.folderCount}\nHas tests: ${hasTests ? 'Yes' : 'No'}\nREADME score: ${readmeQuality.score}\nCommit consistency: ${commitAnalysis.consistency}\nGit practices score: ${gitPractices.score}\n\nReturn ONLY valid JSON.`;

      const content = await callOpenAI([
        { role: 'system', content: 'You are an expert software project manager and mentor.' },
        { role: 'user', content: prompt }
      ], 'gpt-4', 1500);

      if (!content) throw new Error('empty LLM response');
      const parsed = JSON.parse(content);
      return parsed;
    } catch (err) {
      console.warn(`LLM roadmap generation failed, falling back to rule-based roadmap: ${err.message}`);
      // fall through to rule-based roadmap below
    }
  }

  // Fallback rule-based roadmap (kept for compatibility)
  const { repo } = repoData;
  const phases = [];
  // Phase 1
  const criticalTasks = [];
  if (!repoData.readmeQuality || !repoData.readmeQuality.hasInstallation || !repoData.readmeQuality.hasUsage) {
    criticalTasks.push({ title: 'Create Comprehensive README.md', description: 'Add project overview, installation instructions, usage examples, and screenshots.', priority: 'high' });
  }
  if (!repoData.folderStructure || !repoData.folderStructure.organized) {
    criticalTasks.push({ title: 'Restructure Project Folders', description: 'Organize code into clear folders (src/, tests/, docs/, config/).', priority: 'high' });
  }
  if (!repo.license) {
    criticalTasks.push({ title: 'Add Open-Source License', description: 'Add MIT or Apache 2.0 license.', priority: 'high' });
  }
  if (criticalTasks.length > 0) phases.push({ phase: 'Critical Foundation', timeline: 'Week 1-2', tasks: criticalTasks });

  // Phase 2
  const qualityTasks = [];
  if (!repoData.hasTests) qualityTasks.push({ title: 'Add Unit Tests', description: 'Write tests for core functionality. Start with 50%+ coverage.', priority: 'high' });
  qualityTasks.push({ title: 'Improve Code Readability', description: 'Add meaningful comments, use descriptive variable names.', priority: 'medium' });
  phases.push({ phase: 'Code Quality & Testing', timeline: 'Week 3-4', tasks: qualityTasks });

  // Phase 3
  const gitTasks = [];
  if (!repoData.gitPractices || !repoData.gitPractices.usesFeatureBranches) gitTasks.push({ title: 'Use Feature Branches', description: 'Create feature branches for each new feature.', priority: 'high' });
  if (!repoData.gitPractices || !repoData.gitPractices.usesPRs) gitTasks.push({ title: 'Create Pull Requests', description: 'Use PRs to merge features.', priority: 'high' });
  phases.push({ phase: 'Version Control Best Practices', timeline: 'Week 5-6', tasks: gitTasks });

  // Phase 4
  const polishTasks = [ { title: 'Add CI/CD Pipeline', description: 'Set up GitHub Actions to auto-run tests.', priority: 'high' }, { title: 'Add Project Demo', description: 'Add screenshots or GIF demos to README.', priority: 'medium' }, { title: 'Deploy Your Project', description: 'Deploy to Vercel, Heroku, or GitHub Pages.', priority: 'low' } ];
  phases.push({ phase: 'Professional Polish', timeline: 'Week 7-8+', tasks: polishTasks });

  const outcomes = [ '✓ Repository looks professional to recruiters', '✓ Code is clean, tested, and documented', '✓ Follows industry best practices', '✓ Portfolio-ready repository' ];
  return { phases, outcomes };
};
