interface VisionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function VisionCard({ title, description, icon }: VisionCardProps) {
  return (
    <div 
      className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 theme-transition card-hover-lift"
      role="article"
      aria-labelledby={`vision-${title}`}
    >
      <div className="w-12 h-12 bg-brand-light dark:bg-brand-dark rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 
        id={`vision-${title}`}
        className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2"
      >
        {title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

export function VisionSection() {
  const visions = [
    {
      title: '每个人都可以成为科学家',
      description: '我们相信科学不应该被高墙围住。无论你在哪里，做什么，只要有好奇心，就能参与科学发现。',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: '每个科学家都是一个 group',
      description: '一个人也可以是一个团队。通过智能体协作，单个研究者可以拥有整个实验室的能力。',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: '多智能体系统是研究者的合作伙伴',
      description: 'AI 不是替代者，而是增强者。多智能体系统与人类研究者协作，共同推进科学边界。',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-800 theme-transition" aria-labelledby="vision-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          id="vision-heading"
          className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-12"
        >
          我们的愿景
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {visions.map((vision) => (
            <VisionCard key={vision.title} {...vision} />
          ))}
        </div>
      </div>
    </section>
  );
}
