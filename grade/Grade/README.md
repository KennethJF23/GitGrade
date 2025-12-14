# GitGrade 🎯

GitGrade is a web app that analyzes GitHub repositories and produces a score, concise summary, and a practical roadmap for improvement. It's built as a fast Vite + React frontend with a small service layer that queries the GitHub REST API and (optionally) an LLM for richer summaries.

## Features ✨

- **Repository Analysis**: Fetch and analyze any public GitHub repository
- **Intelligent Scoring**: Evaluate repositories across 5 key dimensions:
  - 📚 Documentation (20 pts)
  - ⚡ Activity (25 pts)
  - 👥 Community Engagement (20 pts)
  - ✅ Code Quality (20 pts)
  - 🔧 Maintenance (15 pts)
- **Detailed Summary**: Get insights into strengths and areas for improvement
- **Development Roadmap**: Receive a phased plan for repository enhancement
- **Smooth Animations**: Beautiful Framer Motion animations throughout

## Tech Stack 🛠️

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **Axios** - HTTP client for GitHub API
- **GitHub REST API** - Repository data source

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Install

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root (see `env` section below)

3. Start the development server

```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

## Usage 📖

1. Enter a GitHub repository URL (example: `https://github.com/facebook/react`).
2. Click "Analyze Repository".
3. The app will fetch repository data and display:
  - Overall score and grade
  - Score breakdown by category
  - Strengths and recommended improvements
  - A phased development roadmap

## Scoring Methodology 📊

The scoring system evaluates repositories across multiple dimensions:

- **Documentation**: README, description, license, wiki presence
- **Activity**: Recent commits and development frequency
- **Community**: Stars, forks, contributors
- **Code Quality**: Issue management, topics, project organization
- **Maintenance**: Update frequency and branch management

## Environment variables / Secrets

The app supports the following environment variables (place them in `.env` in the project root):

- `VITE_GITHUB_TOKEN` — optional GitHub Personal Access Token (PAT) to increase API rate limits. Without this, unauthenticated requests are limited by GitHub (60 req/hour per IP).
- `VITE_LLM_API_KEY` — optional OpenAI-style key (development only). **Warning:** `VITE_` variables are embedded into the client bundle and therefore exposed to users. For production, do not store secrets in `VITE_` variables; instead create a backend proxy endpoint that keeps keys server-side.
- `VITE_GEMINI_API_KEY` — optional Gemini key (development only). Same exposure caveat applies.

Example `.env` (development / local only):

```env
VITE_GITHUB_TOKEN=your_github_pat_here
VITE_LLM_API_KEY=your_openai_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

Security note: Do not commit `.env` to source control. For production, move tokens to server-side environment variables and implement an `/api/llm` proxy for LLM calls.

## Project Structure 📁

```
src/
├── components/           # React UI components
├── services/             # API integration and analysis logic
│   └── githubService.js  # Fetch & analyze GitHub data
├── App.jsx               # Main application component
├── App.css               # Styles
└── main.jsx              # Vite entry
```

## Future Enhancements 🔮

- Move LLM and GitHub secrets server-side (recommended)
- Add GitHub App integration for fine‑grained repo permissions
- Historical score tracking and comparisons
- Exportable reports (PDF)
- Private repository support and CI/CD integration

## Contributing 🤝

Contributions welcome — please open a Pull Request or an issue for ideas and fixes.

## License 📄

MIT

