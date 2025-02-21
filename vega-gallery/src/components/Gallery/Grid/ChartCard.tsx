import { ChartPreview } from '../../Editor/ChartPreview';
import { Card, PreviewContainer, Content } from './styles';
import { TopLevelSpec } from 'vega-lite';

interface ChartCardProps {
  id: string;
  title: string;
  description: string;
  previewSpec: TopLevelSpec;
  onClick: () => void;
}

export const ChartCard = ({ 
  title, 
  description, 
  previewSpec, 
  onClick 
}: ChartCardProps) => (
  <Card onClick={onClick}>
    <PreviewContainer>
      <ChartPreview 
        spec={previewSpec}
        width={300}
        height={180}
        mode="gallery"
      />
    </PreviewContainer>
    <Content>
      <h3>{title}</h3>
      <p>{description}</p>
    </Content>
  </Card>
); 