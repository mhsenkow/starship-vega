import styled from 'styled-components'
import { CodeEditor } from './CodeEditor'
import { Preview } from './Preview'
import { chartSpecs } from '../../utils/vegaHelper'
import { useState } from 'react'
import { TemplateEditor } from './TemplateEditor'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const BackButton = styled.button`
  margin-bottom: 24px;
  padding: 10px 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f3f5;
    color: #2c3e50;
  }

  &::before {
    content: "←";
    font-size: 1.2em;
  }
`

interface EditorLayoutProps {
  chartId: string;
  onBack: () => void;
}

export const EditorLayout = ({ chartId, onBack }: EditorLayoutProps) => {
  const [spec, setSpec] = useState(JSON.stringify(chartSpecs[chartId], null, 2))

  return (
    <div>
      <BackButton onClick={onBack}>← Back to Gallery</BackButton>
      <TemplateEditor spec={spec} onChange={setSpec} />
    </div>
  )
}
