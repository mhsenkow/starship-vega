import styles from './StyleEditor.module.css';
import { useState, useEffect, useMemo } from 'react'
import { ExtendedSpec, VegaMarkConfig } from '../../types/vega'
import { 
  FormatSizeIcon, 
  FormatColorFillIcon, 
  AutoFixHighIcon 
} from '../common/Icons'
// Note: Using local styled components instead of Material UI
// Removed problematic external dependencies: mui-color and react-color
// import { themeColors, setMarkColors, getFromSpec } from '../../utils/themeUtils'
// TODO: themeUtils doesn't exist - need to implement or find alternative

interface StyleEditorProps {
  spec: ExtendedSpec;
  onChange: (spec: ExtendedSpec) => void;
}

export const StyleEditor = ({ spec, onChange }: StyleEditorProps) => {
  const updateConfig = (updates: Partial<ExtendedSpec['config']>) => {
    onChange({
      ...spec,
      config: {
        ...spec.config,
        ...updates,
        mark: {
          ...spec.config?.mark,
          ...(updates.mark || {})
        },
        view: {
          ...spec.config?.view,
          ...(updates.view || {})
        }
      }
    });
  };

  const markType = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
  const currentMark = typeof spec.mark === 'string' ? { type: spec.mark } : spec.mark;

  const updateMark = (updates: Partial<VegaMarkConfig>) => {
    const currentMark = typeof spec.mark === 'string' ? { type: spec.mark } : spec.mark;
    
    // Remove incompatible encodings based on mark type
    const compatibleUpdates = { ...updates };
    if (markType === 'line' || markType === 'bar') {
      delete compatibleUpdates.theta;
      delete compatibleUpdates.radius;
    }

    // Ensure valid color values
    if (compatibleUpdates.fill && compatibleUpdates.fill.length === 4) {
      // Convert #RGB to #RRGGBB
      compatibleUpdates.fill = compatibleUpdates.fill.replace(/#([0-9a-f])([0-9a-f])([0-9a-f])/i, 
        (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`);
    }
    if (compatibleUpdates.stroke && compatibleUpdates.stroke.length === 4) {
      compatibleUpdates.stroke = compatibleUpdates.stroke.replace(/#([0-9a-f])([0-9a-f])([0-9a-f])/i,
        (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`);
    }

    // Create the new mark configuration
    const newMark = {
      ...currentMark,
      ...compatibleUpdates
    };

    // Update the spec with new mark config and encoding
    onChange({
      ...spec,
      mark: newMark,
      encoding: {
        ...((spec as any).encoding || {}),
        // Only add valid numerical values to encodings
        ...(updates.opacity !== undefined && !isNaN(updates.opacity) && {
          opacity: { value: updates.opacity }
        }),
        ...(updates.size !== undefined && !isNaN(updates.size) && {
          size: { value: updates.size }
        }),
        ...(updates.fill && {
          color: { value: updates.fill }
        })
      }
    });
  };

  const updateAnimation = (duration: number) => {
    onChange({
      ...spec,
      config: {
        ...spec.config,
        animation: {
          duration,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        // Add mark-specific animation
        mark: {
          ...spec.config?.mark,
          transition: {
            duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }
      }
    });
  };

  const updateView = (updates: Partial<ExtendedSpec['config']['view']>) => {
    onChange({
      ...spec,
      config: {
        ...spec.config,
        view: {
          ...spec.config?.view,
          ...updates,
          // Ensure responsive sizing
          continuousWidth: true,
          continuousHeight: true
        }
      }
    });
  };

  const updateEffects = (updates: Partial<VegaMarkConfig>) => {
    onChange({
      ...spec,
      config: {
        ...spec.config,
        mark: {
          ...spec.config?.mark,
          ...updates
        }
      },
      // Also update current mark if it exists
      ...(spec.mark && {
        mark: {
          ...(typeof spec.mark === 'string' ? { type: spec.mark } : spec.mark),
          ...updates
        }
      })
    });
  };

  const validateData = (data: any[]) => {
    return data.map(row => {
      const validRow = { ...row };
      Object.entries(row).forEach(([key, value]) => {
        // Convert strings to numbers where appropriate
        if (typeof value === 'string' && !isNaN(Number(value))) {
          validRow[key] = Number(value);
        }
        // Handle invalid numbers
        if (typeof value === 'number' && !isFinite(value)) {
          validRow[key] = 0;
        }
      });
      return validRow;
    });
  };

  const enhancedSpec = {
    ...spec,
    data: {
      ...spec.data,
      values: spec.data?.values ? validateData(spec.data.values) : []
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.styleHeader}>
          <FormatColorFillIcon />
          <h3 className={styles.sectionTitle}>Mark Style</h3>
        </div>
        <div className={styles.control}>
          <label className={styles.label}>Mark Type</label>
          <select
            className={styles.select}
            value={markType}
            onChange={(e) => updateMark({ type: e.target.value as any })}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="area">Area</option>
            <option value="point">Point</option>
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="rect">Rectangle</option>
            <option value="arc">Arc</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.styleHeader}>
          <FormatSizeIcon />
          <h3 className={styles.sectionTitle}>Typography</h3>
        </div>
        
        <div className={styles.control}>
          <label className={styles.label}>Font Family</label>
          <select
            className={styles.select}
            value={spec.config?.font || 'Inter'}
            onChange={e => updateConfig({ 
              font: e.target.value,
              // Update all related font configs
              axis: { ...spec.config?.axis, labelFont: e.target.value },
              legend: { ...spec.config?.legend, labelFont: e.target.value },
              title: { ...spec.config?.title, font: e.target.value }
            })}
          >
            <option value="Inter">Inter</option>
            <option value="IBM Plex Sans">IBM Plex Sans</option>
            <option value="Roboto">Roboto</option>
            <option value="system-ui">System Default</option>
          </select>
        </div>

          <div className={styles.control}>
            <label className={styles.label}>Text Scale Factor</label>
            <input
            className={styles.rangeInput}
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={spec.config?.textScale || 1}
            onChange={e => {
              const scale = parseFloat(e.target.value);
              updateConfig({
                textScale: scale,
                axis: {
                  ...spec.config?.axis,
                  labelFontSize: Math.round(11 * scale),
                  titleFontSize: Math.round(13 * scale)
                },
                legend: {
                  ...spec.config?.legend,
                  labelFontSize: Math.round(11 * scale),
                  titleFontSize: Math.round(13 * scale)
                },
                title: {
                  ...spec.config?.title,
                  fontSize: Math.round(14 * scale)
                }
              });
            }}
          />
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            {`${((spec.config?.textScale || 1) * 100).toFixed(0)}%`}
          </div>
          <div className={styles.scalePreview}>
            <div className="preview-text">
              <h3>Title Text</h3>
              <div className="body">Body Text</div>
              <div className="small">Small Text</div>
            </div>
          </div>
        </div>

          <div className={styles.control}>
            <label className={styles.label}>Text Weight</label>
            <select
            className={styles.select}
            value={spec.config?.fontWeight || 400}
            onChange={e => {
              const weight = parseInt(e.target.value);
              updateConfig({
                fontWeight: weight,
                axis: { ...spec.config?.axis, labelFontWeight: weight },
                legend: { ...spec.config?.legend, labelFontWeight: weight },
                title: { ...spec.config?.title, fontWeight: weight + 100 } // Title slightly bolder
              });
            }}
          >
            <option value="300">Light</option>
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
          </select>
        </div>

          <div className={styles.control}>
            <label className={styles.label}>Text Color</label>
          <input
          className={styles.colorInput}
            type="color"
            value={spec.config?.color || '#2c3e50'}
            onChange={e => {
              const color = e.target.value;
              updateConfig({
                color,
                axis: { ...spec.config?.axis, labelColor: color },
                legend: { ...spec.config?.legend, labelColor: color },
                title: { ...spec.config?.title, color }
              });
            }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.styleHeader}>
          <AutoFixHighIcon />
          <h3 className={styles.sectionTitle}>Effects</h3>
        </div>

          <div className={styles.control}>
            <label className={styles.label}>Mark Opacity</label>
            <input
            className={styles.rangeInput}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={currentMark?.opacity || 1}
            onChange={e => {
              const opacity = parseFloat(e.target.value);
              updateEffects({ opacity });
              onChange({
                ...spec,
                encoding: {
                  ...spec.encoding,
                  opacity: { value: opacity }
                }
              });
            }}
          />
        </div>

          <div className={styles.control}>
            <label className={styles.label}>Blend Mode</label>
            <select
            className={styles.select}
            value={currentMark?.blend || 'normal'}
            onChange={e => updateEffects({ blend: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
          </select>
        </div>

          <div className={styles.control}>
            <label className={styles.label}>Animation Duration (ms)</label>
            <input
            className={styles.rangeInput}
            type="range"
            min="0"
            max="2000"
            step="100"
            value={spec.config?.animation?.duration || 0}
            onChange={e => {
              const duration = parseInt(e.target.value);
              updateAnimation(duration);
            }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Axis Style</h3>
          <div className={styles.control}>
            <label className={styles.label}>Grid Color</label>
          <input
          className={styles.colorInput}
            type="color"
            value={spec.config?.axis?.gridColor || '#dddddd'}
            onChange={e => updateConfig({ axis: { gridColor: e.target.value } })}
          />
        </div>
          <div className={styles.control}>
            <label className={styles.label}>Grid Opacity</label>
            <input
            className={styles.rangeInput}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={spec.config?.axis?.gridOpacity || 0.5}
            onChange={e => updateConfig({ axis: { gridOpacity: parseFloat(e.target.value) } })}
          />
        </div>
          <div className={styles.control}>
            <label className={styles.label}>Label Size</label>
            <input
            className={styles.rangeInput}
            type="range"
            min="8"
            max="20"
            value={spec.config?.axis?.labelFontSize || 11}
            onChange={e => updateConfig({ axis: { labelFontSize: parseInt(e.target.value) } })}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Legend Style</h3>
          <div className={styles.control}>
            <label className={styles.label}>Position</label>
            <select
            className={styles.select}
            value={spec.config?.legend?.orient || 'right'}
            onChange={e => updateConfig({ legend: { orient: e.target.value } })}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
          <div className={styles.control}>
            <label className={styles.label}>Title Size</label>
            <input
            className={styles.rangeInput}
            type="range"
            min="8"
            max="20"
            value={spec.config?.legend?.titleFontSize || 11}
            onChange={e => updateConfig({ legend: { titleFontSize: parseInt(e.target.value) } })}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Chart Style</h3>
          <div className={styles.control}>
            <label className={styles.label}>Background Color</label>
          <input
          className={styles.colorInput}
            type="color"
            value={spec.config?.view?.fill || '#ffffff'}
            onChange={e => updateConfig({ view: { fill: e.target.value } })}
          />
        </div>
          <div className={styles.control}>
            <label className={styles.label}>Padding</label>
            <input
            className={styles.rangeInput}
            type="range"
            min="0"
            max="50"
            step="5"
            value={typeof spec.config?.view?.padding === 'number' ? 
              spec.config.view.padding : 5}
            onChange={e => updateView({ 
              padding: parseInt(e.target.value)
            })}
          />
        </div>
      </div>
    </div>
  );
}; 