import { ChartPreview } from '../../Editor/ChartPreview';
import styled from 'styled-components';
import { ChartConfig } from '../../../types/chart';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const Content = styled.div`
  padding: 16px;
  border-top: 1px solid #eee;

  h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
    color: #2c3e50;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #6c757d;
  }
`;

interface ChartCardProps {
  chart: ChartConfig;
  onClick: () => void;
}

export const ChartCard = ({ chart, onClick }: ChartCardProps) => (
  <Card onClick={onClick}>
    <ChartPreview 
      spec={chart.spec}
      width={300}
      height={180}
      mode="gallery"
      showDataTable={false}
    />
    <Content>
      <h3>{chart.title}</h3>
      <p>{chart.description}</p>
    </Content>
  </Card>
); 