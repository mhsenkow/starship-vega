import { MarkType } from '../types/vega';

interface MarkTypeInfo {
  type: MarkType;
  name: string;
  description: string;
  icon: string;
  bestFor: string[];
}

export const markTypes: MarkTypeInfo[] = [
  {
    type: 'bar',
    name: 'Bar',
    description: 'Compare quantities across categories',
    icon: '📊',
    bestFor: ['Categorical comparisons', 'Distributions']
  },
  {
    type: 'line',
    name: 'Line',
    description: 'Show trends over time',
    icon: '📈',
    bestFor: ['Time series', 'Trends']
  },
  {
    type: 'point',
    name: 'Point',
    description: 'Show relationships between variables',
    icon: '⚪',
    bestFor: ['Correlations', 'Distributions']
  },
  {
    type: 'area',
    name: 'Area',
    description: 'Show cumulative values',
    icon: '📉',
    bestFor: ['Time series', 'Part-to-whole']
  },
  {
    type: 'circle',
    name: 'Circle',
    description: 'Show relationships with size',
    icon: '⭕',
    bestFor: ['Scatter plots', 'Bubble charts']
  },
  {
    type: 'boxplot',
    name: 'Box Plot',
    description: 'Show statistical distributions',
    icon: '📦',
    bestFor: ['Statistical distributions', 'Comparisons']
  },
  {
    type: 'text',
    name: 'Text',
    description: 'Display values directly as text',
    icon: '📝',
    bestFor: ['Labels', 'Values', 'Annotations']
  },
  {
    type: 'rect',
    name: 'Rectangle',
    description: 'Create heatmaps and treemaps',
    icon: '⬛',
    bestFor: ['Heatmaps', 'Hierarchical data', 'Grid layouts']
  },
  {
    type: 'rule',
    name: 'Rule',
    description: 'Add reference lines or error bars',
    icon: '➖',
    bestFor: ['Reference lines', 'Error bars', 'Baselines']
  },
  {
    type: 'tick',
    name: 'Tick',
    description: 'Show distribution of values',
    icon: '|',
    bestFor: ['Distributions', 'Rankings', 'Small multiples']
  },
  {
    type: 'trail',
    name: 'Trail',
    description: 'Show paths with varying thickness',
    icon: '〰️',
    bestFor: ['Flow diagrams', 'Weighted paths', 'Time series']
  },
  {
    type: 'arc',
    name: 'Arc',
    description: 'Create pie charts and radial visualizations',
    icon: '🥧',
    bestFor: ['Part-to-whole', 'Proportions', 'Radial layouts']
  },
  {
    type: 'square',
    name: 'Square',
    description: 'Alternative mark for categorical data',
    icon: '⬜',
    bestFor: ['Categorical data', 'Small multiples', 'Unit visualizations']
  },
  {
    type: 'image',
    name: 'Image',
    description: 'Display images in the visualization',
    icon: '🖼️',
    bestFor: ['Icons', 'Thumbnails', 'Custom marks']
  },
  {
    type: 'geoshape',
    name: 'Geoshape',
    description: 'Create geographic visualizations',
    icon: '🗺️',
    bestFor: ['Maps', 'Geographic data', 'Spatial analysis']
  },
  {
    type: 'errorband',
    name: 'Error Band',
    description: 'Show uncertainty ranges',
    icon: '↕️',
    bestFor: ['Uncertainty', 'Confidence intervals', 'Ranges']
  },
  {
    type: 'errorbar',
    name: 'Error Bar',
    description: 'Display statistical error ranges',
    icon: '⊢',
    bestFor: ['Statistical error', 'Confidence intervals', 'Ranges']
  },
  {
    type: 'violin',
    name: 'Violin',
    description: 'Show probability density of data',
    icon: '🎻',
    bestFor: ['Distributions', 'Statistical analysis', 'Density plots']
  }
]; 