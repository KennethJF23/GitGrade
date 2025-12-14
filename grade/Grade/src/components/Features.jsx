import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: '📈',
      title: 'Comprehensive Scoring',
      description: 'Get detailed scores across 5 key dimensions: documentation, activity, community, code quality, and maintenance.'
    },
    {
      icon: '🔍',
      title: 'In-Depth Analysis',
      description: 'Understand your repository\'s strengths and weaknesses with actionable insights and recommendations.'
    },
    {
      icon: '🗺️',
      title: 'Development Roadmap',
      description: 'Receive a customized roadmap with phased tasks to improve your repository quality over time.'
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Analyze any public GitHub repository in seconds with real-time data from the GitHub API.'
    },
    {
      icon: '📊',
      title: 'Visual Metrics',
      description: 'Beautiful, animated visualizations make it easy to understand complex repository metrics at a glance.'
    },
    {
      icon: '🎯',
      title: 'Best Practices',
      description: 'Compare your repository against industry standards and open-source best practices.'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Why Choose GitGrade?</h2>
          <p className="section-subtitle">
            Everything you need to understand and improve your GitHub repositories
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
