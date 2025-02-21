import { useMemo } from 'react';
import { ChartCard } from './ChartCard';
import { Container, Grid } from './styles';
import { chartPresets } from '../../../charts/presets';
import { sampleDatasets } from '../../../charts/data';

export const GalleryGrid = ({ onChartSelect }: { onChartSelect: (id: string) => void }) => {
  const chartCards = useMemo(() => {
    return Object.entries(chartPresets).map(([id, preset]) => ({
      id,
      title: preset.title,
      description: preset.description,
      previewSpec: {
        ...preset.spec,
        data: { values: sampleDatasets[preset.defaultDataset].values }
      }
    }));
  }, []);

  return (
    <Container>
      <Grid>
        {chartCards.map(card => (
          <ChartCard 
            key={card.id}
            {...card}
            onClick={() => onChartSelect(card.id)}
          />
        ))}
      </Grid>
    </Container>
  );
}; 