import { ReactNode, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { useTheme } from './ThemeProvider';

interface MuiThemeProviderProps {
  children: ReactNode;
}

export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
  const { theme } = useTheme();
  
  // Create a Material UI theme based on our styled-components theme
  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: ['light', 'fluent', 'material3', 'neumorphism', 'brutalist', 'retro'].includes(theme.mode) ? 'light' : 'dark',
      primary: {
        main: theme.colors.primary,
        contrastText: '#ffffff',
      },
      secondary: {
        main: theme.colors.secondary,
      },
      error: {
        main: theme.colors.error,
      },
      warning: {
        main: theme.colors.warning,
      },
      info: {
        main: theme.colors.info,
      },
      success: {
        main: theme.colors.success,
      },
      background: {
        default: getBackgroundDefault(theme.mode),
        paper: getPaperBackground(theme),
      },
      text: {
        primary: theme.colors.text.primary,
        secondary: theme.colors.text.secondary,
      },
    },
    typography: {
      fontFamily: getTypographyFontFamily(theme),
      fontSize: parseInt(theme.typography.fontSize.md.replace('px', '').replace('rem', '').replace('em', '')) || 14,
      h1: {
        fontSize: theme.typography.fontSize.xxxl,
        fontWeight: theme.typography.fontWeight.bold,
        ...(theme.mode === 'brutalist' && {
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: 900,
        }),
      },
      h2: {
        fontSize: theme.typography.fontSize.xxl,
        fontWeight: theme.typography.fontWeight.bold,
        ...(theme.mode === 'brutalist' && {
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontWeight: 900,
        }),
      },
      h3: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
      },
      h4: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold,
      },
      h5: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.medium,
      },
      h6: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
      },
      body1: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.regular,
      },
      body2: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.regular,
      },
      button: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeight.medium,
        ...(theme.mode === 'brutalist' && {
          textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: '1px',
        }),
      },
    },
    shape: {
      borderRadius: getBorderRadius(theme),
    },
    spacing: (factor: number) => {
      const spacingMap = {
        0: theme.spacing.none || '0px',
        1: theme.spacing.xs,
        2: theme.spacing.sm,
        3: theme.spacing.md,
        4: theme.spacing.lg,
        5: theme.spacing.xl,
        6: theme.spacing.xxl || '48px',
        8: theme.spacing.xxxl || '64px',
      };
      // @ts-ignore
      return spacingMap[factor] || `${factor * 8}px`;
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: getBorderRadius(theme),
            textTransform: 'none',
            fontWeight: theme.typography.fontWeight.medium,
            padding: '8px 16px',
            ...(theme.mode === 'brutalist' && {
              border: '2px solid #000000',
              borderRadius: '0px',
              boxShadow: '3px 3px 0px #000000',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              '&:hover': {
                transform: 'translate(1px, 1px)',
                boxShadow: '2px 2px 0px #000000',
              },
            }),
            ...(theme.mode === 'neumorphism' && {
              boxShadow: '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff',
              border: 'none',
              '&:hover': {
                boxShadow: '2px 2px 4px #d1d1d1, -2px -2px 4px #ffffff',
              },
            }),
          },
          contained: {
            backgroundColor: theme.colors.primary,
            color: getButtonTextColor(theme.mode),
            '&:hover': {
              backgroundColor: getButtonHoverColor(theme.mode),
            },
          },
          outlined: {
            borderColor: getDarkModeColors(theme.mode).borderColor,
            color: theme.colors.text.primary,
            '&:hover': {
              backgroundColor: getDarkModeColors(theme.mode).hoverBackground,
              borderColor: getDarkModeColors(theme.mode).hoverBorderColor,
            },
          },
          text: {
            color: theme.colors.primary,
            '&:hover': {
              backgroundColor: getDarkModeColors(theme.mode).textHoverBackground,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: getPaperBackground(theme),
            borderRadius: getBorderRadius(theme),
            ...getPaperEffects(theme),
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.elevation.md,
            ...getCardEffects(theme),
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: theme.colors.text.secondary,
            '&:hover': {
              backgroundColor: theme.colors.surfaceHover,
            },
            ...(theme.mode === 'neon' && {
              '&:hover': {
                boxShadow: '0 0 15px rgba(0, 245, 255, 0.4)',
              },
            }),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: getAppBarBackground(theme),
            color: theme.colors.appBarText,
            boxShadow: theme.elevation.sm,
            ...getAppBarEffects(theme),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: theme.colors.sideNav,
            ...getDrawerEffects(theme),
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: getMenuBackground(theme),
            border: getMenuBorder(theme),
            boxShadow: getMenuShadow(theme),
            ...getMenuEffects(theme),
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: getMenuItemColor(theme),
            '&:hover': {
              backgroundColor: getMenuItemHoverBackground(theme),
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: theme.typography.fontWeight.medium,
            color: getTabColor(theme),
            '&.Mui-selected': {
              color: theme.colors.primary,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: theme.colors.primary,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: getTooltipBackground(theme),
            color: getTooltipColor(theme),
            fontSize: theme.typography.fontSize.xs,
            fontWeight: 400,
            padding: '6px 10px',
            borderRadius: '4px',
          },
          arrow: {
            color: getTooltipBackground(theme),
          }
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            backgroundColor: getToggleGroupBackground(theme),
            borderRadius: '6px',
            padding: '2px',
            border: getToggleGroupBorder(theme),
            ...getToggleGroupEffects(theme),
          },
          grouped: {
            margin: '2px',
            borderRadius: '4px !important',
            border: 'none !important',
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            backgroundColor: getToggleButtonBackground(theme),
            borderColor: 'transparent !important',
            color: getToggleButtonColor(theme),
            boxShadow: getToggleButtonShadow(theme),
            border: 'none !important',
            '&.Mui-selected': {
              backgroundColor: getToggleButtonSelectedBackground(theme),
              color: getToggleButtonSelectedColor(theme),
              boxShadow: getToggleButtonSelectedShadow(theme),
              '&:hover': {
                backgroundColor: getToggleButtonSelectedHoverBackground(theme),
              },
            },
            '&:hover': {
              backgroundColor: getToggleButtonHoverBackground(theme),
              borderColor: 'transparent !important',
            },
          },
          sizeSmall: {
            padding: '4px 8px',
          },
        },
      },
    },
  }), [theme]);

  return (
    <MUIThemeProvider theme={muiTheme}>
      {children}
    </MUIThemeProvider>
  );
};

