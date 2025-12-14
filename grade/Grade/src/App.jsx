import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import ScoreDisplay from './components/ScoreDisplay'
import Summary from './components/Summary'
import Roadmap from './components/Roadmap'
import LoadingSpinner from './components/LoadingSpinner'
import { 
  parseGithubUrl, 
  fetchRepoData, 
  calculateScore, 
  generateSummary, 
  generateRoadmap 
} from './services/githubService'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const handleAnalyze = async (url) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // Parse GitHub URL
      const parsed = parseGithubUrl(url)
      if (!parsed) {
        throw new Error('Invalid GitHub URL')
      }

      // Fetch repository data
      const repoData = await fetchRepoData(parsed.owner, parsed.repo)

      // Calculate score
      const scoreData = calculateScore(repoData)

      // Generate summary and roadmap (with LLM if available)
      const summary = await generateSummary(scoreData, repoData)
      const roadmap = await generateRoadmap(scoreData, repoData)

      setResults({
        repoInfo: repoData.repo,
        scoreData,
        summary,
        roadmap
      })
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the repository')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingSpinner key="loading" />
        ) : !results ? (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header />
            <Hero onAnalyze={handleAnalyze} loading={loading} />
            <Features />
            <HowItWorks />
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            className="results-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header />
            <div className="results-container">
              <motion.div
                className="results-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="repo-info">
                  <h2>{results.repoInfo.full_name}</h2>
                  <p>{results.repoInfo.description}</p>
                </div>
                <motion.button
                  className="reset-button"
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analyze Another
                </motion.button>
              </motion.div>

              <div className="results-content">
                <ScoreDisplay scoreData={results.scoreData} />
                <Summary summary={results.summary} />
                <Roadmap roadmap={results.roadmap} />
              </div>
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {error && !loading && !results && (
        <motion.div
          className="error-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="error-container">
            <h3>❌ Error</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="error-dismiss">
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default App
