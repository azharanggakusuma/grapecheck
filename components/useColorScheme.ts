import { useTheme } from './theme/ThemeProvider';

export function useColorScheme() {
  const { theme } = useTheme();
  return theme;
}