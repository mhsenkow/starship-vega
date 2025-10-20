import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem';
import styles from './DashboardContainer.module.css';
import { GridView } from './GridView';
import { CanvasView } from './CanvasView';
import { ViewMode } from '../../types/dashboard';
import { getAllDashboards, getDashboard, storeDashboard, deleteDashboard } from '../../utils/indexedDB';
import { v4 as uuidv4 } from 'uuid';
import { Grid, AddIcon, DeleteIcon, SaveIcon, ViewComfortable } from '../common/Icons';

// Styled components removed - using CSS modules instead

export const DashboardContainer: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    currentDashboard, 
    setCurrentDashboard,
    loadSnapshots
  } = useDashboardStore();
  
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [dashboardName, setDashboardName] = useState('');
  const [selectedDashboardId, setSelectedDashboardId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load dashboards on mount
  useEffect(() => {
    loadDashboards();
    loadSnapshots();
  }, [loadSnapshots]);
  
  const loadDashboards = async () => {
    setIsLoading(true);
    try {
      const dashboards = await getAllDashboards();
      setDashboards(dashboards);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load dashboards:', error);
      setIsLoading(false);
    }
  };
  
  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };
  
  const handleDashboardChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dashboardId = e.target.value;
    setSelectedDashboardId(dashboardId);
    
    if (!dashboardId) {
      setCurrentDashboard(null);
      setDashboardName('New Dashboard');
      return;
    }
    
    setIsLoading(true);
    try {
      const dashboard = await getDashboard(dashboardId);
      if (dashboard) {
        setCurrentDashboard(dashboard);
        setDashboardName(dashboard.name);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setIsLoading(false);
    }
  };
  
  const createNewDashboard = () => {
    const newDashboard = {
      id: uuidv4(),
      name: dashboardName || 'New Dashboard',
      charts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentDashboard(newDashboard);
    setSelectedDashboardId(newDashboard.id);
    setDashboards([...dashboards, newDashboard]);
  };
  
  const saveDashboard = async () => {
    if (!currentDashboard) return;
    
    setIsSaving(true);
    
    try {
      const updatedDashboard = {
        ...currentDashboard,
        name: dashboardName || currentDashboard.name,
        updatedAt: new Date().toISOString()
      };
      
      await storeDashboard(updatedDashboard);
      setCurrentDashboard(updatedDashboard);
      
      // Update dashboards list
      setDashboards(prev => 
        prev.map(d => d.id === updatedDashboard.id ? updatedDashboard : d)
      );
      
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to save dashboard:', error);
      setIsSaving(false);
    }
  };
  
  const deleteSelectedDashboard = async () => {
    if (!currentDashboard?.id) return;
    
    if (!window.confirm(`Are you sure you want to delete the dashboard "${currentDashboard.name}"?`)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await deleteDashboard(currentDashboard.id);
      
      // Update dashboards list
      setDashboards(prev => prev.filter(d => d.id !== currentDashboard.id));
      setCurrentDashboard(null);
      setSelectedDashboardId('');
      setDashboardName('New Dashboard');
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.dashboardHeader}>
        <h2 className={styles.dashboardTitle}>Dashboard</h2>
        <div className={styles.actionButtons}>
          <ButtonGroup buttonStyle="embedded">
            <Button 
              variant={viewMode === ViewMode.GRID ? 'primary' : 'ghost'}
              size="medium"
              buttonStyle="embedded"
              onClick={() => handleViewChange(ViewMode.GRID)}
            >
              <Grid size={16} />
              Grid
            </Button>
            <Button 
              variant={viewMode === ViewMode.CANVAS ? 'primary' : 'ghost'}
              size="medium"
              buttonStyle="embedded"
              onClick={() => handleViewChange(ViewMode.CANVAS)}
            >
              <ViewComfortable size={16} />
              Canvas
            </Button>
          </ButtonGroup>
        </div>
      </div>
      
      <div className={styles.dashboardControls}>
        <select
          className={styles.dashboardSelector}
          value={selectedDashboardId}
          onChange={handleDashboardChange}
          disabled={isLoading}
        >
          <option value="">-- New Dashboard --</option>
          {dashboards.map(dashboard => (
            <option key={dashboard.id} value={dashboard.id}>
              {dashboard.name}
            </option>
          ))}
        </select>
        
        <input
          className={styles.dashboardNameInput}
          type="text"
          value={dashboardName}
          onChange={(e) => setDashboardName(e.target.value)}
          placeholder="Dashboard Name"
          disabled={isLoading}
        />
        
        <ButtonGroup buttonStyle="floating">
          <Button 
            variant="tertiary"
            size="medium"
            onClick={createNewDashboard}
            disabled={isLoading}
          >
            <AddIcon size={16} />
            New
          </Button>
          
          <Button 
            variant="primary"
            size="medium"
            onClick={saveDashboard}
            disabled={isLoading || isSaving || !dashboardName.trim() || !currentDashboard}
          >
            <SaveIcon size={16} />
            Save
          </Button>
          
          {currentDashboard && (
            <Button
              variant="ghostOutline"
              size="medium"
              onClick={deleteSelectedDashboard}
              disabled={isLoading}
            >
              <DeleteIcon size={16} />
              Delete
            </Button>
          )}
        </ButtonGroup>
      </div>
      
      <div className={styles.content}>
        {viewMode === ViewMode.GRID ? (
          <GridView />
        ) : (
          <CanvasView />
        )}
      </div>
    </div>
  );
}; 