// Helper functions for theme-specific styling
function getBackgroundDefault(mode: string) {
  switch (mode) {
    case 'fluent': return '#f5f5f5';
    case 'neon': return '#0a0a0a';
    case 'material3': return '#fffbfe';
    case 'neumorphism': return '#e0e5ec';
    case 'brutalist': return '#ffffff';
    case 'retro': return '#f5deb3';
    case 'dark': return '#121212';
    default: return '#ffffff';
  }
}

function getTypographyFontFamily(theme: any) {
  switch (theme.mode) {
    case 'material3': return '"Roboto", "Helvetica", "Arial", sans-serif';
    case 'brutalist': return '"Arial Black", "Helvetica", sans-serif';
    case 'retro': return '"Georgia", "Times New Roman", serif';
    case 'fluent': return '"Segoe UI", "Helvetica", "Arial", sans-serif';
    case 'neon': return '"Courier New", monospace';
    default: return theme.typography.fontFamily.body;
  }
}

function getBorderRadius(theme: any) {
  switch (theme.mode) {
    case 'brutalist': return 0;
    case 'neon': return 4;
    case 'neumorphism': return 20;
    case 'material3': return 16;
    case 'fluent': return 8;
    case 'retro': return 10;
    default: return parseInt(theme.borderRadius?.md?.replace('px', '') || '8');
  }
}

function getButtonTextColor(mode: string) {
  if (mode === 'brutalist') return '#000000';
  return '#ffffff';
}

function getButtonHoverColor(mode: string) {
  switch (mode) {
    case 'neon': return '#00c4d4';
    case 'fluent': return '#106ebe';
    case 'material3': return '#5a4588';
    case 'neumorphism': return '#5a6de8';
    case 'brutalist': return '#ffff00';
    case 'retro': return '#b8860b';
    case 'dark': return '#2979ff';
    default: return '#1565c0';
  }
}

