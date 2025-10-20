import { IconButton } from '../../design-system';
import { LightModeIcon, DarkModeIcon } from './Icons';
import { useThemeContext } from '../../styles/ThemeProvider.module';
import styles from './ThemeToggle.module.css';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();
  
  return (
    <div 
      className={styles.tooltip}
      data-tooltip={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <IconButton 
        className={styles.toggleButton}
        onClick={toggleTheme} 
        size="medium" 
        iconOnly
      >
        {mode === 'light' ? <DarkModeIcon size={20} /> : <LightModeIcon size={20} />}
      </IconButton>
    </div>
  );
}; 