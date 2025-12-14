import { motion } from 'framer-motion';
import RepoInput from './RepoInput';

const Hero = ({ onAnalyze, loading }) => {
  return (
    <section className="hero-section">
      <div className="container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Analyze & Improve Your
            <span className="hero-highlight"> GitHub Repositories</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Get comprehensive scoring, detailed analysis, and actionable roadmaps 
            to elevate your repository quality
          </motion.p>

          <motion.div
            className="hero-input-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <RepoInput onAnalyze={onAnalyze} loading={loading} isHero={true} />
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">Key Metrics</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Data Points</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">60s</div>
              <div className="stat-label">Analysis Time</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
