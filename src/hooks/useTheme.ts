import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UseThemeResult {
  theme: ThemeMode;
  actualTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

/**
 * 主题管理 Hook
 * - 支持三种模式：light / dark / system
 * - 状态持久化到 localStorage
 * - 支持系统主题检测 (prefers-color-scheme)
 */
export function useTheme(): UseThemeResult {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // 从 localStorage 读取保存的主题
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // 检测系统主题
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  }, []);

  // 根据主题模式设置实际主题
  useEffect(() => {
    const determineTheme = () => {
      if (theme === 'system') {
        const system = getSystemTheme();
        setActualTheme(system);
      } else {
        setActualTheme(theme);
      }
    };

    determineTheme();

    // 监听系统主题变化
    if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => determineTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme, getSystemTheme]);

  // 应用主题到 DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    root.style.colorScheme = actualTheme;
  }, [actualTheme]);

  // 设置主题并持久化
  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', mode);
    }
  }, []);

  // 切换主题（用于按钮快捷操作）
  const toggleTheme = useCallback(() => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  }, [actualTheme, setTheme]);

  return {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };
}
