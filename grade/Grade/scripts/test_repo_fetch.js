async function test() {
  const owner = 'KennethJF23';
  const repo = 'ARS';
  const base = 'https://api.github.com';
  const token = process.env.VITE_GITHUB_TOKEN || '';
  const headers = token ? { Authorization: `token ${token}`, 'User-Agent': 'gitgrade-test' } : { 'User-Agent': 'gitgrade-test' };

  const urls = {
    repo: `${base}/repos/${owner}/${repo}`,
    contributors: `${base}/repos/${owner}/${repo}/contributors`,
    commits: `${base}/repos/${owner}/${repo}/commits?per_page=100`,
    issues: `${base}/repos/${owner}/${repo}/issues?state=all&per_page=100`,
    languages: `${base}/repos/${owner}/${repo}/languages`,
    branches: `${base}/repos/${owner}/${repo}/branches`,
    pulls: `${base}/repos/${owner}/${repo}/pulls?state=all&per_page=100`,
    contents: `${base}/repos/${owner}/${repo}/contents`,
    readme: `${base}/repos/${owner}/${repo}/readme`
  };

  for (const [k, url] of Object.entries(urls)) {
    try {
      const res = await fetch(url, { headers });
      console.log(k, res.status);
      const text = await res.text();
      console.log(k, 'len', text ? text.length : 0);
      console.log(text.slice(0, 500));
    } catch (err) {
      console.error(k, 'error', err.message);
    }
  }
}

test().catch(e=>console.error(e));
