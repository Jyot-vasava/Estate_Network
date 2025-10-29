import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, setTheme } from "../features/theme/themeSlice";

/**
 * Custom hook for theme management
 */
export const useTheme = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme class to document
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const setMode = (newMode) => {
    dispatch(setTheme(newMode));
  };

  return {
    mode,
    isDark: mode === "dark",
    toggle,
    setMode,
  };
};
