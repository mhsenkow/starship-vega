import { ChartStyle } from '../types/chart';
import { getThemeColors } from './vegaThemes';

export const getDefaultChartStyle = (): ChartStyle => {
  return {
    marks: {
      opacity: 0.6,
      stroke: 'var(--color-border)',
      strokeWidth: 1,
      blend: 'multiply'
    },
    view: {
      padding: 20,
      stroke: null
    }
  };
};

export function applyChartStyle(spec: any, style: Partial<ChartStyle> = {}): any {
  const mergedStyle = { ...getDefaultChartStyle(), ...style };
  
  return {
    ...spec,
    config: {
      ...spec.config,
      // Apply mark styles
      ...(mergedStyle.marks && {
        mark: {
          ...spec.config?.mark,
          ...mergedStyle.marks,
        }
      }),
      // Apply axis styles
      ...(mergedStyle.axis && {
        axis: {
          ...spec.config?.axis,
          ...mergedStyle.axis,
        }
      }),
      // Apply legend styles
      ...(mergedStyle.legend && {
        legend: {
          ...spec.config?.legend,
          ...mergedStyle.legend,
        }
      }),
      // Apply view styles
      ...(mergedStyle.view && {
        view: {
          ...spec.config?.view,
          ...mergedStyle.view,
        }
      }),
    }
  };
} 