import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ChartConfig } from '../../types/chart'
import { renderVegaLite } from '../../utils/chartRenderer'
import { chartSpecs } from '../../charts'

const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`

const ChartPreview = styled.div`
  height: 200px;
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`

const Content = styled.div`
  padding: 16px;
`

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
`

const Description = styled.p`
  margin: 0 0 16px 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
`

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
`

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
`

interface ChartCardProps {
  chart: ChartConfig;
  onClick: (id: string) => void;
}

export default function ChartCard({ chart, onClick }: ChartCardProps) {
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
      <Content>
        <Title>{chart.title}</Title>
        <Description>{chart.description}</Description>
        <BadgeContainer>
          <Badge>{chart.category}</Badge>
          <Badge>{chart.complexity}</Badge>
        </BadgeContainer>
      </Content>
    </Card>
  )
}
