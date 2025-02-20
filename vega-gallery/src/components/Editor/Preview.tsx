import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { renderVegaLite } from '../../utils/vegaHelper'

const PreviewContainer = styled.div<{ $height: number }>`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  height: ${props => props.$height}px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  margin-top:auto;
  margin-bottom:auto;
`

const ChartContainer = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 16px;
  background: #fff5f5;
  border-radius: 4px;
  margin-top: 16px;
`

interface PreviewProps {
  spec: string;
  height: number;
}

export const Preview = ({ spec, height }: PreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;
    
    const renderChart = async () => {
      if (containerRef.current && mounted) {
        try {
          const parsedSpec = JSON.parse(spec)
          await renderVegaLite(containerRef.current, parsedSpec, { mode: 'editor' })
          if (mounted) setError(null)
        } catch (err) {
          if (mounted) setError(err instanceof Error ? err.message : 'Invalid specification')
        }
      }
    }

    renderChart()

    const resizeObserver = new ResizeObserver(() => {
      if (mounted) renderChart()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      mounted = false
      resizeObserver.disconnect()
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [spec, height])

  return (
    <PreviewContainer $height={height}>
      <div ref={containerRef} style={{ flex: 1 }} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </PreviewContainer>
  )
}
