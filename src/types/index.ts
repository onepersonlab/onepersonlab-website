// 导入基础类型
import type { RepoData } from '../components/RepoShowcase/RepoShowcase';
import type { Paper } from '../components/PaperList/PaperList';
import type { ProjectLink } from '../components/ProjectLinks/ProjectLinks';

// 重新导出基础类型
export type { RepoData, Paper, ProjectLink };

// 组件 Props 类型
export interface VisionCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface VisionSectionProps {
  visions?: VisionCard[];
}

export interface RepoShowcaseProps {
  repos: RepoData[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: Date | null;
}

export interface PaperListProps {
  papers: Paper[];
  onViewPaper?: (paper: Paper) => void;
}

export interface ProjectLinksProps {
  projects: ProjectLink[];
}
