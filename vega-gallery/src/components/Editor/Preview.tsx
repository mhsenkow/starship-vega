import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { renderVegaLite } from '../../utils/vegaHelper'
import { ChartFooter } from './ChartFooter'

const PreviewContainer = styled.div<{ $height: number }>`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  height: ${props => props.$height}px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ChartContainer = styled.div`
  height: 60%;
  min-height: 0;
  position: relative;
  margin-bottom: 8px;
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
  const chartRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const renderChart = async () => {
      try {
        const parsedSpec = JSON.parse(spec)
        setData(parsedSpec.data?.values || [])
        
        if (chartRef.current) {
          await renderVegaLite(chartRef.current, parsedSpec)
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render chart')
      }
    }

    renderChart()
  }, [spec])

  return (
    <PreviewContainer $height={height}>
      <ChartContainer ref={chartRef} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ChartFooter data={data} />
    </PreviewContainer>
  )
}
