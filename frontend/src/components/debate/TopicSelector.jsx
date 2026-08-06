import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCpu, FiBookOpen, FiGlobe, FiHeart, FiTrendingUp, FiUsers, FiBriefcase, FiEdit3 } from 'react-icons/fi'

const categories = [
  { id: 'Technology', label: 'Technology', icon: <FiCpu size={20} />, color: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/10', topics: ['Should AI replace teachers?', 'Is social media harmful to society?', 'Should autonomous vehicles be allowed?', 'Will AI take over most jobs?'] },
  { id: 'Education', label: 'Education', icon: <FiBookOpen size={20} />, color: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/10', topics: ['Should homework be abolished?', 'Is online education better than classroom?', 'Should standardized testing be removed?', 'Is a college degree still necessary?'] },
  { id: 'Science', label: 'Science', icon: <FiGlobe size={20} />, color: 'text-success', border: 'border-success/30', bg: 'bg-success/10', topics: ['Should we colonize Mars?', 'Is genetic engineering ethical?', 'Should nuclear energy be expanded?', 'Is climate change reversible?'] },
  { id: 'Environment', label: 'Environment', icon: <FiGlobe size={20} />, color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/10', topics: ['Should single-use plastics be banned?', 'Is renewable energy enough to replace fossil fuels?', 'Should deforestation be criminalized?', 'Can individuals make a difference in climate change?'] },
  { id: 'Healthcare', label: 'Healthcare', icon: <FiHeart size={20} />, color: 'text-error', border: 'border-error/30', bg: 'bg-error/10', topics: ['Should healthcare be free for all?', 'Is alternative medicine valid?', 'Should vaccines be mandatory?', 'Can AI replace doctors?'] },
  { id: 'Social Issues', label: 'Social Issues', icon: <FiUsers size={20} />, color: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/10', topics: ['Should voting be mandatory?', 'Is censorship ever justified?', 'Should privacy or security be prioritized?', 'Is universal basic income feasible?'] },
  { id: 'Business', label: 'Business', icon: <FiBriefcase size={20} />, color: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/10', topics: ['Should remote work become permanent?', 'Is capitalism the best economic system?', 'Should corporations pay more taxes?', 'Is entrepreneurship better than employment?'] },
  { id: 'Custom', label: 'Custom Topic', icon: <FiEdit3 size={20} />, color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/10', topics: [] },
]

export default function TopicSelector({ onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [customTopic, setCustomTopic] = useState('')

  const handleTopicClick = (topic, category) => {
    onSelect({ topic, category })
  }

  const handleCustomSubmit = () => {
    if (customTopic.trim()) {
      onSelect({ topic: customTopic.trim(), category: 'Custom' })
    }
  }

  return (
    <div>
      {/* Category Grid */}
      {!selectedCategory && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedCategory(cat)}
              className={`glass-card-hover p-4 flex flex-col items-center gap-2 text-center group cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-sm font-semibold text-text-primary">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Topic List */}
      {selectedCategory && selectedCategory.id !== 'Custom' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-text-muted hover:text-text-primary mb-4 flex items-center gap-1"
          >
            ← Back to categories
          </button>
          <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
            <span className={selectedCategory.color}>{selectedCategory.icon}</span>
            {selectedCategory.label} Topics
          </h3>
          <div className="space-y-2">
            {selectedCategory.topics.map((topic, i) => (
              <motion.button
                key={topic}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleTopicClick(topic, selectedCategory.id)}
                className="w-full text-left glass-card-hover p-4 flex items-center gap-3 group cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg ${selectedCategory.bg} border ${selectedCategory.border} flex items-center justify-center text-sm font-bold ${selectedCategory.color}`}>
                  {i + 1}
                </div>
                <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                  {topic}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Custom Topic */}
      {selectedCategory?.id === 'Custom' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-text-muted hover:text-text-primary mb-4 flex items-center gap-1"
          >
            ← Back to categories
          </button>
          <h3 className="text-lg font-bold text-text-primary mb-3">Enter Your Topic</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
              placeholder="e.g., Should AI replace teachers?"
              className="input-field flex-1"
              maxLength={500}
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customTopic.trim()}
              className="btn-primary"
            >
              Select
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
