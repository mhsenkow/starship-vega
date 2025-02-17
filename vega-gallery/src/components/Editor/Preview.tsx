import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { renderVegaLite } from '../../utils/vegaHelper'

const PreviewContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  height: 600px;
  overflow: auto;
  display: flex;
  flex-direction: column;
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
}

export const Preview = ({ spec }: PreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderChart = async () => {
      if (containerRef.current) {
        try {
          const parsedSpec = JSON.parse(spec)
          await renderVegaLite(containerRef.current, parsedSpec, { mode: 'editor' })
          setError(null)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Invalid specification')
        }
      }
    }

    renderChart()

    // Add resize observer for responsiveness
    const resizeObserver = new ResizeObserver(() => {
      renderChart()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [spec])

  return (
    <PreviewContainer>
      <ChartContainer ref={containerRef} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </PreviewContainer>
  )
}
