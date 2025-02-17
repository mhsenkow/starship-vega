import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ChartConfig } from '../../types/chart'
import { renderVegaLite, chartSpecs } from '../../utils/vegaHelper'

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
  color: #2c3e50;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`

const ChartPreview = styled.div`
  margin-bottom: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  height: 200px;
  width: 100%;
  position: relative;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #2c3e50;
`

const Description = styled.p`
  margin: 0;
  color: #34495e;
  font-size: 0.9rem;
  line-height: 1.4;
`

const Badge = styled.span`
  background: #f8f9fa;
  color: #2c3e50;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 8px;
  border: 1px solid #e9ecef;
`

interface ChartCardProps {
  chart: ChartConfig;
  onClick: (id: string) => void;
}

export const ChartCard = ({ chart, onClick }: ChartCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderChart = async () => {
      if (chartRef.current) {
        const spec = chartSpecs[chart.id]
        if (spec) {
          await renderVegaLite(chartRef.current, spec, { mode: 'gallery' })
        }
      }
    }

    renderChart()
  }, [chart.id])

  return (
    <Card onClick={() => onClick(chart.id)}>
      <ChartPreview ref={chartRef} />
      <Title>{chart.title}</Title>
      <Description>{chart.description}</Description>
      <div style={{ marginTop: '12px' }}>
        <Badge>{chart.category}</Badge>
        <Badge>{chart.complexity}</Badge>
      </div>
    </Card>
  )
}
