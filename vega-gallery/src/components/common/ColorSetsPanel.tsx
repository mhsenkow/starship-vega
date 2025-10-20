import React from 'react';
import { Box, Typography } from '../../design-system';
import { useThemeContext } from '../../styles/ThemeProvider.module';
import { getSemanticColors, applySemanticColors, triggerGlobalChartRefresh, type SemanticColorSets } from '../../utils/vegaThemes';
import styles from './ColorSetsPanel.module.css';

interface ColorSetsProps {
  onColorSetApplied?: (colorSetName: keyof SemanticColorSets, colors: string[]) => void;
}

export const ColorSetsPanel = ({ onColorSetApplied }: ColorSetsProps) => {
  const { mode, selectedColorSet, setSelectedColorSet } = useThemeContext();
  const semanticColors = getSemanticColors();

  const colorSetMetadata = {
    financial: {
      name: 'Financial',
      description: 'Perfect for revenue, profit, growth charts',
      icon: '💰'
    },
    sentiment: {
      name: 'Sentiment',
      description: 'Negative, neutral, positive indicators',
      icon: '😊'
    },
    status: {
      name: 'Status',
      description: 'Success, warning, error, info states',
      icon: '🚦'
    },
    performance: {
      name: 'Performance',
      description: 'Bad to good performance gradients',
      icon: '📊'
    },
    temperature: {
      name: 'Temperature',
      description: 'Cool to warm color transitions',
      icon: '🌡️'
    },
    priority: {
      name: 'Priority',
      description: 'Low, medium, high, critical levels',
      icon: '⚡'
    },
    categories: {
      name: 'Categories',
      description: 'General purpose categorical data',
      icon: '🏷️'
    },
    diverging: {
      name: 'Diverging',
      description: 'Show deviation from center point',
      icon: '↔️'
    }
  };

  const handleColorSetClick = (colorSetName: keyof SemanticColorSets) => {
    const colors = semanticColors[colorSetName];
    console.log(`[Color Sets] User selected ${colorSetName} color set:`, colors);
    
    // Set the color set as active (or toggle it off if already selected)
    if (selectedColorSet === colorSetName) {
      // If already selected, toggle off
      setSelectedColorSet(null);
      console.log(`[Color Sets] Deactivated ${colorSetName} color set`);
    } else {
      // Set new color set
      setSelectedColorSet(colorSetName);
      console.log(`[Color Sets] Activated ${colorSetName} color set`);
    }
    
    // Trigger global chart refresh after a short delay to ensure DOM is updated
    setTimeout(() => {
      triggerGlobalChartRefresh();
    }, 50);
    
    // Copy colors to clipboard as well for convenience
    const colorString = colors.join(', ');
    navigator.clipboard.writeText(colorString).then(() => {
      console.log(`[Color Sets] Copied ${colorSetName} colors to clipboard: ${colorString}`);
    }).catch(err => {
      console.warn('Failed to copy colors to clipboard:', err);
    });
    
    // Notify parent component
    onColorSetApplied?.(colorSetName, colors);
  };

  const getContainerStyle = () => {
    switch (mode) {
      case 'brutalist':
        return {
          border: '2px solid #000000',
          borderRadius: 0,
          backgroundColor: '#ffffff',
        };
      case 'neon':
        return {
          border: '1px solid rgba(0, 245, 255, 0.3)',
          borderRadius: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          boxShadow: '0 0 10px rgba(0, 245, 255, 0.2)',
        };
      case 'neumorphism':
        return {
          border: 'none',
          borderRadius: '16px',
          backgroundColor: '#e0e5ec',
          boxShadow: 'inset 2px 2px 6px #d1d1d1, inset -2px -2px 6px #ffffff',
        };
      case 'fluent':
        return {
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        };
      default:
        return {
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          backgroundColor: 'var(--color-background-primary)',
        };
    }
  };

  const getContainerStyleForColorSet = (colorSetName: keyof SemanticColorSets) => {
    const baseStyle = getContainerStyle();
    const isActive = selectedColorSet === colorSetName;
    
    if (!isActive) return baseStyle;
    
    // Add active styling based on theme
    switch (mode) {
      case 'brutalist':
        return {
          ...baseStyle,
          backgroundColor: '#ffff00',
          border: '3px solid #000000',
          boxShadow: '6px 6px 0px #000000',
        };
      case 'neon':
        return {
          ...baseStyle,
          border: '2px solid #00f5ff',
          backgroundColor: 'rgba(0, 245, 255, 0.2)',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.6), inset 0 0 20px rgba(0, 245, 255, 0.2)',
        };
      case 'neumorphism':
        return {
          ...baseStyle,
          boxShadow: '2px 2px 6px #d1d1d1, -2px -2px 6px #ffffff',
          backgroundColor: '#f0f5fa',
        };
      case 'fluent':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(0, 120, 212, 0.1)',
          border: '1px solid rgba(0, 120, 212, 0.3)',
          backdropFilter: 'blur(15px)',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-primary-20)',
          border: '2px solid var(--color-primary)',
          boxShadow: 'var(--shadow-md)',
        };
    }
  };

  const getColorSwatchStyle = (color: string, isFirst: boolean, isLast: boolean) => {
    const baseStyle = {
      backgroundColor: color,
      border: mode === 'brutalist' ? '1px solid #000000' : 'none',
      borderRadius: mode === 'brutalist' ? '0px' : 
                   mode === 'neumorphism' ? '6px' : '2px',
      boxShadow: mode === 'neon' ? `0 0 4px ${color}40` : 
                mode === 'neumorphism' ? `1px 1px 2px #d1d1d1, -1px -1px 2px #ffffff` : 'none',
    };

    if (mode === 'neumorphism') {
      return baseStyle;
    }

    return {
      ...baseStyle,
      borderTopLeftRadius: isFirst ? baseStyle.borderRadius : '0px',
      borderBottomLeftRadius: isFirst ? baseStyle.borderRadius : '0px',
      borderTopRightRadius: isLast ? baseStyle.borderRadius : '0px',
      borderBottomRightRadius: isLast ? baseStyle.borderRadius : '0px',
    };
  };

  const getTitleStyle = () => ({
    color: mode === 'brutalist' ? '#000000' : 
           mode === 'neon' ? '#ffffff' : 
           mode === 'retro' ? '#2f1b14' : 'var(--color-text-primary)',
    fontWeight: mode === 'brutalist' ? 900 : 600,
    textTransform: mode === 'brutalist' ? 'uppercase' as const : 'none' as const,
    fontFamily: mode === 'brutalist' ? '"Arial Black", sans-serif' : 'inherit',
  });

  const getDescriptionStyle = () => ({
    color: mode === 'brutalist' ? '#333333' : 
           mode === 'neon' ? '#00f5ff' : 
           mode === 'retro' ? '#5d4e37' : 'var(--color-text-secondary)',
    fontSize: '0.8rem',
    textTransform: mode === 'brutalist' ? 'uppercase' as const : 'none' as const,
  });

  return (
    <Box marginTop="var(--spacing-md)">
      <Typography 
        variant="body2" 
        style={{ 
          ...getTitleStyle(),
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {mode === 'brutalist' ? 'COLOR SETS' : 'Color Sets'}
      </Typography>
      
      <Typography 
        variant="caption" 
        style={{ 
          ...getDescriptionStyle(),
          marginBottom: 'var(--spacing-md)',
          display: 'block',
        }}
      >
        {mode === 'brutalist' ? 'CLICK TO APPLY COLORS' : 'Click to apply colors to all charts • Click again to reset'}
      </Typography>

      <Typography 
        variant="body2" 
        style={{ 
          marginBottom: 'var(--spacing-md)', 
          fontSize: '0.9rem',
          fontWeight: 'medium' 
        }}
      >
        Semantic Color Sets
      </Typography>

      <Box display="flex" flexDirection="column" gap="var(--spacing-sm)">
        {Object.entries(colorSetMetadata).map(([key, meta]) => {
          const colorSetKey = key as keyof SemanticColorSets;
          const colors = semanticColors[colorSetKey];
          const isActive = selectedColorSet === colorSetKey;
          
          return (
            <div 
              key={key}
              className={styles.tooltip}
              data-tooltip={`${meta.description} • ${colors.length} colors • ${
                isActive ? 'Click to deactivate and reset to theme colors' : 'Click to apply to all charts'
              }`}
            >
              <Box
                onClick={() => handleColorSetClick(colorSetKey)}
                p={1.5}
                cursor="pointer"
                transition="all 0.2s ease"
                position="relative"
                style={{
                  ...getContainerStyleForColorSet(colorSetKey),
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography style={{ fontSize: '1rem', marginRight: 'var(--spacing-xs)' }}>
                    {meta.icon}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    style={{ 
                      ...getTitleStyle(),
                      fontSize: '0.85rem',
                      flexGrow: 1,
                    }}
                  >
                    {mode === 'brutalist' ? meta.name.toUpperCase() : meta.name}
                    {isActive && (
                      <Typography
                        style={{
                          marginLeft: 'var(--spacing-xs)',
                          fontSize: '0.75rem',
                          opacity: 0.8,
                          fontWeight: 'bold',
                          color: mode === 'brutalist' ? '#000000' : 
                                 mode === 'neon' ? '#39ff14' : 
                                 mode === 'retro' ? '#2f1b14' : 'var(--color-primary)',
                        }}
                      >
                        {mode === 'brutalist' ? '• ACTIVE' : '• Active'}
                      </Typography>
                    )}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    style={{ 
                      ...getDescriptionStyle(),
                      opacity: 0.7,
                    }}
                  >
                    {colors.length}
                  </Typography>
                </Box>
                
                <Box display="flex" gap={mode === 'neumorphism' ? 0.5 : 0} mb={0.5}>
                  {colors.map((color, index) => (
                    <Box
                      key={index}
                      width={mode === 'neumorphism' ? 16 : 20}
                      height={mode === 'neumorphism' ? 16 : 20}
                      style={{
                        flex: mode === 'neumorphism' ? 'none' : 1,
                        ...getColorSwatchStyle(color, index === 0, index === colors.length - 1),
                      }}
                    />
                  ))}
                </Box>
                
                <Typography 
                  variant="caption" 
                  style={{ 
                    ...getDescriptionStyle(),
                    fontSize: '0.75rem',
                  }}
                >
                  {meta.description}
                </Typography>
              </Box>
            </div>
          );
        })}
      </Box>
    </Box>
  );
}; 