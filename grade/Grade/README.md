# GitGrade 🎯

A modern web application that analyzes and scores GitHub repositories, providing comprehensive insights and development roadmaps.

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

### Installation

1. Install dependencies
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage 📖

1. Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
2. Click "Analyze Repository"
3. View the comprehensive analysis including:
   - Overall score and grade
   - Score breakdown by category
   - Strengths and improvement areas
   - Development roadmap with phased tasks

## Scoring Methodology 📊

The scoring system evaluates repositories across multiple dimensions:

- **Documentation**: README, description, license, wiki presence
- **Activity**: Recent commits and development frequency
- **Community**: Stars, forks, contributors
- **Code Quality**: Issue management, topics, project organization
- **Maintenance**: Update frequency and branch management

## API Rate Limiting ⚠️

This application uses the GitHub API without authentication, which has a rate limit of 60 requests per hour per IP address. For higher limits, you can:

1. Generate a GitHub Personal Access Token
2. Add it to the axios requests in `src/services/githubService.js`

## Project Structure 📁

```
src/
├── components/
│   ├── RepoInput.jsx      # URL input component
│   ├── ScoreDisplay.jsx   # Score visualization
│   ├── Summary.jsx        # Analysis summary
│   └── Roadmap.jsx        # Development roadmap
├── services/
│   └── githubService.js   # GitHub API integration
├── App.jsx                # Main application component
├── App.css                # Application styles
└── main.jsx               # Entry point
```

## Future Enhancements 🔮

- [ ] GitHub authentication for higher API limits
- [ ] Historical score tracking
- [ ] Repository comparison feature
- [ ] Export reports as PDF
- [ ] Support for private repositories
- [ ] Detailed code quality metrics
- [ ] Integration with CI/CD platforms

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the MIT License.

