import React, { useRef, useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { ChartSelector } from './ChartSelector';
import { DashboardChart } from '../../types/dashboard';
import { 
  AddIcon, 
  DeleteOutlineIcon, 
  InfoOutlinedIcon
} from '../common/Icons';
import { useGesture } from '@use-gesture/react';
import { Button } from '../../design-system/components/ButtonSystem';
import { Input } from '../../design-system';
import styles from './CanvasView.module.css';

// Chart Node Component
const ChartNode: React.FC<{
  chart: DashboardChart;
  onRemove: (id: string) => void;
  onDragStart: (id: string, event: any) => void;
  onDragEnd: (id: string, event: any) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  bringToFront: (id: string) => void;
  zIndex: number;
  canvasZoom: number;
  isPanning: boolean;
}> = ({ 
  chart, 
  onRemove, 
  onDragStart,
  onDragEnd,
  onPositionChange,
  onResize,
  bringToFront,
  zIndex,
  isPanning
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showDialog, setShowDialog] = useState(false);
  const [chartTitle, setChartTitle] = useState('Untitled Chart');
  const nodeRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanning) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsSelected(true);
    bringToFront(chart.id);
    setIsDragging(true);
    onDragStart(chart.id, e);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd(chart.id, e);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSelected(true);
          bringToFront(chart.id);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = chart.width;
    const startHeight = chart.height;
    const startXPos = chart.x;
    const startYPos = chart.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startXPos;
      let newY = startYPos;
      
      if (position.includes('right')) {
        newWidth = Math.max(200, startWidth + deltaX);
      } else if (position.includes('left')) {
        newWidth = Math.max(200, startWidth - deltaX);
        newX = startXPos + deltaX;
      }
      
      if (position.includes('bottom')) {
        newHeight = Math.max(150, startHeight + deltaY);
      } else if (position.includes('top')) {
        newHeight = Math.max(150, startHeight - deltaY);
        newY = startYPos + deltaY;
      }
          
          onResize(chart.id, newWidth, newHeight);
      onPositionChange(chart.id, newX, newY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'rename':
        setShowDialog(true);
        break;
      case 'delete':
        onRemove(chart.id);
        break;
    }
  };

  const handleTitleSubmit = () => {
    // Update chart title logic would go here
    setShowDialog(false);
  };
  
  return (
    <>
      <div
      ref={nodeRef}
        className={`${styles.chartNodeContainer} ${isSelected ? styles.selected : ''}`}
        style={{
          left: chart.x,
          top: chart.y,
          width: chart.width,
          height: chart.height,
          zIndex: zIndex,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        <div className={styles.nodeHeader}>
          <div className={styles.nodeTitle}>{chartTitle}</div>
          <div className={styles.headerActions}>
            <button 
              className={styles.actionButton}
              onClick={() => setShowDialog(true)}
            >
              <InfoOutlinedIcon size={14} />
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => onRemove(chart.id)}
            >
              <DeleteOutlineIcon size={14} />
            </button>
          </div>
        </div>
        
        <div className={styles.nodeContent}>
          <div style={{ width: '100%', height: '100%' }}>
            {/* Chart rendering would go here */}
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'var(--color-background)',
              color: 'var(--color-text-secondary)',
              fontSize: '12px'
            }}>
              Chart Preview
            </div>
          </div>
        </div>
        
        {isSelected && (
          <>
            <div 
              className={`${styles.resizeHandle} ${styles.bottomRight}`}
              ref={resizeRef}
              onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
            />
            <div 
              className={`${styles.resizeHandle} ${styles.bottomLeft}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
            />
            <div 
              className={`${styles.resizeHandle} ${styles.topRight}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
            />
            <div 
              className={`${styles.resizeHandle} ${styles.topLeft}`}
              onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
            />
          </>
        )}
      </div>
      
      {showMenu && (
        <div 
          className={`${styles.menu} ${showMenu ? styles.open : ''}`}
          style={{ 
            position: 'fixed', 
            left: menuPosition.x, 
            top: menuPosition.y,
            zIndex: 1000
          }}
        >
          <div className={styles.menuItem} onClick={() => handleMenuAction('rename')}>Rename</div>
          <div className={styles.menuItem} onClick={() => handleMenuAction('delete')}>Delete</div>
        </div>
      )}
      
      {showDialog && (
        <div className={`${styles.dialog} ${showDialog ? styles.open : ''}`}>
          <div className={styles.dialogContent}>
            <h2 className={styles.dialogTitle}>Rename Chart</h2>
          <Input
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              placeholder="Enter chart title"
            />
            <div className={styles.dialogActions}>
              <Button variant="secondary" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleTitleSubmit}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const CanvasView: React.FC = () => {
  const { 
    currentDashboard, 
    removeChart,
    updateChartPosition,
    updateChartDimensions,
    addChart,
    snapshots,
    canvasZoom,
    canvasOffsetX,
    canvasOffsetY,
    setCanvasTransform
  } = useDashboardStore();
  
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});
  const [showNotification, setShowNotification] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Gesture handling for pan and zoom
  const bind = useGesture({
    onDrag: ({ active, movement: [mx, my], memo = { startX: canvasOffsetX, startY: canvasOffsetY } }) => {
      if (active) {
        setCanvasTransform(
          canvasZoom,
          memo.startX + mx,
          memo.startY + my
        );
      }
      return memo;
    },
    onWheel: ({ event, delta: [, dy] }) => {
      event.preventDefault();
      const newZoom = Math.max(0.1, Math.min(3, canvasZoom - dy * 0.001));
      setCanvasTransform(
        newZoom,
        canvasOffsetX,
        canvasOffsetY
      );
    },
    onPinch: ({ offset: [scale] }) => {
      const newZoom = Math.max(0.1, Math.min(3, scale));
      setCanvasTransform(
        newZoom,
        canvasOffsetX,
        canvasOffsetY
      );
    }
  });
  
  const handleAddChart = () => {
    setShowChartSelector(true);
  };
  
  const handleChartSelect = (snapshot: any) => {
    addChart(snapshot);
    setShowChartSelector(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleChartDragStart = (_chartId: string, _event: any) => {
    // Drag start logic
  };

  const handleChartDragEnd = (_chartId: string, _event: any) => {
    // Drag end logic
  };

  const bringToFront = (chartId: string) => {
    const maxZ = Math.max(...Object.values(zIndexes), 0);
    setZIndexes(prev => ({
      ...prev,
      [chartId]: maxZ + 1
    }));
  };
  
  const resetView = () => {
    setCanvasTransform(1, 0, 0);
  };
  
  const handleCanvasClick = () => {
    // Handle canvas click logic
  };
  
  if (!currentDashboard) {
    return (
      <div className={styles.emptyState}>
        <p>No dashboard selected. Create a new one or select an existing one.</p>
      </div>
    );
  }
  
  return (
    <>
      <div ref={canvasRef} className={styles.canvasContainer} {...bind()} onClick={handleCanvasClick}>
        <div 
          className={styles.canvasSurface}
          style={{
            transform: `translate(${canvasOffsetX}px, ${canvasOffsetY}px) scale(${canvasZoom})`
          }}
        >
          {currentDashboard.charts.map(chart => (
            <ChartNode 
              key={chart.id} 
              chart={chart}
              onRemove={removeChart}
              onDragStart={handleChartDragStart}
              onDragEnd={handleChartDragEnd}
              onPositionChange={updateChartPosition}
              onResize={updateChartDimensions}
              bringToFront={bringToFront}
              zIndex={zIndexes[chart.id] || 1}
              canvasZoom={canvasZoom}
              isPanning={false}
            />
          ))}
        </div>
        
        <div className={styles.canvasControls}>
          <Button
            variant="primary"
            size="medium"
            onClick={handleAddChart} 
            title="Add Chart" 
            className={`${styles.canvasButton} ${styles.addChart}`}
          >
            <AddIcon size={24} />
          </Button>
          <Button 
            variant="secondary"
            size="medium"
            onClick={resetView} 
            title="Reset View"
            className={styles.canvasButton}
          >
            <span style={{ fontSize: '18px' }}>🔍</span>
          </Button>
        </div>
      </div>
      
      {showChartSelector && (
        <ChartSelector 
          snapshots={snapshots}
          onSelect={handleChartSelect}
          onClose={() => setShowChartSelector(false)}
        />
      )}

      {showNotification && (
        <div className={`${styles.notification} ${showNotification ? styles.visible : ''}`}>
          Chart added to canvas!
        </div>
      )}
    </>
  );
}; 