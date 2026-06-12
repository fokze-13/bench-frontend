export interface ThemeColors {
  bg: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  accentSoft: string;
  border: string;
  danger: string;
}

export const darkColors: ThemeColors = {
  bg: "#0B1220",
  surface: "#111B2E",
  primary: "#FFFFFF",
  secondary: "#A7B0C0",

  accent: "#4DA3FF",
  accentSoft: "#2B6FFF",

  border: "#1E2A44",
  danger: "#FF5A6A",
};

export const lightColors: ThemeColors = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  primary: "#1A202C",
  secondary: "#718096",

  accent: "#007AFF",
  accentSoft: "#E1EFFF",

  border: "#E2E8F0",
  danger: "#FF3B30",
};

// Default colors for backward compatibility
export const colors = darkColors;


export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;

