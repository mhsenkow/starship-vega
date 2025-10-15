import { Box, ToggleButtonGroup, ToggleButton, Tooltip, Typography } from '@mui/material';
import { 
  LightMode, 
  DarkMode, 
  BlurOn, 
  Flare,
  Palette,
  Circle,
  Square,
  HistoryToggleOff
} from '@mui/icons-material';
import { useTheme } from '../../styles/ThemeProvider';
import { themeMetadata, ThemeMode } from '../../styles/theme';

// Icon mapping for each theme
const themeIcons = {
  light: LightMode,
  dark: DarkMode,
  fluent: BlurOn,
  neon: Flare,
  material3: Palette,
  neumorphism: Circle,
  brutalist: Square,
  retro: HistoryToggleOff,
};

// Theme categories for organization
const themesByCategory = {
  'Classic': ['light', 'dark'] as ThemeMode[],
  'Modern': ['fluent', 'neon', 'material3'] as ThemeMode[],
  'Trendy': ['neumorphism'] as ThemeMode[],
  'Experimental': ['brutalist'] as ThemeMode[],
  'Nostalgic': ['retro'] as ThemeMode[],
};

export const ThemeSelector = () => {
  const { mode, setTheme } = useTheme();

  const handleThemeChange = (_: React.MouseEvent<HTMLElement>, newTheme: ThemeMode | null) => {
    if (newTheme !== null) {
      setTheme(newTheme);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      width: '100%',
    }}>
      {Object.entries(themesByCategory).map(([category, themes]) => (
        <Box key={category}>
          <Typography variant="caption" sx={{ 
            color: 'text.secondary',
            fontWeight: 'medium',
            display: 'block',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.8rem'
          }}>
            {category}
          </Typography>
          
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleThemeChange}
            size="small"
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(themes.length, 2)}, 1fr)`,
              gap: 0.75,
              width: '100%',
              mb: 2,
              '& .MuiToggleButtonGroup-grouped': {
                margin: 0,
                border: 'none !important',
                borderRadius: '8px !important',
              },
            }}
          >
            {themes.map((themeMode) => {
              const IconComponent = themeIcons[themeMode];
              const metadata = themeMetadata[themeMode];
              
              return (
                <Tooltip
                  key={themeMode}
                  title={
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {metadata.name}
                      </Typography>
                      <Typography variant="caption" color="inherit">
                        {metadata.description}
                      </Typography>
                    </Box>
                  }
                  placement="left"
                  arrow
                >
                  <ToggleButton 
                    value={themeMode}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.75,
                      minHeight: 70,
                      px: 1.5,
                      py: 1.5,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease-in-out',
                      
                      // Theme-specific styling
                      ...(themeMode === 'fluent' && {
                        background: 'linear-gradient(135deg, rgba(0, 120, 212, 0.1), rgba(0, 120, 212, 0.05))',
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, rgba(0, 120, 212, 0.2), rgba(0, 120, 212, 0.1))',
                        },
                      }),
                      
                      ...(themeMode === 'neon' && {
                        background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(255, 0, 110, 0.05))',
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(255, 0, 110, 0.1))',
                          boxShadow: '0 0 15px rgba(0, 245, 255, 0.3)',
                        },
                      }),
                      
                      ...(themeMode === 'material3' && {
                        background: 'linear-gradient(135deg, rgba(103, 80, 164, 0.1), rgba(98, 91, 113, 0.05))',
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, rgba(103, 80, 164, 0.2), rgba(98, 91, 113, 0.1))',
                        },
                      }),
                      
                      ...(themeMode === 'neumorphism' && {
                        background: 'linear-gradient(145deg, #f0f0f0, #e6e6e6)',
                        boxShadow: '2px 2px 5px #d1d1d1, -2px -2px 5px #ffffff',
                        '&.Mui-selected': {
                          boxShadow: 'inset 2px 2px 5px #d1d1d1, inset -2px -2px 5px #ffffff',
                        },
                      }),
                      
                      ...(themeMode === 'brutalist' && {
                        background: '#ffffff',
                        border: '2px solid #000000 !important',
                        boxShadow: '3px 3px 0px #000000',
                        '&.Mui-selected': {
                          background: '#ffff00',
                          transform: 'translate(1px, 1px)',
                          boxShadow: '2px 2px 0px #000000',
                        },
                      }),
                      
                      ...(themeMode === 'retro' && {
                        background: 'linear-gradient(135deg, #f5deb3, #daa520)',
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #daa520, #b8860b)',
                        },
                      }),
                    }}
                  >
                    <IconComponent sx={{ 
                      fontSize: 20,
                      ...(themeMode === mode && {
                        filter: themeMode === 'neon' ? 'drop-shadow(0 0 4px currentColor)' : 'none',
                      }),
                    }} />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '0.85rem',
                        fontWeight: themeMode === mode ? 'bold' : 'medium',
                        textAlign: 'center',
                        lineHeight: 1,
                      }}
                    >
                      {metadata.name}
                    </Typography>
                  </ToggleButton>
                </Tooltip>
              );
            })}
          </ToggleButtonGroup>
        </Box>
      ))}
    </Box>
  );
}; 