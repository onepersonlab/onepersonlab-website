export interface ProjectLink {
  name: string;
  description: string;
  url: string;
  tags?: string[];
}

interface ProjectCardProps {
  project: ProjectLink;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article 
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
      aria-labelledby={`project-${project.name}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 
          id={`project-${project.name}`}
          className="text-lg font-semibold text-gray-900"
        >
          {project.name}
        </h3>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
          aria-label={`访问 ${project.name} 网站`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
      
      <p className="text-gray-600 mb-4">
        {project.description}
      </p>
      
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

interface ProjectLinksProps {
  projects: ProjectLink[];
}

export function ProjectLinks({ projects }: ProjectLinksProps) {
  return (
    <section className="py-20 bg-white" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          id="projects-heading"
          className="text-3xl font-bold text-center text-gray-900 mb-12"
        >
          相关项目
        </h2>

        {projects.length === 0 ? (
          <div className="text-center py-12" role="status">
            <p className="text-gray-500">暂无项目数据</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={`${project.name}-${index}`} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
