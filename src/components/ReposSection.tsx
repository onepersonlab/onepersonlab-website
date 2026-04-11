import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Star, GitFork, Clock, ExternalLink } from 'lucide-react'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  language: string
  owner: {
    login: string
  }
}

// Static data as fallback and primary source
const staticRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "hiclaw",
    full_name: "onepersonlab/hiclaw",
    description: "HiClaw - 多智能体协作框架，支持 Worker-Manager 协作模式",
    html_url: "https://github.com/onepersonlab/hiclaw",
    stargazers_count: 156,
    forks_count: 23,
    updated_at: "2026-04-10T12:00:00Z",
    language: "TypeScript",
    owner: { login: "onepersonlab" }
  },
  {
    id: 2,
    name: "openclaw",
    full_name: "onepersonlab/openclaw",
    description: "OpenClaw - 开源版多智能体框架，轻量级部署方案",
    html_url: "https://github.com/onepersonlab/openclaw",
    stargazers_count: 89,
    forks_count: 12,
    updated_at: "2026-04-08T08:30:00Z",
    language: "TypeScript",
    owner: { login: "onepersonlab" }
  },
  {
    id: 3,
    name: "AutoGen",
    full_name: "microsoft/AutoGen",
    description: "Microsoft AutoGen - 多智能体对话框架",
    html_url: "https://github.com/microsoft/AutoGen",
    stargazers_count: 45000,
    forks_count: 5800,
    updated_at: "2026-04-09T10:00:00Z",
    language: "Python",
    owner: { login: "microsoft" }
  },
  {
    id: 4,
    name: "crewai",
    full_name: "crewAIInc/crewAI",
    description: "crewAI - 协作式 AI Agents 框架",
    html_url: "https://github.com/crewAIInc/crewAI",
    stargazers_count: 28000,
    forks_count: 3500,
    updated_at: "2026-04-07T14:00:00Z",
    language: "Python",
    owner: { login: "crewAIInc" }
  },
  {
    id: 5,
    name: "langchain",
    full_name: "langchain-ai/langchain",
    description: "LangChain - 构建 LLM 应用开发框架",
    html_url: "https://github.com/langchain-ai/langchain",
    stargazers_count: 95000,
    forks_count: 12000,
    updated_at: "2026-04-11T02:00:00Z",
    language: "Python",
    owner: { login: "langchain-ai" }
  },
  {
    id: 6,
    name: "agents",
    full_name: "langchain-ai/agents",
    description: "LangChain Agents - 构建智能代理的工具集",
    html_url: "https://github.com/langchain-ai/agents",
    stargazers_count: 3200,
    forks_count: 450,
    updated_at: "2026-04-06T09:00:00Z",
    language: "Python",
    owner: { login: "langchain-ai" }
  }
]

const ReposSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [repos, setRepos] = useState<GitHubRepo[]>(staticRepos)
  const [_loading, setLoading] = useState(true)
  const [activeOrg, setActiveOrg] = useState<'all' | 'onepersonlab' | 'microsoft' | 'crewAIInc' | 'langchain-ai'>('all')

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true)
      try {
        // Try fetching from GitHub API
        const response = await fetch('https://api.github.com/users/onepersonlab/repos')
        if (response.ok) {
          const data = await response.json()
          // Merge with static data, prioritizing live data
          const liveData: GitHubRepo[] = data.slice(0, 6)
          setRepos([...liveData, ...staticRepos.filter(s => !liveData.find((l: GitHubRepo) => l.full_name === s.full_name))])
        }
      } catch (error) {
        // Fallback to static data
        console.log('Using static repo data')
      }
      setLoading(false)
    }
    fetchRepos()
  }, [])

  const filteredRepos = activeOrg === 'all' 
    ? repos 
    : repos.filter(r => r.owner.login === activeOrg)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 1) return 'Today'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US')
  }

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'JavaScript': '#f7df1e',
      'Go': '#00add8',
      'Rust': '#dea584',
    }
    return colors[lang] || '#8a9a96'
  }

  return (
    <section id="repos" className="py-24 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge badge-amber mb-4">
            <Github className="w-3 h-3 mr-1" />
            GitHub Repositories
          </span>
          <h2 className="heading-section text-soft-white mb-4">
            Multi-Agent Open Source Projects
          </h2>
          <p className="text-muted-gray max-w-xl mx-auto">
            Explore multi-agent frameworks and tools from OnePersonLab and the community
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {[
            { key: 'all', label: 'All' },
            { key: 'onepersonlab', label: 'OnePersonLab' },
            { key: 'microsoft', label: 'Microsoft' },
            { key: 'crewAIInc', label: 'crewAI' },
            { key: 'langchain-ai', label: 'LangChain' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveOrg(filter.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeOrg === filter.key
                  ? 'bg-bright-cyan text-deep-ink'
                  : 'bg-ocean-teal/50 text-muted-gray hover:text-soft-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Repos Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card p-6 overflow-hidden"
        >
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Repository</th>
                  <th>Description</th>
                  <th className="text-center">Language</th>
                  <th className="text-center">
                    <Star className="w-4 h-4 inline mr-1" />
                    Stars
                  </th>
                  <th className="text-center">
                    <GitFork className="w-4 h-4 inline mr-1" />
                    Forks
                  </th>
                  <th className="text-center">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Updated
                  </th>
                  <th className="text-center">Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepos.slice(0, 8).map((repo, index) => (
                  <motion.tr
                    key={repo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-bright-cyan" />
                        <span className="font-medium text-soft-white">{repo.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-gray text-sm max-w-xs truncate">
                      {repo.description || '—'}
                    </td>
                    <td className="text-center">
                      <span 
                        className="badge text-xs"
                        style={{ 
                          backgroundColor: `${getLanguageColor(repo.language)}20`,
                          borderColor: getLanguageColor(repo.language),
                          color: getLanguageColor(repo.language)
                        }}
                      >
                        {repo.language || '—'}
                      </span>
                    </td>
                    <td className="text-center text-bright-cyan font-medium">
                      {repo.stargazers_count.toLocaleString()}
                    </td>
                    <td className="text-center text-muted-gray">
                      {repo.forks_count.toLocaleString()}
                    </td>
                    <td className="text-center text-muted-gray text-sm">
                      {formatDate(repo.updated_at)}
                    </td>
                    <td className="text-center">
                      <a 
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-bright-cyan hover:text-amber-gold transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* View More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <a
            href="https://github.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            View More Repos
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default ReposSection