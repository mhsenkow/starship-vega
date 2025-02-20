import { TopLevelSpec } from 'vega-lite';
import { sampleDatasets } from '../../utils/sampleData';

export const wordCloud: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 600,
  height: 400,
  data: {
    values: sampleDatasets.textAnalysis.values
  },
  mark: {
    type: 'text',
    baseline: 'middle',
    align: 'center'
  },
  encoding: {
    text: { field: 'text' },
    size: {
      field: 'value',
      type: 'quantitative',
      scale: { range: [12, 48] }
    },
    color: {
      field: 'value',
      type: 'quantitative',
      scale: { scheme: 'blues' }
    }
  }
};

export const textAnalysis = {
  'word-cloud': wordCloud
}; 