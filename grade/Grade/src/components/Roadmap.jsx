import { motion } from 'framer-motion';

const Roadmap = ({ roadmap }) => {
  const priorityColors = {
    high: '#ef4444',
    medium: '#fbbf24',
    low: '#3b82f6'
  };

  const phaseVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5
      }
    })
  };

  return (
    <motion.div
      className="roadmap-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h2>🗺️ Development Roadmap</h2>
      <p className="roadmap-intro">
        Based on the analysis, here's a suggested roadmap for improving this repository:
      </p>

      <div className="roadmap-timeline">
        {roadmap.phases.map((phase, index) => (
          <motion.div
            key={phase.phase}
            className="roadmap-phase"
            custom={index}
            initial="hidden"
            animate="visible"
            variants={phaseVariants}
          >
            <div className="phase-header">
              <div className="phase-number">{index + 1}</div>
              <h3 className="phase-title">{phase.phase}</h3>
              <span className="phase-timeline">{phase.timeline}</span>
            </div>

            <div className="phase-tasks">
              {phase.tasks.map((task, taskIndex) => (
                <motion.div
                  key={taskIndex}
                  className="task-item"
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className="task-priority"
                    style={{ backgroundColor: priorityColors[task.priority] }}
                  >
                    {task.priority}
                  </div>
                  <div className="task-content">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="roadmap-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h3>🎯 Expected Outcomes</h3>
        <ul className="outcomes-list">
          {roadmap.outcomes.map((outcome, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + 0.1 * index }}
            >
              {outcome}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Roadmap;
