import React from 'react';
import { Button } from '../../design-system/components/ButtonSystem';
import { CloseIcon, PaletteIcon } from './Icons';
import { ThemeSelector } from './ThemeSelector.module';
import { ColorSetsPanel } from './ColorSetsPanel.module';
import { useThemeContext } from '../../styles/ThemeProvider.module';
import { testCurrentTheme, type SemanticColorSets } from '../../utils/vegaThemes';
import styles from './ThemePanel.module.css';

interface ThemePanelProps {
  open: boolean;
  onClose: () => void;
}

export const ThemePanel: React.FC<ThemePanelProps> = ({ open, onClose }) => {
  const { mode } = useThemeContext();

  const handleTestThemeColors = () => {
    testCurrentTheme();
  };

  const handleColorSetApplied = (colorSetName: keyof SemanticColorSets, colors: string[]) => {
    console.log(`[Theme Panel] Color set applied: ${colorSetName}`, colors);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${open ? styles.open : ''}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <PaletteIcon className={styles.titleIcon} size={16} />
            Theme Settings
          </h2>
          <Button 
            variant="icon"
            size="small"
            onClick={onClose}
            className={styles.closeButton}
          >
            <CloseIcon size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <ThemeSelector />
          <ColorSetsPanel onColorSetApplied={handleColorSetApplied} />
          
          <Button 
            variant="primary"
            size="medium"
            onClick={handleTestThemeColors}
            className={`${styles.testButton} ${styles[mode] || styles.default}`}
          >
            Test Theme Colors
          </Button>
        </div>
      </div>
    </>
  );
};

export default ThemePanel;
