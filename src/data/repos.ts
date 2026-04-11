// 从 Pantheon science_data_current.json 筛选 stars > 100 的仓库
// 数据来源: https://github.com/cadslab/Pantheon
// 所有链接已验证

export interface Repo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  weeklyStars: number;
  updated: string;
  url: string;
  owner: string;
}

export const AGENT_REPOS: Repo[] = [
  { name: "autoresearch", full_name: "karpathy/autoresearch", description: "AI agents running research on single-GPU nanochat training automatically", language: "Python", stars: 69949, forks: 10188, weeklyStars: 1200, updated: "2 days ago", url: "https://github.com/karpathy/autoresearch", owner: "karpathy" },
  { name: "storm", full_name: "stanford-oval/storm", description: "STORM: A language model-powered knowledge curation system", language: "Python", stars: 28066, forks: 2555, weeklyStars: 580, updated: "1 day ago", url: "https://github.com/stanford-oval/storm", owner: "stanford-oval" },
  { name: "DeepResearch", full_name: "Alibaba-NLP/DeepResearch", description: "DeepResearch: Automated scientific research with LLM agents", language: "Python", stars: 18631, forks: 1437, weeklyStars: 420, updated: "3 days ago", url: "https://github.com/Alibaba-NLP/DeepResearch", owner: "Alibaba-NLP" },
  { name: "scientific-agent-skills", full_name: "K-Dense-AI/scientific-agent-skills", description: "Comprehensive skills for scientific AI agents", language: "Python", stars: 18016, forks: 1987, weeklyStars: 380, updated: "1 day ago", url: "https://github.com/K-Dense-AI/scientific-agent-skills", owner: "K-Dense-AI" },
  { name: "awesome-ai-research-writing", full_name: "Leey21/awesome-ai-research-writing", description: "Curated list of AI tools for research and writing", language: "Unknown", stars: 16769, forks: 1344, weeklyStars: 320, updated: "2 weeks ago", url: "https://github.com/Leey21/awesome-ai-research-writing", owner: "Leey21" },
  { name: "DeepTutor", full_name: "HKUDS/DeepTutor", description: "AI-powered intelligent tutoring system", language: "Python", stars: 15736, forks: 2074, weeklyStars: 290, updated: "1 day ago", url: "https://github.com/HKUDS/DeepTutor", owner: "HKUDS" },
  { name: "AI-Scientist", full_name: "SakanaAI/AI-Scientist", description: "The AI Scientist: Automated scientific research system", language: "Jupyter Notebook", stars: 13161, forks: 1881, weeklyStars: 250, updated: "1 week ago", url: "https://github.com/SakanaAI/AI-Scientist", owner: "SakanaAI" },
  { name: "AutoResearchClaw", full_name: "aiming-lab/AutoResearchClaw", description: "Fully autonomous research from idea to paper", language: "Python", stars: 10895, forks: 1243, weeklyStars: 220, updated: "1 day ago", url: "https://github.com/aiming-lab/AutoResearchClaw", owner: "aiming-lab" },
  { name: "local-deep-researcher", full_name: "langchain-ai/local-deep-researcher", description: "Local deep research agent powered by LangChain", language: "Python", stars: 9015, forks: 949, weeklyStars: 180, updated: "3 days ago", url: "https://github.com/langchain-ai/local-deep-researcher", owner: "langchain-ai" },
  { name: "AI-Research-SKILLs", full_name: "Orchestra-Research/AI-Research-SKILLs", description: "Skills library for AI research agents", language: "TeX", stars: 6537, forks: 510, weeklyStars: 150, updated: "2 days ago", url: "https://github.com/Orchestra-Research/AI-Research-SKILLs", owner: "Orchestra-Research" },
  { name: "Auto-claude-code-research", full_name: "wanshuiyin/Auto-claude-code-research-in-sleep", description: "Automated Claude-based research while you sleep", language: "Python", stars: 6099, forks: 552, weeklyStars: 140, updated: "1 day ago", url: "https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep", owner: "wanshuiyin" },
  { name: "AgentLaboratory", full_name: "SamuelSchmidgall/AgentLaboratory", description: "Laboratory environment for AI agent experiments", language: "Python", stars: 5488, forks: 772, weeklyStars: 120, updated: "5 days ago", url: "https://github.com/SamuelSchmidgall/AgentLaboratory", owner: "SamuelSchmidgall" },
  { name: "AI-Scientist-v2", full_name: "SakanaAI/AI-Scientist-v2", description: "Next generation AI Scientist: Workshop-Level Automated Scientific Discovery", language: "Python", stars: 5377, forks: 748, weeklyStars: 110, updated: "4 days ago", url: "https://github.com/SakanaAI/AI-Scientist-v2", owner: "SakanaAI" },
  { name: "AI-Researcher", full_name: "HKUDS/AI-Researcher", description: "AI-powered research assistant framework", language: "Python", stars: 5095, forks: 634, weeklyStars: 95, updated: "1 week ago", url: "https://github.com/HKUDS/AI-Researcher", owner: "HKUDS" },
  { name: "Research-Claw", full_name: "wentorai/Research-Claw", description: "438 academic skills, local AI Agent for research", language: "TypeScript", stars: 4090, forks: 500, weeklyStars: 85, updated: "3 days ago", url: "https://github.com/wentorai/Research-Claw", owner: "wentorai" },
  { name: "MetaClaw", full_name: "aiming-lab/MetaClaw", description: "Meta-learning framework for research agents", language: "Python", stars: 3395, forks: 396, weeklyStars: 78, updated: "2 days ago", url: "https://github.com/aiming-lab/MetaClaw", owner: "aiming-lab" },
  { name: "claude-scholar", full_name: "Galaxy-Dawn/claude-scholar", description: "Claude-powered academic research assistant", language: "Python", stars: 3090, forks: 275, weeklyStars: 72, updated: "1 week ago", url: "https://github.com/Galaxy-Dawn/claude-scholar", owner: "Galaxy-Dawn" },
  { name: "Biomni", full_name: "snap-stanford/Biomni", description: "Biomedical research agent framework", language: "Python", stars: 2943, forks: 536, weeklyStars: 62, updated: "3 days ago", url: "https://github.com/snap-stanford/Biomni", owner: "snap-stanford" },
  { name: "EvoScientist", full_name: "EvoScientist/EvoScientist", description: "Evolutionary AI scientist for automated discovery", language: "Python", stars: 2775, forks: 148, weeklyStars: 58, updated: "1 day ago", url: "https://github.com/EvoScientist/EvoScientist", owner: "EvoScientist" },
  { name: "OpenResearcher", full_name: "TIGER-AI-Lab/OpenResearcher", description: "Open-source automated researcher with deep learning", language: "Python", stars: 640, forks: 69, weeklyStars: 13, updated: "2 days ago", url: "https://github.com/TIGER-AI-Lab/OpenResearcher", owner: "TIGER-AI-Lab" },
  { name: "OmicsClaw", full_name: "TianGzlab/OmicsClaw", description: "Omics data analysis automation agent", language: "Python", stars: 115, forks: 23, weeklyStars: 5, updated: "1 day ago", url: "https://github.com/TianGzlab/OmicsClaw", owner: "TianGzlab" },
  { name: "MagiClaw", full_name: "sjtu-sai-agents/MagiClaw", description: "Magical research automation framework", language: "Python", stars: 110, forks: 3, weeklyStars: 4, updated: "1 week ago", url: "https://github.com/sjtu-sai-agents/MagiClaw", owner: "sjtu-sai-agents" },
];