function getDarkModeColors(mode: string) {
  switch (mode) {
    case 'dark':
      return {
        borderColor: 'rgba(255, 255, 255, 0.23)',
        hoverBackground: 'rgba(255, 255, 255, 0.08)',
        hoverBorderColor: 'rgba(255, 255, 255, 0.5)',
        textHoverBackground: 'rgba(25, 118, 210, 0.12)',
      };
    case 'neon':
      return {
        borderColor: 'rgba(0, 245, 255, 0.5)',
        hoverBackground: 'rgba(0, 245, 255, 0.08)',
        hoverBorderColor: 'rgba(0, 245, 255, 0.8)',
        textHoverBackground: 'rgba(0, 245, 255, 0.12)',
      };
    case 'fluent':
      return {
        borderColor: 'rgba(0, 120, 212, 0.5)',
        hoverBackground: 'rgba(0, 120, 212, 0.08)',
        hoverBorderColor: 'rgba(0, 120, 212, 0.8)',
        textHoverBackground: 'rgba(0, 120, 212, 0.12)',
      };
    case 'material3':
      return {
        borderColor: 'rgba(103, 80, 164, 0.5)',
        hoverBackground: 'rgba(103, 80, 164, 0.08)',
        hoverBorderColor: 'rgba(103, 80, 164, 0.8)',
        textHoverBackground: 'rgba(103, 80, 164, 0.12)',
      };
    case 'neumorphism':
      return {
        borderColor: 'rgba(102, 126, 234, 0.5)',
        hoverBackground: 'rgba(102, 126, 234, 0.08)',
        hoverBorderColor: 'rgba(102, 126, 234, 0.8)',
        textHoverBackground: 'rgba(102, 126, 234, 0.12)',
      };
    case 'brutalist':
      return {
        borderColor: '#000000',
        hoverBackground: '#f0f0f0',
        hoverBorderColor: '#000000',
        textHoverBackground: '#ffff00',
      };
    case 'retro':
      return {
        borderColor: 'rgba(210, 105, 30, 0.5)',
        hoverBackground: 'rgba(210, 105, 30, 0.08)',
        hoverBorderColor: 'rgba(210, 105, 30, 0.8)',
        textHoverBackground: 'rgba(210, 105, 30, 0.12)',
      };
    default:
      return {
        borderColor: 'rgba(0, 0, 0, 0.23)',
        hoverBackground: 'rgba(0, 0, 0, 0.04)',
        hoverBorderColor: 'rgba(0, 0, 0, 0.5)',
        textHoverBackground: 'rgba(25, 118, 210, 0.08)',
      };
  }
}

function getPaperBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(255, 255, 255, 0.7)';
  if (theme.mode === 'neon') return 'rgba(20, 20, 20, 0.95)';
  return theme.colors.surface;
}

function getPaperEffects(theme: any) {
  const effects: any = {};
  
  if (theme.mode === 'fluent') {
    effects.backdropFilter = 'blur(20px)';
    effects.border = '1px solid rgba(255, 255, 255, 0.18)';
    effects.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
  } else if (theme.mode === 'neon') {
    effects.border = '1px solid rgba(0, 245, 255, 0.3)';
    effects.boxShadow = '0 0 20px rgba(0, 245, 255, 0.2), inset 0 0 20px rgba(0, 245, 255, 0.1)';
  } else if (theme.mode === 'neumorphism') {
    effects.boxShadow = '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff';
    effects.border = 'none';
  } else if (theme.mode === 'brutalist') {
    effects.border = '3px solid #000000';
    effects.boxShadow = '5px 5px 0px #000000';
  }
  
  return effects;
}

function getCardEffects(theme: any) {
  const effects: any = {};
  
  if (theme.mode === 'retro') {
    effects.boxShadow = '4px 4px 8px rgba(139, 69, 19, 0.3)';
  } else if (theme.mode === 'material3') {
    effects.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)';
  }
  
  return effects;
}

function getAppBarBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(248, 248, 248, 0.9)';
  if (theme.mode === 'neon') return 'rgba(10, 10, 10, 0.98)';
  return theme.colors.appBar;
}

