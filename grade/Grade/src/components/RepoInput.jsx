import { useState } from 'react';
import { motion } from 'framer-motion';

const RepoInput = ({ onAnalyze, loading, isHero = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateGithubUrl = (url) => {
    const pattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return pattern.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateGithubUrl(url)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    onAnalyze(url);
  };

  if (isHero) {
    return (
      <div className="hero-input-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="hero-input"
              disabled={loading}
            />
            <motion.button
              type="submit"
              className="hero-button"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </motion.button>
          </div>
          
          {error && (
            <motion.p
              className="error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </form>
      </div>
    );
  }

  return (
    <motion.div
      className="repo-input-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="title">GitGrade</h1>
      <p className="subtitle">Analyze and score any GitHub repository</p>
      
      <form onSubmit={handleSubmit}>
        <motion.div
          className="input-wrapper"
          whileFocus={{ scale: 1.02 }}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="repo-input"
            disabled={loading}
          />
        </motion.div>
        
        {error && (
          <motion.p
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
        
        <motion.button
          type="submit"
          className="analyze-button"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Analyzing...' : 'Analyze Repository'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default RepoInput;
