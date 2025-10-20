import React from 'react';
import { Button } from '../../design-system/components/ButtonSystem';
import { 
  ChartPie as AttachMoneyIcon, 
  CategoryNew as SentimentSatisfiedIcon, 
  Settings as LockIcon 
} from './Icons';
import { useThemeContext } from '../../styles/ThemeProvider.module';
import { getSemanticColors, triggerGlobalChartRefresh, type SemanticColorSets } from '../../utils/vegaThemes';
import styles from './ColorSetsPanel.module.css';

interface ColorSetsPanelProps {
  onColorSetApplied?: (colorSetName: keyof SemanticColorSets, colors: string[]) => void;
}

export const ColorSetsPanel: React.FC<ColorSetsPanelProps> = ({ onColorSetApplied }) => {
  const { mode, selectedColorSet, setSelectedColorSet } = useThemeContext();

  const colorSets = {
    categories: {
      name: 'Categories',
      description: 'Standard categorical colors',
      icon: <SentimentSatisfiedIcon size={16} />
    },
    diverging: {
      name: 'Diverging',
      description: 'Colors that diverge from a central point',
      icon: <AttachMoneyIcon size={16} />
    },
    sentiment: {
      name: 'Sentiment',
      description: 'Colors for positive/negative sentiment',
      icon: <LockIcon size={16} />
    },
    financial: {
      name: 'Financial',
      description: 'Colors for financial data',
      icon: <SentimentSatisfiedIcon size={16} />
    }
  } as const;

  const handleColorSetClick = (colorSetName: keyof SemanticColorSets) => {
    const semanticColors = getSemanticColors();
    const colors = semanticColors[colorSetName];
    setSelectedColorSet(colorSetName);
    
    // Copy colors to clipboard if available
    if (colors && Array.isArray(colors)) {
      const colorString = colors.join(', ');
      navigator.clipboard.writeText(colorString).then(() => {
        console.log(`[Color Sets] Copied ${colorSetName} colors to clipboard: ${colorString}`);
      }).catch(err => {
        console.warn('Failed to copy colors to clipboard:', err);
      });
      
      // Notify parent component
      onColorSetApplied?.(colorSetName, colors);
    } else {
      console.warn(`[Color Sets] No colors available for ${colorSetName}`);
    }
  };

  const handleTestThemeColors = () => {
    triggerGlobalChartRefresh();
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Color Sets</h4>
      <div className={styles.colorSetGrid}>
        {Object.entries(colorSets).map(([colorSetName, config]) => {
          const semanticColors = getSemanticColors();
          const colors = semanticColors[colorSetName as keyof SemanticColorSets];
          const isActive = selectedColorSet === colorSetName;
          
          return (
            <Button
              key={colorSetName}
              variant={isActive ? 'primary' : 'ghost'}
              size="medium"
              buttonStyle="floating"
              onClick={() => handleColorSetClick(colorSetName as keyof SemanticColorSets)}
              className={`${styles.colorSetCard} ${styles[mode] || ''}`}
            >
              <div className={styles.colorSetHeader}>
                <div className={styles.colorSetIcon}>
                  {config.icon}
                </div>
                <div className={styles.colorSetName}>
                  {config.name}
                  {isActive && ' (Active)'}
                </div>
              </div>
              <div className={styles.colorSetDescription}>
                {config.description}
              </div>
              <div className={styles.colorBar}>
                {colors && Array.isArray(colors) ? colors.map((color: string, index: number) => (
                  <div
                    key={index}
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                )) : (
                  <div className={styles.colorSwatch} style={{ backgroundColor: '#ccc' }} title="No colors available" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
      <button 
        className={styles.testButton}
        onClick={handleTestThemeColors}
      >
        Test Theme Colors
      </button>
    </div>
  );
};

export default ColorSetsPanel;
