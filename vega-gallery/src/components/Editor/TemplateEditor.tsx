import { useState } from 'react'
import styled from 'styled-components'
import { CodeEditor } from './CodeEditor'
import { VisualEditor } from './VisualEditor'
import { Preview } from './Preview'
import { TopLevelSpec } from 'vega-lite'

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
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
    color: #2c3e50;
  }
`

type EditorMode = 'code' | 'visual'

interface TemplateEditorProps {
  spec: string;
  onChange: (spec: string) => void;
}

export const TemplateEditor = ({ spec, onChange }: TemplateEditorProps) => {
  const [mode, setMode] = useState<EditorMode>('visual')
  
  const handleVisualChange = (updates: any) => {
    try {
      const currentSpec = JSON.parse(spec)
      const newSpec = { ...currentSpec, ...updates }
      onChange(JSON.stringify(newSpec, null, 2))
    } catch (err) {
      console.error('Failed to update specification:', err)
      // Could add error state handling here
    }
  }

  return (
    <div>
      <TabContainer>
        <Tab 
          $active={mode === 'visual'} 
          onClick={() => setMode('visual')}
        >
          Visual Editor
        </Tab>
        <Tab 
          $active={mode === 'code'} 
          onClick={() => setMode('code')}
        >
          Code Editor
        </Tab>
      </TabContainer>
      
      <EditorContainer>
        {mode === 'code' ? (
          <CodeEditor value={spec} onChange={onChange} />
        ) : (
          <VisualEditor 
            spec={JSON.parse(spec)} 
            onChange={handleVisualChange} 
          />
        )}
        <Preview spec={spec} />
      </EditorContainer>
    </div>
  )
} 