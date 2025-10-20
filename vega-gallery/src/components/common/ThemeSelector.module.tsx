import React from 'react';
import { Button } from '../../design-system/components/ButtonSystem';
import { 
  LightModeIcon as LightMode, 
  DarkModeIcon as DarkMode, 
  BlurOnIcon as BlurOn, 
  FlareIcon as Flare,
  PaletteIcon as Palette,
  CircleIcon as Circle,
  SquareIcon as Square,
  HistoryToggleOffIcon as HistoryToggleOff
} from './Icons';
import { useThemeContext } from '../../styles/ThemeProvider.module';
import { themeMetadata, ThemeMode } from '../../styles/theme';
import styles from './ThemeSelector.module.css';

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
  'Specialty': ['neumorphism', 'brutalist', 'retro'] as ThemeMode[],
};

export const ThemeSelector: React.FC = () => {
  const { mode, setTheme } = useThemeContext();

  const handleThemeChange = (themeMode: ThemeMode) => {
    setTheme(themeMode);
  };

  return (
    <div className={styles.container}>
      {Object.entries(themesByCategory).map(([categoryName, themes]) => (
        <div key={categoryName}>
          <h4 className={styles.title}>{categoryName}</h4>
          <div className={styles.themeGrid}>
            {themes.map((themeMode) => {
              const IconComponent = themeIcons[themeMode];
              const metadata = themeMetadata[themeMode];
              
              return (
                <Button
                  key={themeMode}
                  variant={mode === themeMode ? 'primary' : 'ghost'}
                  size="medium"
                  buttonStyle="floating"
                  onClick={() => handleThemeChange(themeMode)}
                  className={`${styles.themeButton} ${styles[themeMode]}`}
                >
                  <div className={styles.themeIcon}>
                    <IconComponent fontSize="small" />
                  </div>
                  <div className={styles.themeName}>
                    {metadata.name}
                  </div>
                  <div className={styles.themeDescription}>
                    {metadata.description}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThemeSelector;
