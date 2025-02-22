import styled from 'styled-components'
import { TopLevelSpec } from 'vega-lite'
import { useState, useEffect } from 'react'
import { ExtendedSpec, VegaMarkConfig } from '../../types/vega'
import { ChartStyle } from '../../types/chart'
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const Container = styled.div`
  padding: 16px;
  height: 100%;
  overflow-y: auto;
`

const Section = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 600;
  font-family: 'IBM Plex Sans', sans-serif;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
`

const Control = styled.div`
  margin-bottom: 16px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
`

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  margin-bottom: 8px;
`

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 6px;
`

const ColorInput = styled.input`
  padding: 4px;
  width: 60px;
  height: 30px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`

const RangeInput = styled.input`
  width: 100%;
  margin: 8px 0;
`

const StyleSection = styled(Section)`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: -1px;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
`;

const StyleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  
  svg {
    color: ${props => props.theme.text.secondary};
    font-size: 20px;
  }
`;

const FontPreview = styled.div<{ $font: string }>`
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-family: ${props => props.$font};
  margin-bottom: 8px;
  color: ${props => props.theme.text.primary};
`;

interface StyleEditorProps {
  spec: ExtendedSpec;
  onChange: (updates: Partial<ExtendedSpec>) => void;
}

// Add this type for mark size handling
interface MarkSizeConfig {
  baseSize: number;  // Base size as a percentage (1-100)
  scaleRatio: number;  // Ratio for size differences (0.1-2)
}

