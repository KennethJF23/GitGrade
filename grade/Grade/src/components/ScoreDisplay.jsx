import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ScoreDisplay = ({ scoreData }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = scoreData.totalScore;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [scoreData.totalScore]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#4ade80';
    if (score >= 60) return '#fbbf24';
    if (score >= 40) return '#fb923c';
    return '#ef4444';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <motion.div
      className="score-display"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="score-circle">
        <motion.div
          className="score-number"
          style={{ color: getScoreColor(scoreData.totalScore) }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {animatedScore}
        </motion.div>
        <div className="score-grade">{getScoreGrade(scoreData.totalScore)}</div>
        <div className="score-label">Overall Score</div>
        
        {/* Rating Badges */}
        {scoreData.rating && (
          <motion.div 
            className="rating-badges"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className={`rating-badge ${scoreData.rating.toLowerCase()}`}>
              {scoreData.rating}
            </span>
            <span className={`badge-icon ${scoreData.badge.toLowerCase()}`}>
              {scoreData.badge === 'Gold' ? '🏆' : scoreData.badge === 'Silver' ? '🥈' : '🥉'} {scoreData.badge}
            </span>
          </motion.div>
        )}
      </div>

      <div className="score-breakdown">
        <h3>Score Breakdown</h3>
        {scoreData.breakdown.map((item, index) => (
          <motion.div
            key={item.category}
            className="score-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="score-item-header">
              <span className="score-item-name">{item.category}</span>
              <span className="score-item-value">{item.score}/{item.maxScore}</span>
            </div>
            <div className="score-bar">
              <motion.div
                className="score-bar-fill"
                style={{ backgroundColor: getScoreColor((item.score / item.maxScore) * 100) }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.score / item.maxScore) * 100}%` }}
                transition={{ delay: 0.2 * index, duration: 0.8 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScoreDisplay;
