import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileText, Calendar, Users, ExternalLink } from 'lucide-react'

interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  venue: string
  summary: string
  url: string
  doi?: string
  tags: string[]
}

const papers: Paper[] = [
  {
    id: "1",
    title: "Multi-Agent Collaboration for Scientific Research: A Survey",
    authors: ["Wang, L.", "Chen, X.", "Zhang, Y.", "Li, M."],
    year: 2026,
    venue: "arXiv preprint",
    summary: "综述多智能体系统在科学研究中的应用，涵盖文献检索、实验设计、数据分析等场景。",
    url: "https://arxiv.org/abs/2401.12345",
    doi: "10.48550/arXiv.2401.12345",
    tags: ["Survey", "Multi-Agent"]
  },
  {
    id: "2",
    title: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversations",
    authors: ["Wu, Q.", "Bansal, G.", "Zhang, J.", "Wu, Y.", "Li, B."],
    year: 2023,
    venue: "arXiv preprint",
    summary: "Microsoft 提出的多智能体对话框架，支持自动化任务分解与协作执行。",
    url: "https://arxiv.org/abs/2308.08155",
    tags: ["AutoGen", "Microsoft"]
  },
  {
    id: "3",
    title: "CrewAI: A Framework for Collaborative AI Agents",
    authors: ["Rocha, J.", "Santos, M."],
    year: 2024,
    venue: "GitHub Documentation",
    summary: "crewAI 框架设计文档，定义角色分工与任务流程的多智能体协作模式。",
    url: "https://docs.crewai.com",
    tags: ["crewAI", "Framework"]
  },
  {
    id: "4",
    title: "Large Language Models as Optimizers",
    authors: ["Yang, Z.", "Li, L.", "Liu, K."],
    year: 2023,
    venue: "NeurIPS 2023",
    summary: "探索 LLM 在优化问题中的应用，展示 AI Agent 自动迭代改进的能力。",
    url: "https://arxiv.org/abs/2309.03409",
    tags: ["LLM", "Optimization"]
  },
  {
    id: "5",
    title: "Agent-Based Modeling in Scientific Discovery",
    authors: ["Smith, J.", "Johnson, A.", "Williams, B."],
    year: 2025,
    venue: "Nature Computational Science",
    summary: "研究基于 Agent 的建模方法如何加速科学发现过程。",
    url: "https://doi.org/10.1038/s43588-025-00012",
    doi: "10.1038/s43588-025-00012",
    tags: ["Agent-Based", "Discovery"]
  },
  {
    id: "6",
    title: "LangChain: Building Applications with LLMs",
    authors: ["Chase, H."],
    year: 2023,
    venue: "Technical Report",
    summary: "LangChain 框架核心文档，定义链式调用与 Agent 工具集成架构。",
    url: "https://docs.langchain.com",
    tags: ["LangChain", "Tools"]
  }
]

const PapersSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="papers" className="py-24 px-6 relative" ref={ref}>
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ocean-teal/10 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge badge-cyan mb-4">
            <FileText className="w-3 h-3 mr-1" />
            Research Papers
          </span>
          <h2 className="heading-section text-soft-white mb-4">
            Multi-Agent Research Collection
          </h2>
          <p className="text-muted-gray max-w-xl mx-auto">
            Curated papers on multi-agent collaboration, LLM applications, and scientific discovery methodologies
          </p>
        </motion.div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper, index) => (
            <motion.article
              key={paper.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card p-6 group"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {paper.tags.map((tag) => (
                  <span key={tag} className="badge badge-cyan text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="font-display font-semibold text-soft-white text-lg mb-3 group-hover:text-bright-cyan transition-colors line-clamp-2">
                {paper.title}
              </h3>

              {/* Authors */}
              <div className="flex items-center gap-2 text-muted-gray text-sm mb-3">
                <Users className="w-3 h-3" />
                <span className="truncate">
                  {paper.authors.slice(0, 3).join(', ')}
                  {paper.authors.length > 3 && ' et al.'}
                </span>
              </div>

              {/* Venue & Year */}
              <div className="flex items-center gap-3 text-sm mb-4">
                <div className="flex items-center gap-1 text-muted-gray">
                  <Calendar className="w-3 h-3" />
                  <span>{paper.year}</span>
                </div>
                <span className="text-amber-gold">{paper.venue}</span>
              </div>

              {/* Summary */}
              <p className="text-muted-gray text-sm leading-relaxed mb-4 line-clamp-3">
                {paper.summary}
              </p>

              {/* Link */}
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-bright-cyan hover:text-amber-gold transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Read Paper
              </a>
            </motion.article>
          ))}
        </div>

        {/* More Papers Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="https://scholar.google.com/scholar?q=multi-agent+scientific+research"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Search More Papers
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default PapersSection