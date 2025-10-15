import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'
import StorageIcon from '@mui/icons-material/Storage'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ViewStreamIcon from '@mui/icons-material/ViewStream'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ViewComfortableIcon from '@mui/icons-material/ViewCompact'
import PaletteIcon from '@mui/icons-material/Palette'
import { IconButton, Tooltip, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { ThemePanel } from './ThemePanel'

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-appBar);
  color: var(--color-appBarText);
`

const Logo = styled.div`
  font-size: var(--typography-fontSize-xl);
  font-weight: var(--typography-fontWeight-semibold);
  color: var(--color-text-primary);
`

const Navigation = styled.nav`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`

export const Header = () => {
  const navigate = useNavigate()
  const [layoutWidth, setLayoutWidth] = useState(() => {
    return localStorage.getItem('layoutWidth') || 'medium';
  });
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue) {
      setLayoutWidth(newValue);
      localStorage.setItem('layoutWidth', newValue);
    }
  };

  const handleToggleThemePanel = () => {
    setIsThemePanelOpen(!isThemePanelOpen);
  };

  const handleCloseThemePanel = () => {
    setIsThemePanelOpen(false);
  };

  useEffect(() => {
    // Add a specific class to the layout container in the Layout component
    const container = document.querySelector('.layout-container');
    if (container) {
      if (layoutWidth === 'narrow') {
        container.setAttribute('style', 'max-width: 1200px');
      } else if (layoutWidth === 'medium') {
        container.setAttribute('style', 'max-width: 1600px');
      } else if (layoutWidth === 'wide') {
        container.setAttribute('style', 'max-width: 2000px');
      }
    } else {
      // Fallback approach - try to find by attribute
      const allContainers = document.querySelectorAll('[class*="LayoutContainer"]');
      if (allContainers.length > 0) {
        const container = allContainers[0];
        if (layoutWidth === 'narrow') {
          container.setAttribute('style', 'max-width: 1200px');
        } else if (layoutWidth === 'medium') {
          container.setAttribute('style', 'max-width: 1600px');
        } else if (layoutWidth === 'wide') {
          container.setAttribute('style', 'max-width: 2000px');
        }
      }
    }
  }, [layoutWidth]);

  // Add keyboard shortcut for theme panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + T to toggle theme panel
      if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        handleToggleThemePanel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <HeaderContainer>
        <Logo>Starship Vega</Logo>
        <Navigation>
          <ToggleButtonGroup
            value={layoutWidth}
            exclusive
            onChange={handleLayoutChange}
            aria-label="layout width"
            size="small"
          >
            <ToggleButton value="narrow" aria-label="narrow layout">
              <Tooltip title="Narrow View">
                <ViewStreamIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="medium" aria-label="medium layout">
              <Tooltip title="Medium View">
                <ViewComfortableIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="wide" aria-label="wide layout">
              <Tooltip title="Wide View">
                <ViewColumnIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Gallery">
            <IconButton onClick={() => navigate('/')}>
              <ViewComfyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dashboard">
            <IconButton onClick={() => navigate('/dashboard')}>
              <DashboardIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Data Management">
            <IconButton onClick={() => navigate('/data')}>
              <StorageIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Customize Appearance (Ctrl+T)">
            <IconButton 
              onClick={handleToggleThemePanel}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <PaletteIcon />
            </IconButton>
          </Tooltip>
        </Navigation>
      </HeaderContainer>

      <ThemePanel 
        open={isThemePanelOpen} 
        onClose={handleCloseThemePanel} 
      />
    </>
  )
}
