import styled from 'styled-components'
import { CodeEditor } from './CodeEditor'
import { Preview } from './Preview'
import { chartSpecs } from '../../utils/vegaHelper'
import { useState } from 'react'

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
  margin-bottom: 16px;
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
      <Container>
        <CodeEditor value={spec} onChange={setSpec} />
        <Preview spec={spec} />
      </Container>
    </div>
  )
}
