import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, ExternalLink, Zap } from 'lucide-react'

interface Project {
  id: string
  name: string
  url: string
  description: string
  category: string
  features: string[]
  icon?: string
}

const projects: Project[] = [
  {
    id: "1",
    name: "HiClaw",
    url: "https://hiclaw.io",
    description: "多智能体协作科研平台，Worker-Manager 协作模式的核心实现。",
    category: "协作平台",
    features: ["实时协作", "任务分配", "进度追踪"],
    icon: "🤝"
  },
  {
    id: "2",
    name: "OpenClaw",
    url: "https://openclaw.ai",
    description: "开源版多智能体框架，支持本地部署与自定义 Agent 配置。",
    category: "开源框架",
    features: ["本地部署", "插件扩展", "社区支持"],
    icon: "🔓"
  },
  {
    id: "3",
    name: "AutoGen Studio",
    url: "https://autogen.studio",
    description: "Microsoft AutoGen 的可视化界面，无需编码即可构建多智能体应用。",
    category: "可视化工具",
    features: ["可视化构建", "零代码", "快速原型"],
    icon: "🎨"
  },
  {
    id: "4",
    name: "crewAI Playground",
    url: "https://crewai.com/playground",
    description: "crewAI 的在线实验平台，探索 Agent 角色定义与任务编排。",
    category: "实验平台",
    features: ["角色定义", "流程设计", "实时测试"],
    icon: "🧪"
  },
  {
    id: "5",
    name: "LangSmith",
    url: "https://smith.langchain.com",
    description: "LangChain 的调试与监控平台，追踪 Agent 执行链路。",
    category: "调试工具",
    features: ["链路追踪", "性能分析", "版本管理"],
    icon: "📊"
  },
  {
    id: "6",
    name: "AgentVerse",
    url: "https://agentverse.ai",
    description: "多智能体社区平台，分享 Agent 模板与协作案例。",
    category: "社区平台",
    features: ["模板分享", "案例展示", "社区讨论"],
    icon: "🌐"
  }
]

const ProjectsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" className="py-24 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge badge-amber mb-4">
            <Globe className="w-3 h-3 mr-1" />
            项目网站
          </span>
          <h2 className="heading-section text-soft-white mb-4">
            相关项目与工具
          </h2>
          <p className="text-muted-gray max-w-xl mx-auto">
            探索多智能体生态中的平台、工具和社区资源
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card p-6 group block cursor-pointer"
            >
              {/* Icon & Category */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{project.icon}</span>
                <span className="badge badge-amber text-xs">{project.category}</span>
              </div>

              {/* Name */}
              <h3 className="font-display font-bold text-soft-white text-xl mb-2 group-hover:text-bright-cyan transition-colors">
                {project.name}
              </h3>

              {/* Description */}
              <p className="text-muted-gray text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.features.map((feature) => (
                  <span key={feature} className="inline-flex items-center gap-1 text-xs text-muted-gray">
                    <Zap className="w-2 h-2 text-bright-cyan" />
                    {feature}
                  </span>
                ))}
              </div>

              {/* Link Indicator */}
              <div className="flex items-center gap-2 text-bright-cyan text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4" />
                <span>访问网站</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection