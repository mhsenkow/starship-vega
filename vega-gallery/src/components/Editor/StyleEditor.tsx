import styled from 'styled-components'
import { TopLevelSpec } from 'vega-lite'
import { useState, useEffect } from 'react'

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

interface StyleEditorProps {
  spec: TopLevelSpec;
  onChange: (updates: Partial<TopLevelSpec>) => void;
}

export const StyleEditor = ({ spec, onChange }: StyleEditorProps) => {
  const [config, setConfig] = useState(spec.config || {})
  const markType = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type

  const updateStyle = (updates: any) => {
    // Handle nested config updates properly
    const newConfig = {
      ...spec.config
    }
    
    // Recursively merge updates into config
    const mergeUpdates = (target: any, source: any) => {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object') {
          target[key] = target[key] || {};
          mergeUpdates(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      });
    };

    if (updates.config) {
      mergeUpdates(newConfig, updates.config);
    }

    onChange({
      ...spec,
      config: newConfig
    });
  }

  const updateMarkStyle = (updates: any) => {
    onChange({
      ...spec,
      mark: {
        ...(typeof spec.mark === 'object' ? spec.mark : { type: spec.mark }),
        ...updates
      }
    })
  }

  const getMarkControls = () => {
    switch (markType) {
      case 'line':
        return (
          <>
            <Control>
              <Label>Stroke Width</Label>
              <Input 
                type="number"
                min="0"
                max="10"
                value={typeof spec.mark === 'object' ? spec.mark.strokeWidth || 1 : 1}
                onChange={e => updateMarkStyle({ strokeWidth: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Line Opacity</Label>
              <Input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={typeof spec.mark === 'object' ? spec.mark.opacity || 1 : 1}
                onChange={e => updateMarkStyle({ opacity: parseFloat(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Line Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.color || '#4c78a8' : '#4c78a8'}
                onChange={e => updateMarkStyle({ color: e.target.value })}
              />
            </Control>
            <Control>
              <Label>Line Interpolation</Label>
              <Select
                value={typeof spec.mark === 'object' ? spec.mark.interpolate || 'linear' : 'linear'}
                onChange={e => updateMarkStyle({ interpolate: e.target.value })}
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
          </>
        )

      case 'bar':
        return (
          <>
            <Control>
              <Label>Bar Opacity</Label>
              <Input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={typeof spec.mark === 'object' ? spec.mark.opacity || 1 : 1}
                onChange={e => updateMarkStyle({ opacity: parseFloat(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Corner Radius</Label>
              <Input 
                type="number"
                min="0"
                max="20"
                value={typeof spec.mark === 'object' ? spec.mark.cornerRadius || 0 : 0}
                onChange={e => updateMarkStyle({ cornerRadius: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Border Width</Label>
              <Input 
                type="number"
                min="0"
                max="5"
                value={typeof spec.mark === 'object' ? spec.mark.strokeWidth || 0 : 0}
                onChange={e => updateMarkStyle({ strokeWidth: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Bar Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.fill || '#4c78a8' : '#4c78a8'}
                onChange={e => updateMarkStyle({ fill: e.target.value })}
              />
            </Control>
          </>
        )

      case 'point':
      case 'circle':
        return (
          <>
            <Control>
              <Label>Point Size</Label>
              <Input 
                type="number"
                min="10"
                max="400"
                value={typeof spec.mark === 'object' ? spec.mark.size || 100 : 100}
                onChange={e => updateMarkStyle({ size: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Stroke Width</Label>
              <Input 
                type="number"
                min="0"
                max="5"
                value={typeof spec.mark === 'object' ? spec.mark.strokeWidth || 0 : 0}
                onChange={e => updateMarkStyle({ strokeWidth: parseInt(e.target.value) })}
              />
            </Control>
          </>
        )

      case 'arc':
        return (
          <>
            <Control>
              <Label>Inner Radius</Label>
              <Input 
                type="number"
                min="0"
                max="100"
                value={typeof spec.mark === 'object' ? spec.mark.innerRadius || 0 : 0}
                onChange={e => updateMarkStyle({ innerRadius: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Outer Radius</Label>
              <Input 
                type="number"
                min="50"
                max="200"
                value={typeof spec.mark === 'object' ? spec.mark.outerRadius || 100 : 100}
                onChange={e => updateMarkStyle({ outerRadius: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Corner Radius</Label>
              <Input 
                type="number"
                min="0"
                max="20"
                value={typeof spec.mark === 'object' ? spec.mark.cornerRadius || 0 : 0}
                onChange={e => updateMarkStyle({ cornerRadius: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Padding Angle</Label>
              <Input 
                type="number"
                min="0"
                max="20"
                value={typeof spec.mark === 'object' ? spec.mark.padAngle || 0 : 0}
                onChange={e => updateMarkStyle({ padAngle: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Slice Opacity</Label>
              <Input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={typeof spec.mark === 'object' ? spec.mark.opacity || 1 : 1}
                onChange={e => updateMarkStyle({ opacity: parseFloat(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Border Width</Label>
              <Input 
                type="number"
                min="0"
                max="5"
                value={typeof spec.mark === 'object' ? spec.mark.strokeWidth || 0 : 0}
                onChange={e => updateMarkStyle({ strokeWidth: parseInt(e.target.value) })}
              />
            </Control>
          </>
        )

      case 'area':
        return (
          <>
            <Control>
              <Label>Area Opacity</Label>
              <Input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={typeof spec.mark === 'object' ? spec.mark.opacity || 0.7 : 0.7}
                onChange={e => updateMarkStyle({ opacity: parseFloat(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Line Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.stroke || '#4c78a8' : '#4c78a8'}
                onChange={e => updateMarkStyle({ stroke: e.target.value })}
              />
            </Control>
            <Control>
              <Label>Fill Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.fill || '#4c78a8' : '#4c78a8'}
                onChange={e => updateMarkStyle({ fill: e.target.value })}
              />
            </Control>
          </>
        )

      case 'boxplot':
        return (
          <>
            <Control>
              <Label>Box Fill Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.fill || '#4c78a8' : '#4c78a8'}
                onChange={e => {
                  onChange({
                    ...spec,
                    mark: {
                      ...(typeof spec.mark === 'object' ? spec.mark : { type: spec.mark }),
                      fill: e.target.value
                    },
                    config: {
                      ...spec.config,
                      boxplot: {
                        ...spec.config?.boxplot,
                        box: { fill: e.target.value }
                      }
                    }
                  });
                }}
              />
            </Control>
            <Control>
              <Label>Box Stroke Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.stroke || '#000000' : '#000000'}
                onChange={e => {
                  onChange({
                    ...spec,
                    mark: {
                      ...(typeof spec.mark === 'object' ? spec.mark : { type: spec.mark }),
                      stroke: e.target.value
                    },
                    config: {
                      ...spec.config,
                      boxplot: {
                        ...spec.config?.boxplot,
                        box: { stroke: e.target.value }
                      }
                    }
                  });
                }}
              />
            </Control>
            <Control>
              <Label>Median Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.medianColor || '#000000' : '#000000'}
                onChange={e => {
                  onChange({
                    ...spec,
                    config: {
                      ...spec.config,
                      boxplot: {
                        ...spec.config?.boxplot,
                        median: { color: e.target.value }
                      }
                    }
                  });
                }}
              />
            </Control>
            <Control>
              <Label>Box Width</Label>
              <Input 
                type="number"
                min="1"
                max="100"
                value={typeof spec.mark === 'object' ? spec.mark.size || 50 : 50}
                onChange={e => updateMarkStyle({ size: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Stroke Width</Label>
              <Input 
                type="number"
                min="0"
                max="5"
                value={typeof spec.mark === 'object' ? spec.mark.strokeWidth || 1 : 1}
                onChange={e => updateMarkStyle({ strokeWidth: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Corner Radius</Label>
              <Input 
                type="number"
                min="0"
                max="20"
                value={typeof spec.mark === 'object' ? spec.mark.cornerRadius || 0 : 0}
                onChange={e => {
                  onChange({
                    ...spec,
                    mark: {
                      ...(typeof spec.mark === 'object' ? spec.mark : { type: spec.mark }),
                      cornerRadius: parseInt(e.target.value)
                    },
                    config: {
                      ...spec.config,
                      boxplot: {
                        ...spec.config?.boxplot,
                        box: { 
                          ...spec.config?.boxplot?.box,
                          cornerRadius: parseInt(e.target.value) 
                        }
                      }
                    }
                  });
                }}
              />
            </Control>
            <Control>
              <Label>Opacity</Label>
              <Input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={typeof spec.mark === 'object' ? spec.mark.opacity || 1 : 1}
                onChange={e => updateMarkStyle({ opacity: parseFloat(e.target.value) })}
              />
            </Control>
          </>
        )

      case 'text':
        return (
          <>
            <Control>
              <Label>Font Size</Label>
              <Input 
                type="number"
                min="8"
                max="40"
                value={typeof spec.mark === 'object' ? spec.mark.fontSize || 12 : 12}
                onChange={e => updateMarkStyle({ fontSize: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Text Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.color || '#000000' : '#000000'}
                onChange={e => updateMarkStyle({ color: e.target.value })}
              />
            </Control>
            <Control>
              <Label>Angle</Label>
              <Input 
                type="number"
                min="0"
                max="360"
                value={typeof spec.mark === 'object' ? spec.mark.angle || 0 : 0}
                onChange={e => updateMarkStyle({ angle: parseInt(e.target.value) })}
              />
            </Control>
          </>
        )

      case 'rule':
        return (
          <>
            <Control>
              <Label>Stroke Width</Label>
              <Input 
                type="number"
                min="1"
                max="10"
                value={typeof spec.mark === 'object' ? spec.mark.strokeWidth || 2 : 2}
                onChange={e => updateMarkStyle({ strokeWidth: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.color || '#000000' : '#000000'}
                onChange={e => updateMarkStyle({ color: e.target.value })}
              />
            </Control>
          </>
        )

      case 'trail':
        return (
          <>
            <Control>
              <Label>Trail Width</Label>
              <Input 
                type="number"
                min="0"
                max="10"
                value={typeof spec.mark === 'object' ? spec.mark.strokeWidth || 2 : 2}
                onChange={e => updateMarkStyle({ strokeWidth: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Trail Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.color || '#4c78a8' : '#4c78a8'}
                onChange={e => updateMarkStyle({ color: e.target.value })}
              />
            </Control>
            <Control>
              <Label>Opacity</Label>
              <Input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={typeof spec.mark === 'object' ? spec.mark.opacity || 1 : 1}
                onChange={e => updateMarkStyle({ opacity: parseFloat(e.target.value) })}
              />
            </Control>
          </>
        )

      case 'tick':
        return (
          <>
            <Control>
              <Label>Tick Size</Label>
              <Input 
                type="number"
                min="1"
                max="50"
                value={typeof spec.mark === 'object' ? spec.mark.size || 20 : 20}
                onChange={e => updateMarkStyle({ size: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Thickness</Label>
              <Input 
                type="number"
                min="1"
                max="10"
                value={typeof spec.mark === 'object' ? spec.mark.thickness || 2 : 2}
                onChange={e => updateMarkStyle({ thickness: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.color || '#4c78a8' : '#4c78a8'}
                onChange={e => updateMarkStyle({ color: e.target.value })}
              />
            </Control>
            <Control>
              <Label>Line Cap Style</Label>
              <Select
                value={spec.config?.axis?.tickCap || 'butt'}
                onChange={e => updateStyle({
                  config: {
                    axis: {
                      tickCap: e.target.value
                    }
                  }
                })}
              >
                <option value="butt">Butt</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
              </Select>
            </Control>
          </>
        )

      case 'rect':
        return (
          <>
            <Control>
              <Label>Fill Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.fill || '#4c78a8' : '#4c78a8'}
                onChange={e => updateMarkStyle({ fill: e.target.value })}
              />
            </Control>
            <Control>
              <Label>Stroke Color</Label>
              <Input 
                type="color"
                value={typeof spec.mark === 'object' ? spec.mark.stroke || '#000000' : '#000000'}
                onChange={e => updateMarkStyle({ stroke: e.target.value })}
              />
            </Control>
            <Control>
              <Label>Stroke Width</Label>
              <Input 
                type="number"
                min="0"
                max="5"
                value={typeof spec.mark === 'object' ? spec.mark.strokeWidth || 0 : 0}
                onChange={e => updateMarkStyle({ strokeWidth: parseInt(e.target.value) })}
              />
            </Control>
            <Control>
              <Label>Opacity</Label>
              <Input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={typeof spec.mark === 'object' ? spec.mark.opacity || 1 : 1}
                onChange={e => updateMarkStyle({ opacity: parseFloat(e.target.value) })}
              />
            </Control>
          </>
        )
    }
  }

  return (
    <Container>
      <Section>
        <SectionTitle>Mark Style</SectionTitle>
        {getMarkControls()}
      </Section>

      <Section>
        <SectionTitle>Font Settings</SectionTitle>
        <Control>
          <Label>Font Family</Label>
          <Select
            value={spec.config?.font || 'sans-serif'}
            onChange={e => {
              updateStyle({
                config: {
                  font: e.target.value,
                  axis: { font: e.target.value },
                  legend: { font: e.target.value },
                  title: { font: e.target.value }
                }
              });
            }}
          >
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="IBM Plex Sans">IBM Plex Sans</option>
          </Select>
        </Control>
        <Control>
          <Label>Base Font Size</Label>
          <Input 
            type="number"
            min="8"
            max="24"
            value={spec.config?.fontSize || 12}
            onChange={e => {
              const size = parseInt(e.target.value);
              const titleSize = size + 2; // Title is typically slightly larger
              updateStyle({
                config: {
                  fontSize: size,
                  axis: { fontSize: size },
                  legend: { fontSize: size },
                  title: { 
                    fontSize: titleSize,
                    subtitleFontSize: size
                  }
                }
              });
            }}
          />
        </Control>
        <Control>
          <Label>Title Font Size</Label>
          <Input 
            type="number"
            min="8"
            max="24"
            value={spec.config?.title?.fontSize || 14}
            onChange={e => updateStyle({
              config: {
                title: {
                  fontSize: parseInt(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Label Font Size</Label>
          <Input 
            type="number"
            min="8"
            max="20"
            value={spec.config?.axis?.labelFontSize || 11}
            onChange={e => updateStyle({
              config: {
                axis: {
                  labelFontSize: parseInt(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Title Alignment</Label>
          <Select
            value={spec.config?.title?.align || 'left'}
            onChange={e => updateStyle({
              config: {
                title: {
                  ...spec.config?.title,
                  align: e.target.value,
                  anchor: e.target.value
                }
              }
            })}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </Select>
        </Control>
      </Section>

      <Section>
        <SectionTitle>Axis Style</SectionTitle>
        <Control>
          <Label>Grid Color</Label>
          <Input 
            type="color"
            value={spec.config?.axis?.gridColor || '#dddddd'}
            onChange={e => updateStyle({
              config: {
                axis: {
                  gridColor: e.target.value
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Grid Opacity</Label>
          <Input 
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={spec.config?.axis?.gridOpacity || 0.5}
            onChange={e => updateStyle({
              config: {
                axis: {
                  gridOpacity: parseFloat(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Tick Color</Label>
          <Input 
            type="color"
            value={spec.config?.axis?.tickColor || '#000000'}
            onChange={e => updateStyle({
              config: {
                axis: {
                  tickColor: e.target.value
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Tick Width</Label>
          <Input 
            type="number"
            min="0"
            max="5"
            value={spec.config?.axis?.tickWidth || 1}
            onChange={e => updateStyle({
              config: {
                axis: {
                  tickWidth: parseInt(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Tick Opacity</Label>
          <Input 
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={spec.config?.axis?.tickOpacity || 1}
            onChange={e => updateStyle({
              config: {
                axis: {
                  tickOpacity: parseFloat(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Baseline Color</Label>
          <Input 
            type="color"
            value={spec.config?.axis?.domainColor || '#000000'}
            onChange={e => updateStyle({
              config: {
                axis: {
                  domainColor: e.target.value
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Baseline Width</Label>
          <Input 
            type="number"
            min="0"
            max="5"
            value={spec.config?.axis?.domainWidth || 1}
            onChange={e => updateStyle({
              config: {
                axis: {
                  domainWidth: parseInt(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Baseline Opacity</Label>
          <Input 
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={spec.config?.axis?.domainOpacity || 1}
            onChange={e => updateStyle({
              config: {
                axis: {
                  domainOpacity: parseFloat(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Background Color</Label>
          <Input 
            type="color"
            value={spec.config?.view?.fill || '#ffffff'}
            onChange={e => updateStyle({
              config: {
                view: {
                  ...spec.config?.view,
                  fill: e.target.value
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Background Opacity</Label>
          <Input 
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={spec.config?.view?.fillOpacity || 1}
            onChange={e => updateStyle({
              config: {
                view: {
                  ...spec.config?.view,
                  fillOpacity: parseFloat(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Chart Padding</Label>
          <Input 
            type="number"
            min="0"
            max="50"
            value={spec.config?.view?.padding || 5}
            onChange={e => updateStyle({
              config: {
                view: {
                  padding: parseInt(e.target.value)
                }
              }
            })}
          />
        </Control>
      </Section>

      <Section>
        <SectionTitle>Legend Style</SectionTitle>
        <Control>
          <Label>Title Font Size</Label>
          <Input 
            type="number"
            min="8"
            max="24"
            value={spec.config?.legend?.titleFontSize || 14}
            onChange={e => updateStyle({
              config: {
                legend: {
                  titleFontSize: parseInt(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Label Font Size</Label>
          <Input 
            type="number"
            min="8"
            max="20"
            value={spec.config?.legend?.labelFontSize || 11}
            onChange={e => updateStyle({
              config: {
                legend: {
                  labelFontSize: parseInt(e.target.value)
                }
              }
            })}
          />
        </Control>
      </Section>
    </Container>
  )
} 