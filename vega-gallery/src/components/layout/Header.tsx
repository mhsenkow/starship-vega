import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Tooltip, 
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Tune as TuneIcon,
  Palette as PaletteIcon,
  MoreVert as MoreVertIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentLayout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
  onToggleThemePanel: () => void;
}

export const Header = ({ 
  onToggleSidebar, 
  currentLayout, 
  onLayoutChange, 
  onToggleThemePanel 
}: HeaderProps) => {
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

  const handleLayoutChange = (_: React.MouseEvent<HTMLElement>, newLayout: 'grid' | 'list' | null) => {
    if (newLayout !== null) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <AppBar position="fixed" elevation={2}>
      <Toolbar>
        {/* Menu Button */}
        <Tooltip title="Toggle Navigation">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        {/* Title */}
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            letterSpacing: '-0.5px',
          }}
        >
          Starship Vega
        </Typography>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Layout Controls */}
          <ToggleButtonGroup
            value={currentLayout}
            exclusive
            onChange={handleLayoutChange}
            size="small"
            sx={{ mr: 1 }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <Tooltip title="Grid View">
                <GridViewIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <Tooltip title="List View">
                <ViewListIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32 }} />

          {/* Theme Panel Toggle Button */}
          <Tooltip title="Customize Appearance">
            <IconButton
              color="inherit"
              onClick={onToggleThemePanel}
              aria-label="theme panel"
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

          {/* Settings Menu */}
          <Tooltip title="More Options">
            <IconButton
              color="inherit"
              onClick={handleSettingsMenuOpen}
              aria-label="settings"
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Settings Menu */}
        <Menu
          anchorEl={settingsMenuAnchor}
          open={Boolean(settingsMenuAnchor)}
          onClose={handleSettingsMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
            },
          }}
        >
          <MenuItem onClick={handleSettingsMenuClose}>
            <ListItemIcon>
              <TuneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Preferences" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSettingsMenuClose}>
            <ListItemIcon>
              <InfoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="About Starship Vega" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}; 