import { useState, useEffect } from "react";
import { createTheme } from '@mui/material/styles';

export const useThemeContext = () => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    if (theme === "light") {
      window.localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      window.localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    localTheme && setTheme(localTheme);
  }, []);

  return [theme, toggleTheme] as const;
};

export const themeLight = createTheme({
  palette: {
    mode: 'light',
  },
});

export const themeDark = createTheme({
  palette: {
    mode: 'dark',
  },
});
