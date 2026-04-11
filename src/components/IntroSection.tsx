import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const IntroSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: "🤖",
      title: "多智能体协作",
      description: "让多个 AI Agent 协同工作，模拟一个完整的研究团队"
    },
    {
      icon: "🔬",
      title: "科研自动化",
      description: "文献检索、数据分析、论文写作，AI 助力每一个研究环节"
    },
    {
      icon: "🌐",
      title: "开放生态",
      description: "开源工具链，与社区共享研究成果与方法论"
    },
    {
      icon: "⚡",
      title: "高效迭代",
      description: "从想法到实验，缩短研究周期，加速科学发现"
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
          <span className="badge badge-cyan mb-4">关于 OnePersonLab</span>
          <h2 className="heading-section text-soft-white mb-6">
            一个人的实验室，<span className="text-bright-cyan">无限可能</span>
          </h2>
          <p className="text-muted-gray max-w-2xl mx-auto text-lg leading-relaxed">
            OnePersonLab 致力于探索多智能体系统在科学研究中的应用。我们相信，通过 AI Agents 的协作，
            一个人的创造力可以延伸成一个团队的生产力。
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
            { value: "5+", label: "开源项目" },
            { value: "100+", label: "研究论文" },
            { value: "10K+", label: "社区用户" },
            { value: "24/7", label: "AI 协作" },
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