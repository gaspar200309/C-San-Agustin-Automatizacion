import { useState, useEffect } from 'react';

export const useTheme = (initialTheme = 'light') => {
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
    console.log(`Theme changed to: ${newTheme}`);
  };
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || initialTheme;
    setTheme(savedTheme);
    document.body.classList.toggle('dark', savedTheme === 'dark');
  }, [initialTheme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, toggleTheme };
};
