import styled from 'styled-components'
import { TopLevelSpec } from 'vega-lite'
import { useMemo } from 'react'
import { EncodingChannel, MarkType, EncodingUpdate } from '../../types/vega'

const Container = styled.div`
  padding: 24px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  height: 600px;
  overflow: auto;
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
  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
`

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  color: #495057;
  transition: border-color 0.2s;

  &:hover {
    border-color: #adb5bd;
  }

  &:focus {
    border-color: #4dabf7;
    outline: none;
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
  }
`

const EncodingGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
`

const EncodingControl = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

interface VisualEditorProps {
  spec: TopLevelSpec;
  onChange: (updates: Partial<TopLevelSpec>) => void;
}

export const VisualEditor = ({ spec, onChange }: VisualEditorProps) => {
  const handleMarkTypeChange = (type: MarkType) => {
    try {
      onChange({ mark: type })
    } catch (err) {
      console.error('Error updating mark type:', err)
    }
  }

  const handleEncodingChange = (channel: EncodingChannel, update: EncodingUpdate) => {
    try {
      onChange({
        encoding: {
          ...spec.encoding,
          [channel]: { ...spec.encoding?.[channel], ...update }
        }
      })
    } catch (err) {
      console.error('Error updating encoding:', err)
    }
  }

  const fields = useMemo(() => {
    try {
      if (spec.data?.values && Array.isArray(spec.data.values)) {
        const sampleRow = spec.data.values[0]
        return Object.keys(sampleRow || {})
      }
      return []
    } catch (err) {
      console.error('Error getting data fields:', err)
      return []
    }
  }, [spec.data?.values])

  const getAvailableEncodings = (): EncodingChannel[] => {
    try {
      const mark = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type
      switch (mark) {
        case 'bar':
          return ['x', 'y', 'color', 'tooltip']
        case 'line':
          return ['x', 'y', 'color', 'tooltip']
        case 'point':
          return ['x', 'y', 'size', 'color', 'tooltip']
        case 'arc':
          return ['theta', 'color', 'tooltip']
        default:
          return ['x', 'y', 'color', 'tooltip']
      }
    } catch (err) {
      console.error('Error getting available encodings:', err)
      return ['x', 'y']
    }
  }

  if (!spec) {
    return <div>Invalid specification</div>
  }

  return (
    <Container>
      <Section>
        <SectionTitle>Chart Type</SectionTitle>
        <Control>
          <Label>Mark Type</Label>
          <Select 
            value={typeof spec.mark === 'string' ? spec.mark : spec.mark?.type || ''}
            onChange={(e) => handleMarkTypeChange(e.target.value as MarkType)}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="point">Point</option>
            <option value="area">Area</option>
            <option value="circle">Circle</option>
            <option value="arc">Pie/Arc</option>
          </Select>
        </Control>
      </Section>

      <Section>
        <SectionTitle>Encoding</SectionTitle>
        {getAvailableEncodings().map(channel => (
          <Control key={channel}>
            <EncodingGrid>
              <Label>{channel.toUpperCase()}</Label>
              <EncodingControl>
                <Select
                  value={spec.encoding?.[channel]?.field || ''}
                  onChange={(e) => handleEncodingChange(channel, { field: e.target.value })}
                >
                  <option value="">Select field</option>
                  {fields.map(field => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </Select>
                <Select
                  value={spec.encoding?.[channel]?.type || ''}
                  onChange={(e) => handleEncodingChange(channel, { type: e.target.value })}
                >
                  <option value="">Select type</option>
                  <option value="quantitative">Quantitative</option>
                  <option value="nominal">Nominal</option>
                  <option value="ordinal">Ordinal</option>
                  <option value="temporal">Temporal</option>
                </Select>
              </EncodingControl>
            </EncodingGrid>
          </Control>
        ))}
      </Section>
    </Container>
  )
} 