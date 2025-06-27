import { useTheme } from './ThemeContext';

export function useColorScheme() {
  const { theme } = useTheme();
  return theme;
}