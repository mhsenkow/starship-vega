import { ExtendedSpec, MarkType } from '../types/vega';

export const enhanceChartSpec = (spec: ExtendedSpec, chartType: MarkType): ExtendedSpec => {
  switch (chartType) {
    case 'bar':
      return {
        ...spec,
        mark: { type: 'bar', tooltip: true },
        encoding: {
          ...spec.encoding,
          y: { ...spec.encoding?.y, stack: 'zero' }
        }
      };

    case 'line':
      return {
        ...spec,
        mark: { type: 'line', point: true, tooltip: true }
      };

    // ... other chart type enhancements

    default:
      return spec;
  }
}; 