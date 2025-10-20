import { CodeEditor } from './CodeEditor'
import { Preview } from './Preview'
import { chartSpecs, sampleCharts } from '../../charts'
import { useState, useEffect } from 'react'
import { VisualEditor } from './VisualEditor'
import { StyleEditor } from './StyleEditor'
import { ErrorBoundary } from '../ErrorBoundary'
import { ChartConfig } from '../../types/chart'
import { BrushIcon, TuneIcon, CodeIcon, DashboardIcon, CameraAltIcon } from '../common/Icons';
import { SnapshotPanel } from './SnapshotPanel';
import { CanvasArea } from '../Canvas/CanvasArea';
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem';
import styles from './EditorLayout.module.css';

interface EditorLayoutProps {
  chartId: string;
  onBack: () => void;
  onPanelVisibilityChange?: (isVisible: boolean) => void;
}

export const EditorLayout = ({ chartId, onBack, onPanelVisibilityChange }: EditorLayoutProps) => {
  const [spec, setSpec] = useState(() => {
    try {
      // Find the chart by ID in sampleCharts array
      const chart = sampleCharts.find((c: ChartConfig) => c.id === chartId);
      const foundSpec = chart?.spec || chartSpecs[chartId as keyof typeof chartSpecs];
      
      if (foundSpec && Object.keys(foundSpec).length > 0) {
        return JSON.stringify(foundSpec, null, 2);
      }
      
      // Fallback to first available chart if chartId not found
      const fallbackChart = sampleCharts[0];
      if (fallbackChart && fallbackChart.spec) {
        return JSON.stringify(fallbackChart.spec, null, 2);
      }
      
      // If no charts available, return a basic example spec
      console.warn('No charts available for fallback, using basic example');
      const basicSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        description: 'A basic bar chart example',
        data: {
          values: [
            {a: 'A', b: 28}, {a: 'B', b: 55}, {a: 'C', b: 43},
            {a: 'D', b: 91}, {a: 'E', b: 81}, {a: 'F', b: 53}
          ]
        },
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'nominal'},
          y: {field: 'b', type: 'quantitative'}
        }
      };
      return JSON.stringify(basicSpec, null, 2);
    } catch (e) {
      console.error('Error parsing initial spec:', e);
      return JSON.stringify({}, null, 2);
    }
  });
  const [mode, setMode] = useState<'visual' | 'style' | 'code' | 'snapshots' | 'canvas'>('visual');
  const [chartRenderKey, setChartRenderKey] = useState(1);
  const [isPanelVisible, setIsPanelVisible] = useState(() => {
    const saved = localStorage.getItem('editorPanelVisible');
    return saved !== null ? saved === 'true' : true; // Default to true to ensure panel is visible
  });

  // Save panel visibility state to localStorage
  useEffect(() => {
    localStorage.setItem('editorPanelVisible', isPanelVisible.toString());
  }, [isPanelVisible]);

  // Notify parent about panel visibility changes
  useEffect(() => {
    onPanelVisibilityChange?.(isPanelVisible);
  }, [isPanelVisible, onPanelVisibilityChange]);

  const handleVisualChange = (updates: any) => {
    try {
      const currentSpec = JSON.parse(spec);
      const updatedSpec = { ...currentSpec, ...updates };
      setSpec(JSON.stringify(updatedSpec, null, 2));
      setChartRenderKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating visual spec:', error);
    }
  };

  const handleStyleChange = (updates: any) => {
    try {
      const currentSpec = JSON.parse(spec);
      const updatedSpec = { ...currentSpec, ...updates };
      setSpec(JSON.stringify(updatedSpec, null, 2));
      setChartRenderKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating style spec:', error);
    }
  };

  const handleCodeChange = (newSpec: string) => {
    setSpec(newSpec);
    setChartRenderKey(prev => prev + 1);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  // Cleanup cursor styles on unmount
  useEffect(() => {
    return () => {
      if (document.body) {
        document.body.style.cursor = '';
      }
    };
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* Main content area */}
      <div className={`${styles.mainContent} ${isPanelVisible ? styles.withPanel : ''}`}>
        <ErrorBoundary fallback={<div>Failed to render chart</div>}>
          <Preview 
            spec={JSON.parse(spec) as any} 
            key={chartRenderKey}
          />
        </ErrorBoundary>
      </div>

      {/* Floating panel */}
      <div className={`${styles.floatingPanel} ${isPanelVisible ? styles.visible : styles.hidden}`}>
        <div className={styles.panelContent}>
          <div className={styles.tabContainer}>
            <ButtonGroup buttonStyle="embedded">
              <Button
                variant={mode === 'visual' ? 'primary' : 'ghost'}
                size="small"
                buttonStyle="embedded"
                onClick={() => setMode('visual')}
                data-tooltip="Data"
                aria-label="Data Editor"
                role="tab"
                aria-selected={mode === 'visual'}
              >
                <TuneIcon />
              </Button>
              <Button
                variant={mode === 'style' ? 'primary' : 'ghost'}
                size="small"
                buttonStyle="embedded"
                onClick={() => setMode('style')}
                data-tooltip="Style"
                aria-label="Style Editor"
                role="tab"
                aria-selected={mode === 'style'}
              >
                <BrushIcon />
              </Button>
              <Button
                variant={mode === 'code' ? 'primary' : 'ghost'}
                size="small"
                buttonStyle="embedded"
                onClick={() => setMode('code')}
                data-tooltip="Code"
                aria-label="Code Editor"
                role="tab"
                aria-selected={mode === 'code'}
              >
                <CodeIcon />
              </Button>
              <Button
                variant={mode === 'snapshots' ? 'primary' : 'ghost'}
                size="small"
                buttonStyle="embedded"
                onClick={() => setMode('snapshots')}
                data-tooltip="Snapshots"
                aria-label="Snapshots"
                role="tab"
                aria-selected={mode === 'snapshots'}
              >
                <CameraAltIcon />
              </Button>
              <Button
                variant={mode === 'canvas' ? 'primary' : 'ghost'}
                size="small"
                buttonStyle="embedded"
                onClick={() => setMode('canvas')}
                data-tooltip="Canvas"
                aria-label="Canvas"
                role="tab"
                aria-selected={mode === 'canvas'}
              >
                <DashboardIcon />
              </Button>
            </ButtonGroup>
          </div>

          <div className={styles.contentArea}>
            {mode === 'visual' && <VisualEditor spec={JSON.parse(spec) as any} onChange={handleVisualChange} />}
            {mode === 'style' && <StyleEditor spec={JSON.parse(spec) as any} onChange={handleStyleChange} />}
            {mode === 'code' && <CodeEditor value={spec} onChange={handleCodeChange} />}
            {mode === 'snapshots' && <SnapshotPanel chartId={chartId} currentSpec={JSON.parse(spec)} vegaView={null} onLoadSnapshot={() => {}} />}
            {mode === 'canvas' && <CanvasArea />}
          </div>
        </div>
      </div>

      {/* Panel toggle button */}
      <button
        className={`${styles.panelToggle} ${!isPanelVisible ? styles.collapsed : ''}`}
        onClick={() => setIsPanelVisible(!isPanelVisible)}
        title={isPanelVisible ? 'Hide panel' : 'Show panel'}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
        </svg>
      </button>
    </div>
  );
};