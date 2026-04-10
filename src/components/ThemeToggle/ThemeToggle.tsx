import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, actualTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    // 循环切换：light -> dark -> system -> light
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      // 系统主题图标 - 显示当前实际主题
      return actualTheme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    return theme === 'dark' ? (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      return '跟随系统';
    }
    return theme === 'dark' ? '深色模式' : '浅色模式';
  };

  return (
    <button
      onClick={cycleTheme}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg 
                 bg-neutral-100 hover:bg-neutral-200 
                 dark:bg-neutral-800 dark:hover:bg-neutral-700
                 text-neutral-700 dark:text-neutral-300
                 transition-colors duration-200
                 button-press
                 focus:outline-none focus:ring-2 focus:ring-brand-primary
                 ${className}`}
      aria-label={`切换主题，当前：${getThemeLabel()}`}
      title={`当前：${getThemeLabel()}，点击切换`}
    >
      {getThemeIcon()}
      <span className="text-sm hidden sm:inline">{getThemeLabel()}</span>
    </button>
  );
}
