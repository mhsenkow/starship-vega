import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Divider,
  useTheme as useMuiTheme,
  Fade,
  Chip
} from '@mui/material';
import { Close as CloseIcon, Palette as PaletteIcon } from '@mui/icons-material';
import { ThemeSelector } from './ThemeSelector';
import { ColorSetsPanel } from './ColorSetsPanel';
import { useTheme } from '../../styles/ThemeProvider';
import { themeMetadata } from '../../styles/theme';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { testCurrentTheme, type SemanticColorSets } from '../../utils/vegaThemes';

interface ThemePanelProps {
  open: boolean;
  onClose: () => void;
}

export const ThemePanel = ({ open, onClose }: ThemePanelProps) => {
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const currentThemeData = themeMetadata[mode];

  const handleColorSetApplied = (colorSetName: keyof SemanticColorSets, colors: string[]) => {
    console.log(`[Theme Panel] Color set "${colorSetName}" applied:`, colors);
    
    // Show a brief success feedback
    const colorNames = colors.join(', ');
    console.log(`[Theme Panel] ${colorSetName} colors copied to clipboard: ${colorNames}`);
    
    // You could add a toast notification here if desired
    // For now, we just log the successful application
  };

  // Theme-specific panel styling
  const getPanelStyling = () => {
    const baseStyle = {
      width: 380,
      maxWidth: '90vw',
      background: muiTheme.palette.background.paper,
      border: `1px solid ${muiTheme.palette.divider}`,
      borderRight: 'none',
      overflow: 'hidden',
    };

    switch (mode) {
      case 'brutalist':
        return {
          ...baseStyle,
          borderRadius: '0px', // No rounded corners
          border: '3px solid #000000',
          borderRight: 'none',
          boxShadow: '8px 8px 0px #000000',
        };
      
      case 'neon':
        return {
          ...baseStyle,
          borderRadius: '4px 0 0 4px', // Minimal rounding
          background: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid rgba(0, 245, 255, 0.5)',
          borderRight: 'none',
          boxShadow: '0 0 30px rgba(0, 245, 255, 0.3), inset 0 0 30px rgba(0, 245, 255, 0.1)',
        };
      
      case 'neumorphism':
        return {
          ...baseStyle,
          borderRadius: '24px 0 0 24px', // Very rounded
          background: '#e0e5ec',
          border: 'none',
          borderRight: 'none',
          boxShadow: '8px 8px 20px #d1d1d1, -8px -8px 20px #ffffff',
        };
      
      case 'fluent':
        return {
          ...baseStyle,
          borderRadius: '20px 0 0 20px', // Larger radius for more premium feel
          background: 'rgba(255, 255, 255, 0.05)', // Much more transparent
          backdropFilter: 'blur(50px) saturate(1.9) brightness(1.2)', // Stronger blur
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRight: 'none',
          boxShadow: `
            0 16px 48px rgba(31, 38, 135, 0.2),
            0 8px 24px rgba(31, 38, 135, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1)
          `,
        };
      
      case 'material3':
        return {
          ...baseStyle,
          borderRadius: '16px 0 0 16px', // Google's preferred rounding
          background: muiTheme.palette.background.paper,
          border: `1px solid ${muiTheme.palette.divider}`,
          borderRight: 'none',
        };
      
      case 'retro':
        return {
          ...baseStyle,
          borderRadius: '8px 0 0 8px', // Vintage moderate rounding
          background: 'linear-gradient(135deg, #faebd7, #f5deb3)',
          border: '2px solid #d2b48c',
          borderRight: 'none',
          boxShadow: '4px 4px 8px rgba(139, 69, 19, 0.3)',
        };
      
      default:
        return {
          ...baseStyle,
          borderRadius: '16px 0 0 16px',
        };
    }
  };

  // Theme-specific header styling
  const getHeaderStyling = () => {
    switch (mode) {
      case 'brutalist':
        return {
          background: '#ffffff',
          border: 'none',
          borderBottom: '3px solid #000000',
        };
      
      case 'neon':
        return {
          background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(255, 0, 110, 0.1))',
          border: 'none',
          borderBottom: '1px solid rgba(0, 245, 255, 0.3)',
        };
      
      case 'neumorphism':
        return {
          background: '#e0e5ec',
          border: 'none',
          borderBottom: 'none',
        };
      
      case 'fluent':
        return {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px) saturate(1.6) brightness(1.15)',
          border: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: `
            0 4px 16px rgba(31, 38, 135, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.4)
          `,
        };
      
      case 'retro':
        return {
          background: 'linear-gradient(135deg, #daa520, #b8860b)',
          border: 'none',
          borderBottom: '2px solid #8b7355',
        };
      
      default:
        return {
          background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}10, ${muiTheme.palette.secondary.main}05)`,
          border: 'none',
        };
    }
  };

  // Theme-specific chip styling
  const getChipStyling = () => {
    const baseChipStyle = {
      borderRadius: 2,
      fontWeight: 'medium',
      '& .MuiChip-label': {
        px: 12,
        textTransform: mode === 'brutalist' ? 'uppercase' as const : 'none' as const,
      },
    };

    switch (mode) {
      case 'brutalist':
        return {
          ...baseChipStyle,
          borderRadius: 0,
          border: '2px solid #000000',
          background: '#ffff00',
          color: '#000000',
          fontWeight: 'bold',
        };
      
      case 'neon':
        return {
          ...baseChipStyle,
          borderRadius: 1,
          border: '1px solid rgba(0, 245, 255, 0.5)',
          background: 'rgba(0, 245, 255, 0.1)',
          color: '#00f5ff',
          boxShadow: '0 0 10px rgba(0, 245, 255, 0.3)',
        };
      
      case 'neumorphism':
        return {
          ...baseChipStyle,
          borderRadius: 4,
          border: 'none',
          background: '#e0e5ec',
          boxShadow: 'inset 2px 2px 4px #d1d1d1, inset -2px -2px 4px #ffffff',
          color: '#2d3748',
        };
      
      default:
        return baseChipStyle;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: getPanelStyling(),
      }}
      SlideProps={{
        direction: 'left',
      }}
      sx={{
        zIndex: muiTheme.zIndex.drawer + 1,
        '& .MuiDrawer-paper': {
          boxShadow: mode === 'brutalist' ? 'none' : muiTheme.shadows[16],
        },
      }}
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              pb: 2,
              ...getHeaderStyling(),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PaletteIcon sx={{ 
                color: mode === 'brutalist' ? '#000000' : 
                       mode === 'neon' ? '#00f5ff' : 
                       mode === 'retro' ? '#2f1b14' : 'primary.main', 
                fontSize: 24 
              }} />
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: mode === 'brutalist' ? 900 : 600,
                    color: mode === 'brutalist' ? '#000000' : 
                           mode === 'neon' ? '#ffffff' : 
                           mode === 'retro' ? '#2f1b14' : 'text.primary',
                    lineHeight: 1.2,
                    textTransform: mode === 'brutalist' ? 'uppercase' : 'none',
                    fontFamily: mode === 'brutalist' ? '"Arial Black", sans-serif' : 
                               mode === 'retro' ? '"Georgia", serif' : 'inherit',
                  }}
                >
                  {mode === 'brutalist' ? 'APPEARANCE' : 'Appearance'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: mode === 'brutalist' ? '#333333' : 
                           mode === 'neon' ? '#00f5ff' : 
                           mode === 'retro' ? '#5d4e37' : 'text.secondary',
                    fontSize: '0.95rem',
                    textTransform: mode === 'brutalist' ? 'uppercase' : 'none',
                  }}
                >
                  {mode === 'brutalist' ? 'CUSTOMIZE YOUR VIEW' : 'Customize your viewing experience'}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: mode === 'brutalist' ? '#000000' : 
                       mode === 'neon' ? '#ff006e' : 
                       mode === 'retro' ? '#2f1b14' : 'text.secondary',
                '&:hover': {
                  backgroundColor: mode === 'brutalist' ? '#f0f0f0' : 
                                  mode === 'neon' ? 'rgba(255, 0, 110, 0.1)' : 'action.hover',
                  transform: mode === 'brutalist' ? 'none' : 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Current Theme Display */}
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography variant="body2" sx={{ 
              color: mode === 'brutalist' ? '#333333' : 
                     mode === 'neon' ? '#00f5ff' : 
                     mode === 'retro' ? '#5d4e37' : 'text.secondary', 
              mb: 1,
              fontSize: '0.9rem',
              fontWeight: mode === 'brutalist' ? 'bold' : 'normal',
              textTransform: mode === 'brutalist' ? 'uppercase' : 'none',
            }}>
              {mode === 'brutalist' ? 'CURRENT THEME' : 'Current Theme'}
            </Typography>
            <Chip
              label={`${currentThemeData.name} • ${currentThemeData.description}`}
              variant="outlined"
              sx={{
                ...getChipStyling(),
              }}
            />
          </Box>

          <Divider sx={{ 
            mx: 3,
            borderColor: mode === 'brutalist' ? '#000000' : 
                        mode === 'neon' ? 'rgba(0, 245, 255, 0.3)' : 
                        mode === 'retro' ? '#d2b48c' : 'divider',
            borderWidth: mode === 'brutalist' ? 2 : 1,
          }} />

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
              pt: 2,
              '&::-webkit-scrollbar': {
                width: 6,
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: mode === 'brutalist' ? '#000000' : 
                           mode === 'neon' ? 'rgba(0, 245, 255, 0.5)' : muiTheme.palette.divider,
                borderRadius: mode === 'brutalist' ? 0 : 3,
                '&:hover': {
                  background: mode === 'brutalist' ? '#333333' : 
                             mode === 'neon' ? 'rgba(0, 245, 255, 0.8)' : muiTheme.palette.text.secondary,
                },
              },
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: mode === 'brutalist' ? '#333333' : 
                       mode === 'neon' ? '#ffffff' : 
                       mode === 'retro' ? '#5d4e37' : 'text.secondary',
                mb: 2,
                fontSize: '0.9rem',
                fontWeight: mode === 'brutalist' ? 'bold' : 'medium',
                textTransform: mode === 'brutalist' ? 'uppercase' : 'none',
              }}
            >
              {mode === 'brutalist' ? 'SELECT YOUR THEME' : 'Choose a theme that suits your style'}
            </Typography>
            <ThemeSelector />
            <ColorSetsPanel onColorSetApplied={handleColorSetApplied} />
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              pt: 2,
              borderTop: `${mode === 'brutalist' ? '2' : '1'}px solid ${
                mode === 'brutalist' ? '#000000' : 
                mode === 'neon' ? 'rgba(0, 245, 255, 0.3)' : 
                mode === 'retro' ? '#d2b48c' : muiTheme.palette.divider
              }`,
              background: mode === 'brutalist' ? '#ffffff' : 
                         mode === 'neon' ? 'rgba(0, 0, 0, 0.5)' : 
                         mode === 'neumorphism' ? '#e0e5ec' : 
                         mode === 'retro' ? 'linear-gradient(135deg, #f5deb3, #faebd7)' :
                         `linear-gradient(135deg, ${muiTheme.palette.background.default}, ${muiTheme.palette.action.hover}20)`,
            }}
          >
            {/* Test Theme Button */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <button
                onClick={() => {
                  const themeResult = testCurrentTheme();
                  console.log('=== TESTING VEGA COLORS ===');
                  console.log('Theme result:', themeResult);
                  
                  // Check if a color set is active
                  const selectedColorSet = document.documentElement.getAttribute('data-color-set');
                  if (selectedColorSet) {
                    console.log('Active color set:', selectedColorSet);
                    
                    // Get the current semantic colors
                    import('../../utils/vegaThemes').then(({ getSemanticColors }) => {
                      const semanticColors = getSemanticColors();
                      const activeColors = semanticColors[selectedColorSet as keyof typeof semanticColors];
                      console.log('Active color set colors:', activeColors);
                    });
                  } else {
                    console.log('No color set active, using theme colors');
                  }
                  
                  // Test a simple chart spec
                  const testSpec = {
                    mark: 'bar',
                    encoding: {
                      x: { field: 'a', type: 'nominal' },
                      y: { field: 'b', type: 'quantitative' },
                      color: { field: 'category', type: 'nominal' }
                    },
                    data: { values: [
                      { a: 'A', b: 28, category: 'X' },
                      { a: 'B', b: 55, category: 'Y' },
                      { a: 'C', b: 43, category: 'Z' }
                    ]}
                  };
                  
                  // Import and test force apply
                  import('../../utils/vegaThemes').then(({ forceApplyThemeColors, getCurrentVegaTheme }) => {
                    const currentTheme = getCurrentVegaTheme();
                    console.log('Current Vega theme:', currentTheme);
                    console.log('Theme category colors:', currentTheme.range?.category);
                    
                    const themedSpec = forceApplyThemeColors(testSpec);
                    console.log('Original spec:', testSpec);
                    console.log('Themed spec:', themedSpec);
                    console.log('Applied colors:', themedSpec.config?.range?.category);
                  });
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: mode === 'brutalist' ? '#ffff00' : 
                                  mode === 'neon' ? 'rgba(0, 245, 255, 0.1)' : 
                                  muiTheme.palette.primary.main,
                  color: mode === 'brutalist' ? '#000000' : 
                         mode === 'neon' ? '#00f5ff' : '#ffffff',
                  border: mode === 'brutalist' ? '2px solid #000000' : 
                          mode === 'neon' ? '1px solid rgba(0, 245, 255, 0.5)' : 'none',
                  borderRadius: mode === 'brutalist' ? '0px' : '4px',
                  fontWeight: mode === 'brutalist' ? 'bold' : 'normal',
                  textTransform: mode === 'brutalist' ? 'uppercase' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {mode === 'brutalist' ? 'TEST COLORS' : 'Test Theme Colors'}
              </button>
            </Box>
            
            <Typography
              variant="caption"
              sx={{
                color: mode === 'brutalist' ? '#333333' : 
                       mode === 'neon' ? '#00f5ff' : 
                       mode === 'retro' ? '#5d4e37' : 'text.secondary',
                display: 'block',
                textAlign: 'center',
                fontSize: '0.85rem',
                fontStyle: mode === 'brutalist' ? 'normal' : 'italic',
                lineHeight: 1.4,
                fontWeight: mode === 'brutalist' ? 'bold' : 'normal',
                textTransform: mode === 'brutalist' ? 'uppercase' : 'none',
              }}
            >
              {mode === 'brutalist' ? 'THEMES & COLORS APPLY INSTANTLY' :
               mode === 'neon' ? '⚡ CYBER THEMES & COLOR SETS SYNC INSTANTLY' :
               '✨ Theme and color set changes apply instantly across all charts'}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Drawer>
  );
}; 