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
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
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

  const updateMarkStyle = (updates: any) => {
    const newSpec = {
      ...spec,
      mark: {
        ...(typeof spec.mark === 'object' ? spec.mark : { type: spec.mark }),
        ...updates
      }
    }
    onChange(newSpec)
  }

  const updateConfig = (updates: any) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onChange({ config: newConfig })
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
                value={typeof spec.mark === 'object' ? spec.mark.color || '#4c78a8' : '#4c78a8'}
                onChange={e => updateMarkStyle({ color: e.target.value })}
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
            value={typeof spec.config?.style === 'object' ? spec.config.style.text?.font || 'sans-serif' : 'sans-serif'}
            onChange={e => onChange({
              ...spec,
              config: {
                ...spec.config,
                style: {
                  ...spec.config?.style,
                  text: { font: e.target.value }
                }
              }
            })}
          >
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </Select>
        </Control>
        <Control>
          <Label>Font Size</Label>
          <Input 
            type="number"
            min="8"
            max="24"
            value={typeof spec.config?.style === 'object' ? spec.config.style.text?.fontSize || 12 : 12}
            onChange={e => onChange({
              ...spec,
              config: {
                ...spec.config,
                style: {
                  ...spec.config?.style,
                  text: { fontSize: parseInt(e.target.value) }
                }
              }
            })}
          />
        </Control>
      </Section>

      <Section>
        <SectionTitle>Axis Style</SectionTitle>
        <Control>
          <Label>Grid Color</Label>
          <Input 
            type="color"
            value={spec.config?.axis?.gridColor || '#dddddd'}
            onChange={e => onChange({
              ...spec,
              config: {
                ...spec.config,
                axis: {
                  ...spec.config?.axis,
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
            onChange={e => onChange({
              ...spec,
              config: {
                ...spec.config,
                axis: {
                  ...spec.config?.axis,
                  gridOpacity: parseFloat(e.target.value)
                }
              }
            })}
          />
        </Control>
        <Control>
          <Label>Title Font Size</Label>
          <Input 
            type="number"
            min="8"
            max="24"
            value={spec.config?.axis?.titleFontSize || 14}
            onChange={e => onChange({
              ...spec,
              config: {
                ...spec.config,
                axis: {
                  ...spec.config?.axis,
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
            value={spec.config?.axis?.labelFontSize || 11}
            onChange={e => onChange({
              ...spec,
              config: {
                ...spec.config,
                axis: {
                  ...spec.config?.axis,
                  labelFontSize: parseInt(e.target.value)
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
            onChange={e => onChange({
              ...spec,
              config: {
                ...spec.config,
                legend: {
                  ...spec.config?.legend,
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
            onChange={e => onChange({
              ...spec,
              config: {
                ...spec.config,
                legend: {
                  ...spec.config?.legend,
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