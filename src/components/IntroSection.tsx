import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const IntroSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: "🤖",
      title: "Multi-Agent Collaboration",
      description: "Multiple AI Agents work together, simulating a complete research team"
    },
    {
      icon: "🔬",
      title: "Research Automation",
      description: "Literature search, data analysis, paper writing - AI assists every research step"
    },
    {
      icon: "🌐",
      title: "Open Ecosystem",
      description: "Open-source toolchain, sharing research results and methodologies with the community"
    },
    {
      icon: "⚡",
      title: "Fast Iteration",
      description: "From idea to experiment, shorten research cycles and accelerate scientific discovery"
    }
  ]

  return (
    <section id="intro" className="py-24 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge badge-cyan mb-4">About OnePersonLab</span>
          <h2 className="heading-section text-soft-white mb-6">
            One person's lab, <span className="text-bright-cyan">infinite possibilities</span>
          </h2>
          <p className="text-muted-gray max-w-2xl mx-auto text-lg leading-relaxed">
            OnePersonLab explores multi-agent systems in scientific research. We believe that through AI Agents collaboration, 
            one person's creativity can extend into a team's productivity.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card p-6 group cursor-default"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-soft-white text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-gray text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "5+", label: "Open Source Projects" },
            { value: "100+", label: "Research Papers" },
            { value: "10K+", label: "Community Users" },
            { value: "24/7", label: "AI Collaboration" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-bright-cyan mb-2">
                {stat.value}
              </div>
              <div className="text-muted-gray text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default IntroSection