import { useState } from 'react'
import styled from 'styled-components'
import { CodeEditor } from './CodeEditor'
import { VisualEditor } from './VisualEditor'
import { StyleEditor } from './StyleEditor'
import { TopLevelSpec } from 'vega-lite'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: ${props => props.$active ? '#fff' : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: ${props => props.$active ? '#2c3e50' : '#6c757d'};
  box-shadow: ${props => props.$active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#fff' : '#f1f3f5'};
  }
`

const EditorContent = styled.div`
  flex: 1;
  min-height: 0;
`

const EditorPanel = styled.div`
  height: 100%;
  overflow-y: auto;
  background: white;
`

const PreviewPanel = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

interface TemplateEditorProps {
  spec: string;
  onChange: (spec: string) => void;
}

export const TemplateEditor = ({ spec, onChange }: TemplateEditorProps) => {
  const [mode, setMode] = useState<'visual' | 'code' | 'style'>('visual')
  const [previewHeight, setPreviewHeight] = useState(600)
  
  const handleVisualChange = (updates: Partial<TopLevelSpec>) => {
    try {
      const currentSpec = JSON.parse(spec)
      const newSpec = {
        ...currentSpec,
        // Handle data updates
        ...(updates.data && { data: updates.data }),
        // Handle encoding updates
        ...(updates.encoding && { encoding: {
          ...currentSpec.encoding,
          ...updates.encoding
        }}),
        // Handle mark updates
        ...(updates.mark && { mark: {
          ...(typeof currentSpec.mark === 'object' ? currentSpec.mark : { type: currentSpec.mark }),
          ...updates.mark
        }}),
        // Handle config updates
        ...(updates.config && { config: {
          ...currentSpec.config,
          ...updates.config,
          axis: {
            ...currentSpec.config?.axis,
            ...updates.config.axis
          },
          legend: {
            ...currentSpec.config?.legend,
            ...updates.config.legend
          },
          title: {
            ...currentSpec.config?.title,
            ...updates.config.title
          }
        }})
      }
      onChange(JSON.stringify(newSpec, null, 2))
    } catch (err) {
      console.error('Failed to update specification:', err)
    }
  }

  return (
    <Container>
      <TabContainer>
        <Tab $active={mode === 'visual'} onClick={() => setMode('visual')}>
          Visual Editor
        </Tab>
        <Tab $active={mode === 'style'} onClick={() => setMode('style')}>
          Style Editor
        </Tab>
        <Tab $active={mode === 'code'} onClick={() => setMode('code')}>
          Code Editor
        </Tab>
      </TabContainer>
      
      <EditorContent>
        <EditorPanel>
          {mode === 'code' ? (
            <CodeEditor value={spec} onChange={onChange} />
          ) : mode === 'style' ? (
            <StyleEditor spec={JSON.parse(spec)} onChange={handleVisualChange} />
          ) : (
            <VisualEditor spec={JSON.parse(spec)} onChange={handleVisualChange} />
          )}
        </EditorPanel>
      </EditorContent>
    </Container>
  )
} 