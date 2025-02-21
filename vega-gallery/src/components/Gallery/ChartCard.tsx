import { ChartPreview } from '../Editor/ChartPreview';
import { ChartConfig } from '../../types/chart';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borders.radius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const PreviewContainer = styled.div`
  height: 180px;
  background: ${props => props.theme.colors.background};
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};

  h3 {
    margin: 0 0 ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.typography.fontSize.md};
    color: ${props => props.theme.colors.text};
  }

  p {
    margin: 0;
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.neutral[600]};
  }
`;

/**
 * Individual chart preview card component
 * - Renders chart preview with title and description
 * - Handles hover interactions and click events
 * - Used in gallery grid view
 * Dependencies: ChartPreview, chartStyles
 */

interface ChartCardProps {
  chart: ChartConfig;
  onClick: () => void;
}

export const ChartCard = ({ chart, onClick }: ChartCardProps) => {
  return (
    <Card onClick={onClick}>
      <PreviewContainer>
        <ChartPreview 
          spec={chart.spec}
          width={300}
          height={180}
          mode="gallery"
          showDataTable={false}
        />
      </PreviewContainer>
      <Content>
        <h3>{chart.title}</h3>
        <p>{chart.description}</p>
      </Content>
    </Card>
  );
};

export default ChartCard
