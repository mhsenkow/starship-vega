import styled from 'styled-components'
import { CodeEditor } from './CodeEditor'
import { Preview } from './Preview'
import { chartSpecs } from '../../utils/vegaHelper'
import { useState, useRef, useEffect } from 'react'
import { TemplateEditor } from './TemplateEditor'
import { theme } from '../../types/theme'

const Container = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 12px;
  height: calc(100vh - 160px);
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const EditorPanel = styled.div`
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid ${props => props.theme.colors.border};
  padding-right: 12px;
`

const PreviewPanel = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  cursor: ns-resize;
  background: ${props => props.theme.colors.border};
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
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
  const [previewHeight, setPreviewHeight] = useState(600)
  const resizingRef = useRef(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    resizingRef.current = true
    startYRef.current = e.clientY
    startHeightRef.current = previewHeight
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return
      const delta = startYRef.current - e.clientY
      const newHeight = Math.max(300, Math.min(800, startHeightRef.current + delta))
      setPreviewHeight(newHeight)
    }

    const handleMouseUp = () => {
      resizingRef.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div>
      <BackButton onClick={onBack}>Back to Gallery</BackButton>
      <Container>
        <EditorPanel>
          <TemplateEditor spec={spec} onChange={setSpec} />
        </EditorPanel>
        <PreviewPanel>
          <Preview spec={spec} height={previewHeight} />
          <ResizeHandle onMouseDown={handleMouseDown} />
        </PreviewPanel>
      </Container>
    </div>
  )
}
