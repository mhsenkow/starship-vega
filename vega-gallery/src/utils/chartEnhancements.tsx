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

    case 'area':
      return {
        ...spec,
        mark: { type: 'area', tooltip: true, line: true }
      };

    case 'point':
      return {
        ...spec,
        mark: { type: 'point', tooltip: true }
      };

    default:
      return spec;
  }
}; 