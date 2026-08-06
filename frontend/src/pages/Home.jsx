import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiShield, FiClock, FiCode, FiArrowRight, FiTrendingUp, FiMessageCircle, FiMic } from 'react-icons/fi'
import { FiSword } from '../components/SwordIcon'

const features = [
  {
    icon: <FiSword size={24} />,
    title: '1v1 Real-Time Battles',
    desc: 'Face off against opponents in live coding duels. Socket.IO keeps both players perfectly synchronized.',
    color: 'text-primary',
    border: 'border-primary/20',
    bg: 'bg-primary/5',
  },
  {
    icon: <FiShield size={24} />,
    title: 'Secure Code Execution',
    desc: 'All code runs in isolated Docker containers with no internet access, time limits, and memory caps.',
    color: 'text-secondary',
    border: 'border-secondary/20',
    bg: 'bg-secondary/5',
  },
  {
    icon: <FiClock size={24} />,
    title: '30-Minute Battles',
    desc: 'Synchronized countdown timer with live updates. First to solve wins — or the one with more test cases.',
    color: 'text-success',
    border: 'border-success/20',
    bg: 'bg-success/5',
  },
  {
    icon: <FiCode size={24} />,
    title: 'Monaco Code Editor',
    desc: 'VS Code-style editor with syntax highlighting for C++17 and Java 17. Run custom inputs in real-time.',
    color: 'text-warning',
    border: 'border-warning/20',
    bg: 'bg-warning/5',
  },
  {
    icon: <FiZap size={24} />,
    title: 'Instant Matchmaking',
    desc: 'Click "Find Match" and get paired in seconds. Or create a private room with a shareable code.',
    color: 'text-primary',
    border: 'border-primary/20',
    bg: 'bg-primary/5',
  },
  {
    icon: <FiTrendingUp size={24} />,
    title: 'Battle Analytics',
    desc: 'Track wins, losses, and win rate. Full battle history with paginated results and detailed verdicts.',
    color: 'text-secondary',
    border: 'border-secondary/20',
    bg: 'bg-secondary/5',
  },
  {
    icon: <FiMessageCircle size={24} />,
    title: 'AI Debate Arena',
    desc: 'Practice debates with an AI opponent, get real-time argument analysis, fallacy detection, and personalized coaching.',
    color: 'text-warning',
    border: 'border-warning/20',
    bg: 'bg-warning/5',
  },
  {
    icon: <FiMic size={24} />,
    title: 'Voice Debate Mode',
    desc: 'Debate using your voice with speech-to-text. Compete with friends in real-time or practice with AI.',
    color: 'text-error',
    border: 'border-error/20',
    bg: 'bg-error/5',
  },
]

const stats = [
  { label: 'Problems', value: '5+', sub: 'and growing' },
  { label: 'Languages', value: '2', sub: 'C++17 & Java 17' },
  { label: 'Battle Time', value: '30m', sub: 'per match' },
  { label: 'Real-time', value: '< 1s', sub: 'latency' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Home() {
  return (
    <div className="relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative page-container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Real-Time 1v1 Coding Battles — Now Live
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-text-primary">Code.</span>{' '}
            <span className="text-gradient">Compete.</span>
            <br />
            <span className="text-text-primary">Conquer.</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Challenge opponents to 1v1 real-time coding battles. Solve algorithmic problems with{' '}
            <span className="text-secondary font-semibold">C++17</span> or{' '}
            <span className="text-primary font-semibold">Java 17</span>.
            First to pass all test cases wins.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5">
              Start Battling <FiArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
              Log In
            </Link>
          </div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 relative max-w-4xl mx-auto"
        >
          <div className="gradient-border p-1 rounded-2xl">
            <div className="glass-card p-4 rounded-2xl">
              {/* Fake terminal header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="ml-2 text-xs text-text-muted font-mono">main.cpp — CodeClash Battle Room</span>
              </div>
              {/* Fake code */}
              <pre className="text-left text-sm font-mono text-text-secondary leading-6 overflow-hidden">
                <span className="text-secondary">#include</span> <span className="text-success">&lt;bits/stdc++.h&gt;</span>{'\n'}
                <span className="text-secondary">using namespace</span> <span className="text-primary">std</span>;{'\n\n'}
                <span className="text-secondary">int</span> <span className="text-warning">main</span>() {'{'}{'\n'}
                {'    '}<span className="text-secondary">int</span> n; cin &gt;&gt; n;{'\n'}
                {'    '}vector&lt;<span className="text-secondary">int</span>&gt; nums(n);{'\n'}
                {'    '}<span className="text-secondary">for</span> (<span className="text-secondary">int</span> i = <span className="text-primary">0</span>; i &lt; n; i++) cin &gt;&gt; nums[i];{'\n'}
                {'    '}<span className="text-text-muted">// ... solving Two Sum in O(n) ...</span>{'\n'}
                {'    '}unordered_map&lt;<span className="text-secondary">int</span>, <span className="text-secondary">int</span>&gt; seen;{'\n'}
                {'    '}<span className="text-secondary">for</span> (<span className="text-secondary">int</span> i = <span className="text-primary">0</span>; i &lt; n; i++) {'{'}{'\n'}
                {'        '}<span className="text-secondary">if</span> (seen.count(target - nums[i])){'\n'}
                {'            '}cout &lt;&lt; seen[target - nums[i]] &lt;&lt; <span className="text-success">" "</span> &lt;&lt; i;{'\n'}
                {'    }'}{'\n'}
                {'}'}
              </pre>
              {/* Bottom bar */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="badge badge-easy">Easy</span>
                  <span className="text-xs text-text-muted">Two Sum</span>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-xs py-1.5 px-3">▶ Run</button>
                  <button className="btn-success text-xs py-1.5 px-3">✓ Submit</button>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect under card */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-2xl rounded-full" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="page-container py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={itemVariants} className="glass-card p-6 text-center">
              <div className="text-3xl font-black text-gradient mb-1">{s.value}</div>
              <div className="text-sm font-semibold text-text-primary">{s.label}</div>
              <div className="text-xs text-text-muted mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="page-container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Everything you need to <span className="text-gradient">battle</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Built for competitive programmers who want real-time, fair, and fun coding contests.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={itemVariants} className="glass-card-hover p-6">
              <div className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center ${f.color} mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="page-container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-border rounded-2xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-2xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Ready to prove your worth?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Join CodeClash, find a worthy opponent, and let the best coder win.
            </p>
            <Link to="/signup" className="btn-primary text-base px-10 py-4 inline-flex">
              Enter the Arena <FiSword size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-text-muted text-sm">
        <div className="flex items-center justify-center gap-1.5">
          <FiSword size={14} className="text-primary" />
          <span>CodeClash 1v1 — Built for competitive coders</span>
        </div>
      </footer>
    </div>
  )
}
