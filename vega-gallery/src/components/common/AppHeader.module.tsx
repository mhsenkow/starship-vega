import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PaintBrush, Grid, StorageIcon, DashboardIcon, ArrowLeftIcon } from './Icons';
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  onThemeToggle: () => void;
  isEditor?: boolean;
  onBackToGallery?: () => void;
  isEditorPanelVisible?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  onThemeToggle, 
  isEditor = false, 
  onBackToGallery,
  isEditorPanelVisible = true
}) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Gallery', icon: <Grid size={16} /> },
    { path: '/data', label: 'Data', icon: <StorageIcon size={16} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon size={16} /> },
  ];

  return (
    <header className={`${styles.header} ${isEditor && isEditorPanelVisible ? styles.withPanel : ''}`}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>Starship Vega</h1>
        
        {isEditor && onBackToGallery && (
          <Button
            variant="secondary"
            size="small"
            buttonStyle="embedded"
            onClick={onBackToGallery}
            className={styles.backButton}
          >
            <ArrowLeftIcon size={14} />
            Back to Gallery
          </Button>
        )}
      </div>

      <div className={styles.headerRight}>
        <nav className={styles.navigation}>
          <ButtonGroup buttonStyle="embedded">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'primary' : 'ghost'}
                size="medium"
                buttonStyle="embedded"
                as={Link}
                to={item.path}
                iconOnly
                title={item.label}
              >
                {item.icon}
              </Button>
            ))}
          </ButtonGroup>
        </nav>

        <div className={styles.headerActions}>
          <Button
            variant="tertiary"
            size="medium"
            buttonStyle="floating"
            onClick={onThemeToggle}
            title="Theme Settings"
            iconOnly
          >
            <PaintBrush size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
