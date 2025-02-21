import { colors, spacing, typography, borders, shadows, transitions, layout, zIndex } from './foundations';
import { ChartStyle } from '../../types/chart';

export interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  borders: typeof borders;
  shadows: typeof shadows;
  transitions: typeof transitions;
  layout: typeof layout;
  zIndex: typeof zIndex;
  
  // Component-specific themes
  components: {
    card: {
      background: string;
      borderColor: string;
      hoverShadow: string;
      borderRadius: string;
    };
    button: {
      primary: {
        background: string;
        color: string;
        hoverBackground: string;
        activeBorder: string;
      };
      secondary: {
        background: string;
        color: string;
        hoverBackground: string;
        activeBorder: string;
      };
    };
    input: {
      background: string;
      borderColor: string;
      focusBorderColor: string;
      placeholderColor: string;
    };
  };
  
  // Chart-specific theme that extends the ChartStyle type
  chart: ChartStyle;
}

export const defaultTheme: Theme = {
  colors,
  spacing,
  typography,
  borders,
  shadows,
  transitions,
  layout,
  zIndex,
  
  components: {
    card: {
      background: colors.neutral[50],
      borderColor: colors.neutral[200],
      hoverShadow: shadows.lg,
      borderRadius: borders.radius.lg
    },
    button: {
      primary: {
        background: colors.primary[500],
        color: colors.neutral[50],
        hoverBackground: colors.primary[600],
        activeBorder: colors.primary[700]
      },
      secondary: {
        background: colors.neutral[100],
        color: colors.neutral[900],
        hoverBackground: colors.neutral[200],
        activeBorder: colors.neutral[300]
      }
    },
    input: {
      background: colors.neutral[50],
      borderColor: colors.neutral[300],
      focusBorderColor: colors.primary[500],
      placeholderColor: colors.neutral[500]
    }
  },
  
  chart: {
    colors: {
      primary: colors.primary[500],
      secondary: colors.primary[300],
      background: colors.neutral[50]
    },
    marks: {
      opacity: 0.8,
      stroke: colors.neutral[50],
      strokeWidth: 1,
      blend: 'multiply'
    },
    view: {
      padding: 20,
      backgroundColor: colors.neutral[50]
    }
  }
};

export type ThemeType = typeof defaultTheme; 