// Update the mark-specific controls
const getMarkSpecificControls = (markType: string, currentMark: any, updateMark: Function) => {
  switch (markType) {
    case 'bar':
      return (
        <>
          <Control>
            <Label>Bar Width</Label>
            <RangeInput
              type="range"
              min="1"
              max="100"
              value={currentMark?.width || 'auto'}
              onChange={e => updateMark({ width: parseInt(e.target.value) })}
            />
          </Control>
          <Control>
            <Label>Corner Radius</Label>
            <RangeInput
              type="range"
              min="0"
              max="20"
              value={currentMark?.cornerRadius || 0}
              onChange={e => updateMark({ cornerRadius: parseInt(e.target.value) })}
            />
          </Control>
          <Control>
            <Label>Fill Color</Label>
            <ColorInput
              type="color"
              value={currentMark?.fill || '#4c78a8'}
              onChange={e => updateMark({ fill: e.target.value })}
            />
          </Control>
          <Control>
            <Label>Border Width</Label>
            <RangeInput
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={currentMark?.strokeWidth || 0}
              onChange={e => updateMark({ strokeWidth: parseFloat(e.target.value) })}
            />
          </Control>
        </>
      );

    case 'line':
      return (
        <>
          <Control>
            <Label>Line Width</Label>
            <RangeInput
              type="range"
              min="1"
              max="10"
              value={currentMark?.strokeWidth || 2}
              onChange={e => updateMark({ strokeWidth: parseInt(e.target.value) })}
            />
          </Control>
          <Control>
            <Label>Line Style</Label>
            <Select
              value={currentMark?.interpolate || 'linear'}
              onChange={e => updateMark({ interpolate: e.target.value })}
            >
              <option value="linear">Linear</option>
              <option value="step">Step</option>
              <option value="stepAfter">Step After</option>
              <option value="stepBefore">Step Before</option>
              <option value="basis">Basis</option>
              <option value="cardinal">Cardinal</option>
              <option value="monotone">Monotone</option>
            </Select>
          </Control>
          <Control>
            <Label>Line Color</Label>
            <ColorInput
              type="color"
              value={currentMark?.stroke || '#4c78a8'}
              onChange={e => updateMark({ stroke: e.target.value })}
            />
          </Control>
          <Control>
            <Label>Point Size</Label>
            <RangeInput
              type="range"
              min="0"
              max="100"
              value={currentMark?.point?.size || 0}
              onChange={e => updateMark({ point: { size: parseInt(e.target.value) } })}
            />
          </Control>
        </>
      );

    case 'point':
    case 'circle':
      return (
        <>
          <Control>
            <Label>Base Size (%)</Label>
            <RangeInput
              type="range"
              min="1"
              max="200"
              value={currentMark?.size || 50}
              onChange={e => {
                const size = parseInt(e.target.value);
                updateMark({ 
                  size,
                  // Keep filled true to maintain data-driven fill colors
                  filled: true
                });
              }}
            />
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              {currentMark?.size || 50}%
            </div>
          </Control>
          <Control>
            <Label>Shape</Label>
            <Select
              value={currentMark?.shape || 'circle'}
              onChange={e => {
                const shape = e.target.value;
                updateMark({ 
                  type: 'point',
                  shape,
                  filled: true,  // Keep filled true
                  size: currentMark?.size || 50
                });
              }}
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="cross">Cross</option>
              <option value="diamond">Diamond</option>
              <option value="triangle">Triangle</option>
              <option value="star">Star</option>
            </Select>
          </Control>
          <Control>
            <Label>Stroke Color</Label>
            <ColorInput
              type="color"
              value={currentMark?.stroke || '#4c78a8'}
              onChange={e => updateMark({ 
                stroke: e.target.value,
                filled: true  // Keep filled true
              })}
            />
          </Control>
          <Control>
            <Label>Stroke Width</Label>
            <RangeInput
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={currentMark?.strokeWidth || 2}
              onChange={e => updateMark({ 
                strokeWidth: parseFloat(e.target.value),
                filled: true  // Keep filled true
              })}
            />
          </Control>
        </>
      );

    case 'area':
      return (
        <>
          <Control>
            <Label>Fill Color</Label>
            <ColorInput
              type="color"
              value={currentMark?.fill || '#4c78a8'}
              onChange={e => updateMark({ fill: e.target.value })}
            />
          </Control>
          <Control>
            <Label>Fill Opacity</Label>
            <RangeInput
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={currentMark?.fillOpacity || 0.7}
              onChange={e => updateMark({ fillOpacity: parseFloat(e.target.value) })}
            />
          </Control>
          <Control>
            <Label>Line Width</Label>
            <RangeInput
              type="range"
              min="0"
              max="5"
              value={currentMark?.strokeWidth || 0}
              onChange={e => updateMark({ strokeWidth: parseInt(e.target.value) })}
            />
          </Control>
          <Control>
            <Label>Interpolation</Label>
            <Select
              value={currentMark?.interpolate || 'linear'}
              onChange={e => updateMark({ interpolate: e.target.value })}
            >
              <option value="linear">Linear</option>
              <option value="step">Step</option>
              <option value="monotone">Monotone</option>
            </Select>
          </Control>
        </>
      );

    case 'text':
      return (
        <>
          <Control>
            <Label>Font Size</Label>
            <RangeInput
              type="range"
              min="8"
              max="32"
              value={currentMark?.fontSize || 11}
              onChange={e => updateMark({ fontSize: parseInt(e.target.value) })}
            />
          </Control>
          <Control>
            <Label>Text Color</Label>
            <ColorInput
              type="color"
              value={currentMark?.color || '#000000'}
              onChange={e => updateMark({ color: e.target.value })}
            />
          </Control>
          <Control>
            <Label>Angle</Label>
            <RangeInput
              type="range"
              min="0"
              max="360"
              value={currentMark?.angle || 0}
              onChange={e => updateMark({ angle: parseInt(e.target.value) })}
            />
          </Control>
          <Control>
            <Label>Alignment</Label>
            <Select
              value={currentMark?.align || 'center'}
              onChange={e => updateMark({ align: e.target.value })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </Select>
          </Control>
        </>
      );

    // Add more chart types...
  }
};

export const StyleEditor = ({ spec, onChange }: StyleEditorProps) => {
  const updateConfig = (updates: Partial<ExtendedSpec['config']>) => {
    onChange({
      ...spec,
      config: {
        ...spec.config,
        ...updates,
        mark: {
          ...spec.config?.mark,
          ...updates.mark
        },
        view: {
          ...spec.config?.view,
          ...updates.view
        }
      }
    });
  };

  const markType = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
  const currentMark = typeof spec.mark === 'string' ? { type: spec.mark } : spec.mark;

  const updateMark = (updates: Partial<VegaMarkConfig>) => {
    const currentMark = typeof spec.mark === 'string' ? { type: spec.mark } : spec.mark;
    
    // Create the new mark configuration
    const newMark = {
      ...currentMark,
      ...updates
    };

    // Update the spec with new mark config and encoding
    onChange({
      ...spec,
      mark: newMark,
      // Add encoding updates if needed
      encoding: {
        ...spec.encoding,
        // Add opacity as an encoding if it's set
        ...(updates.opacity !== undefined && {
          opacity: { value: updates.opacity }
        }),
        // Add size as an encoding if it's set
        ...(updates.size !== undefined && {
          size: { value: updates.size }
        }),
        // Add color as an encoding if it's set
        ...(updates.fill !== undefined && {
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

  return (
    <Container>
      <StyleSection>
        <StyleHeader>
          <FormatColorFillIcon />
          <SectionTitle>Mark Style</SectionTitle>
        </StyleHeader>
        {getMarkSpecificControls(markType, currentMark, updateMark)}
      </StyleSection>

      <StyleSection>
        <StyleHeader>
          <FormatSizeIcon />
          <SectionTitle>Typography</SectionTitle>
        </StyleHeader>
        
        <Control>
          <Label>Font Family</Label>
          <Select
            value={spec.config?.font || 'sans-serif'}
            onChange={e => updateConfig({ font: e.target.value })}
          >
            <option value="Inter">Inter</option>
            <option value="IBM Plex Sans">IBM Plex Sans</option>
            <option value="Roboto">Roboto</option>
            <option value="system-ui">System Default</option>
          </Select>
          <FontPreview $font={spec.config?.font || 'sans-serif'}>
            The quick brown fox jumps over the lazy dog
          </FontPreview>
        </Control>

        <Control>
          <Label>Font Weight</Label>
          <Select
            value={spec.config?.fontWeight || 400}
            onChange={e => updateConfig({ fontWeight: parseInt(e.target.value) })}
          >
            <option value="300">Light</option>
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
          </Select>
        </Control>

        <Control>
          <Label>Letter Spacing</Label>
          <RangeInput
            type="range"
            min="-2"
            max="10"
            step="0.5"
            value={spec.config?.letterSpacing || 0}
            onChange={e => updateConfig({ letterSpacing: parseFloat(e.target.value) })}
          />
        </Control>
      </StyleSection>

      <StyleSection>
        <StyleHeader>
          <AutoFixHighIcon />
          <SectionTitle>Effects</SectionTitle>
        </StyleHeader>

        <Control>
          <Label>Mark Opacity</Label>
          <RangeInput
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
        </Control>

        <Control>
          <Label>Blend Mode</Label>
          <Select
            value={currentMark?.blend || 'normal'}
            onChange={e => updateEffects({ blend: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
          </Select>
        </Control>

        <Control>
          <Label>Animation Duration (ms)</Label>
          <RangeInput
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
        </Control>
      </StyleSection>

      <Section>
        <SectionTitle>Axis Style</SectionTitle>
        <Control>
          <Label>Grid Color</Label>
          <ColorInput
            type="color"
            value={spec.config?.axis?.gridColor || '#ddd'}
            onChange={e => updateConfig({ axis: { gridColor: e.target.value } })}
          />
        </Control>
        <Control>
          <Label>Grid Opacity</Label>
          <RangeInput
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={spec.config?.axis?.gridOpacity || 0.5}
            onChange={e => updateConfig({ axis: { gridOpacity: parseFloat(e.target.value) } })}
          />
        </Control>
        <Control>
          <Label>Label Size</Label>
          <RangeInput
            type="range"
            min="8"
            max="20"
            value={spec.config?.axis?.labelFontSize || 11}
            onChange={e => updateConfig({ axis: { labelFontSize: parseInt(e.target.value) } })}
          />
        </Control>
      </Section>

      <Section>
        <SectionTitle>Legend Style</SectionTitle>
        <Control>
          <Label>Position</Label>
          <Select
            value={spec.config?.legend?.orient || 'right'}
            onChange={e => updateConfig({ legend: { orient: e.target.value } })}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </Select>
        </Control>
        <Control>
          <Label>Title Size</Label>
          <RangeInput
            type="range"
            min="8"
            max="20"
            value={spec.config?.legend?.titleFontSize || 11}
            onChange={e => updateConfig({ legend: { titleFontSize: parseInt(e.target.value) } })}
          />
        </Control>
      </Section>

      <Section>
        <SectionTitle>Chart Style</SectionTitle>
        <Control>
          <Label>Background Color</Label>
          <ColorInput
            type="color"
            value={spec.config?.view?.fill || '#ffffff'}
            onChange={e => updateConfig({ view: { fill: e.target.value } })}
          />
        </Control>
        <Control>
          <Label>Padding</Label>
          <RangeInput
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
        </Control>
      </Section>
    </Container>
  );
}; 