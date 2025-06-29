import { useTheme } from './ui/ThemeProvider';

export function useColorScheme() {
  const { theme } = useTheme();
  return theme;
}