function getAppBarEffects(theme: any) {
  const effects: any = {};
  
  if (theme.mode === 'fluent') {
    effects.backdropFilter = 'blur(20px)';
    effects.borderBottom = '1px solid rgba(255, 255, 255, 0.18)';
  } else if (theme.mode === 'neon') {
    effects.borderBottom = '1px solid rgba(0, 245, 255, 0.3)';
    effects.boxShadow = '0 0 20px rgba(0, 245, 255, 0.2)';
  } else if (theme.mode === 'brutalist') {
    effects.borderBottom = '3px solid #000000';
  }
  
  return effects;
}

function getDrawerEffects(theme: any) {
  const effects: any = {};
  
  if (theme.mode === 'fluent') {
    effects.backdropFilter = 'blur(20px)';
  } else if (theme.mode === 'neon') {
    effects.border = '1px solid rgba(0, 245, 255, 0.3)';
  }
  
  return effects;
}

function getMenuBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(255, 255, 255, 0.9)';
  if (theme.mode === 'neon') return 'rgba(20, 20, 20, 0.95)';
  return theme.mode === 'dark' ? '#424242' : '#ffffff';
}

function getMenuBorder(theme: any) {
  if (theme.mode === 'fluent') return '1px solid rgba(255, 255, 255, 0.3)';
  if (theme.mode === 'neon') return '1px solid rgba(0, 245, 255, 0.3)';
  if (theme.mode === 'brutalist') return '2px solid #000000';
  return theme.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)';
}

function getMenuShadow(theme: any) {
  if (theme.mode === 'fluent') return '0 8px 32px rgba(31, 38, 135, 0.37)';
  if (theme.mode === 'neon') return '0 0 20px rgba(0, 245, 255, 0.3)';
  if (theme.mode === 'brutalist') return '3px 3px 0px #000000';
  return theme.mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.1)';
}

function getMenuEffects(theme: any) {
  const effects: any = {};
  
  if (theme.mode === 'fluent') {
    effects.backdropFilter = 'blur(20px)';
  } else if (theme.mode === 'neumorphism') {
    effects.boxShadow = '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff';
  }
  
  return effects;
}

function getMenuItemColor(theme: any) {
  if (theme.mode === 'neon') return '#ffffff';
  return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)';
}

function getMenuItemHoverBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(0, 120, 212, 0.08)';
  if (theme.mode === 'neon') return 'rgba(0, 245, 255, 0.08)';
  if (theme.mode === 'brutalist') return '#ffff00';
  return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
}

function getTabColor(theme: any) {
  if (theme.mode === 'neon') return 'rgba(255, 255, 255, 0.7)';
  return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
}

function getTooltipBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(50, 49, 48, 0.9)';
  if (theme.mode === 'neon') return 'rgba(0, 245, 255, 0.9)';
  if (theme.mode === 'brutalist') return '#000000';
  return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
}

function getTooltipColor(theme: any) {
  if (theme.mode === 'fluent') return '#ffffff';
  if (theme.mode === 'neon') return '#000000';
  if (theme.mode === 'brutalist') return '#ffffff';
  return theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
}

function getToggleGroupBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(255, 255, 255, 0.3)';
  if (theme.mode === 'neon') return 'rgba(10, 10, 10, 0.8)';
  if (theme.mode === 'neumorphism') return '#e0e5ec';
  if (theme.mode === 'brutalist') return '#ffffff';
  return theme.mode === 'dark' ? 'rgba(30, 30, 30, 0.4)' : 'rgba(0, 0, 0, 0.04)';
}

function getToggleGroupBorder(theme: any) {
  if (theme.mode === 'fluent') return '1px solid rgba(255, 255, 255, 0.18)';
  if (theme.mode === 'neon') return '1px solid rgba(0, 245, 255, 0.3)';
  if (theme.mode === 'brutalist') return '2px solid #000000';
  return 'none';
}

function getToggleGroupEffects(theme: any) {
  const effects: any = {};
  
  if (theme.mode === 'fluent') {
    effects.backdropFilter = 'blur(10px)';
  } else if (theme.mode === 'neon') {
    effects.boxShadow = '0 0 10px rgba(0, 245, 255, 0.2)';
  } else if (theme.mode === 'neumorphism') {
    effects.boxShadow = '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff';
  } else if (theme.mode === 'brutalist') {
    effects.boxShadow = '3px 3px 0px #000000';
  }
  
  return effects;
}

function getToggleButtonBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(255, 255, 255, 0.6)';
  if (theme.mode === 'neon') return 'rgba(20, 20, 20, 0.8)';
  if (theme.mode === 'neumorphism') return '#e0e5ec';
  if (theme.mode === 'brutalist') return '#ffffff';
  return theme.mode === 'dark' ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.9)';
}

function getToggleButtonColor(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(50, 49, 48, 0.8)';
  if (theme.mode === 'neon') return 'rgba(255, 255, 255, 0.7)';
  if (theme.mode === 'brutalist') return '#000000';
  return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
}

function getToggleButtonShadow(theme: any) {
  if (theme.mode === 'fluent') return '0 2px 8px rgba(0, 0, 0, 0.1)';
  if (theme.mode === 'neon') return '0 0 5px rgba(0, 245, 255, 0.2)';
  if (theme.mode === 'neumorphism') return '2px 2px 4px #d1d1d1, -2px -2px 4px #ffffff';
  if (theme.mode === 'brutalist') return '2px 2px 0px #000000';
  return theme.mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.4)' : 'none';
}

function getToggleButtonSelectedBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(0, 120, 212, 0.2)';
  if (theme.mode === 'neon') return 'rgba(0, 245, 255, 0.2)';
  if (theme.mode === 'material3') return 'rgba(103, 80, 164, 0.2)';
  if (theme.mode === 'neumorphism') return '#d6dbe2';
  if (theme.mode === 'brutalist') return '#ffff00';
  if (theme.mode === 'retro') return 'rgba(210, 105, 30, 0.2)';
  return theme.mode === 'dark' ? 'rgba(66, 165, 245, 0.3)' : 'rgba(25, 118, 210, 0.12)';
}

function getToggleButtonSelectedColor(theme: any) {
  if (theme.mode === 'fluent') return '#0078d4';
  if (theme.mode === 'neon') return '#00f5ff';
  if (theme.mode === 'material3') return '#6750a4';
  if (theme.mode === 'neumorphism') return '#667eea';
  if (theme.mode === 'brutalist') return '#000000';
  if (theme.mode === 'retro') return '#d2691e';
  return theme.mode === 'dark' ? '#90caf9' : '#1976d2';
}

function getToggleButtonSelectedShadow(theme: any) {
  if (theme.mode === 'fluent') return '0 4px 12px rgba(0, 120, 212, 0.3)';
  if (theme.mode === 'neon') return '0 0 15px rgba(0, 245, 255, 0.5)';
  if (theme.mode === 'neumorphism') return 'inset 2px 2px 4px #d1d1d1, inset -2px -2px 4px #ffffff';
  if (theme.mode === 'brutalist') return '1px 1px 0px #000000';
  return theme.mode === 'dark' ? '0 0 5px rgba(66, 165, 245, 0.5)' : 'none';
}

function getToggleButtonSelectedHoverBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(0, 120, 212, 0.3)';
  if (theme.mode === 'neon') return 'rgba(0, 245, 255, 0.3)';
  if (theme.mode === 'material3') return 'rgba(103, 80, 164, 0.3)';
  if (theme.mode === 'neumorphism') return '#ccd1d8';
  if (theme.mode === 'brutalist') return '#ffff99';
  if (theme.mode === 'retro') return 'rgba(210, 105, 30, 0.3)';
  return theme.mode === 'dark' ? 'rgba(66, 165, 245, 0.4)' : 'rgba(25, 118, 210, 0.2)';
}

function getToggleButtonHoverBackground(theme: any) {
  if (theme.mode === 'fluent') return 'rgba(0, 120, 212, 0.08)';
  if (theme.mode === 'neon') return 'rgba(0, 245, 255, 0.08)';
  if (theme.mode === 'material3') return 'rgba(103, 80, 164, 0.08)';
  if (theme.mode === 'neumorphism') return '#d6dbe2';
  if (theme.mode === 'brutalist') return '#f0f0f0';
  if (theme.mode === 'retro') return 'rgba(210, 105, 30, 0.08)';
  return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)';
} 