import React from 'react';
import { Button } from '../../design-system/components/ButtonSystem';
import { useDashboardStore } from '../../store/dashboardStore';
import { ChartSelector } from './ChartSelector';
import { DashboardChart } from './DashboardChart';
import styles from './GridView.module.css';

export const GridView: React.FC = () => {
  const { 
    currentDashboard, 
    removeChart,
    snapshots,
    addChart
  } = useDashboardStore();
  
  const [showChartSelector, setShowChartSelector] = React.useState(false);
  
  const handleAddChart = () => {
    setShowChartSelector(true);
  };
  
  const handleChartSelect = (snapshot: any) => {
    addChart(snapshot);
    setShowChartSelector(false);
  };
  
  const handleRemoveChart = (chartId: string) => {
    if (window.confirm('Are you sure you want to remove this chart?')) {
      removeChart(chartId);
    }
  };
  
  if (!currentDashboard) {
    return (
      <div className={styles.emptyState}>
        <p>No dashboard selected. Create a new one or select an existing one.</p>
      </div>
    );
  }
  
  if (currentDashboard.charts.length === 0) {
    return (
      <>
        <Button
          variant="ghost"
          size="large"
          onClick={handleAddChart}
          className={styles.addChartButton}
        >
          <div className={styles.plusIcon}>+</div>
          <div className={styles.addChartText}>Add Chart</div>
        </Button>
        
        {showChartSelector && (
          <ChartSelector 
            snapshots={snapshots}
            onSelect={handleChartSelect}
            onClose={() => setShowChartSelector(false)}
          />
        )}
      </>
    );
  }
  
  return (
    <>
      <div className={styles.gridContainer}>
        {currentDashboard.charts.map(chart => (
          <DashboardChart 
            key={chart.id} 
            chart={chart} 
            onRemove={handleRemoveChart} 
          />
        ))}
        <Button
          variant="ghost"
          size="large"
          onClick={handleAddChart}
          className={styles.addChartButton}
        >
          <div className={styles.plusIcon}>+</div>
          <div className={styles.addChartText}>Add Chart</div>
        </Button>
      </div>
      
      {showChartSelector && (
        <ChartSelector 
          snapshots={snapshots}
          onSelect={handleChartSelect}
          onClose={() => setShowChartSelector(false)}
        />
      )}
    </>
  );
}; 