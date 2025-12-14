import { motion } from 'framer-motion';

const Summary = ({ summary }) => {
  return (
    <motion.div
      className="summary-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2>Scoring Summary</h2>
      
      <div className="summary-content">
        <motion.div
          className="summary-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h3>📊 Methodology</h3>
          <p className="summary-text">{summary.methodology}</p>
        </motion.div>

        <motion.div
          className="summary-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h3>🔍 Analysis</h3>
          <p className="summary-text">{summary.analysis}</p>
        </motion.div>

        <motion.div
          className="summary-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h3>💡 Strengths</h3>
          <ul className="summary-list">
            {summary.strengths.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {strength}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="summary-card warning"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h3>⚠️ Areas for Improvement</h3>
          <ul className="summary-list">
            {summary.improvements.map((improvement, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {improvement}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Summary;
