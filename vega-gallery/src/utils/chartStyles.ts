import { Theme } from '../styles/theme';
import { ChartStyle } from '../types/chart';

export function applyChartStyle(spec: any, theme?: Theme): any {
  // Use default style if no theme is provided
  const defaultStyle: ChartStyle = {
    colors: {
      primary: '#4C78A8',
      secondary: '#72B7B2',
      background: '#ffffff'
    },
    marks: {
      opacity: 0.8,
      stroke: '#ffffff',
      strokeWidth: 1,
      blend: 'multiply'
    },
    view: {
      padding: 20,
      backgroundColor: '#ffffff'
    }
  };

  const chartStyle = theme?.chart || defaultStyle;
  
  return {
    ...spec,
    config: {
      ...spec.config,
      // Apply theme colors to marks
      mark: {
        ...spec.config?.mark,
        color: chartStyle.colors.primary,
        fill: chartStyle.colors.primary,
      },
      // Apply theme to view
      view: {
        ...spec.config?.view,
        ...chartStyle.view,
        stroke: 'transparent'
      },
      // Style axis
      axis: {
        ...spec.config?.axis,
        labelFont: theme?.typography.fontFamily.primary,
        titleFont: theme?.typography.fontFamily.primary,
        labelColor: theme?.colors.neutral[700],
        titleColor: theme?.colors.neutral[900],
        gridColor: theme?.colors.neutral[200],
        domainColor: theme?.colors.neutral[300],
        tickColor: theme?.colors.neutral[400]
      },
      // Style legend
      legend: {
        ...spec.config?.legend,
        labelFont: theme?.typography.fontFamily.primary,
        titleFont: theme?.typography.fontFamily.primary,
        labelColor: theme?.colors.neutral[700],
        titleColor: theme?.colors.neutral[900]
      },
      // Style title
      title: {
        ...spec.config?.title,
        font: theme?.typography.fontFamily.primary,
        color: theme?.colors.neutral[900],
        fontSize: theme?.typography.fontSize.lg ? parseInt(theme.typography.fontSize.lg) : 16,
        fontWeight: theme?.typography.fontWeight.semibold
      }
    },
    // Apply mark-specific styles
    mark: {
      ...spec.mark,
      ...chartStyle.marks
    },
    // Apply encoding styles
    encoding: {
      ...spec.encoding,
      color: spec.encoding?.color || { 
        value: chartStyle.colors.primary 
      }
    }
  };
}

// Helper functions for chart styling
export function getChartColorScheme(theme?: Theme, type: 'sequential' | 'categorical' | 'diverging' = 'categorical') {
  return theme?.colors.charts?.[type];
}

export function getChartTypography(theme?: Theme) {
  return theme?.typography;
}

export function getChartDimensions(theme?: Theme) {
  return {
    padding: theme?.spacing,
    borderRadius: theme?.borders.radius
  };
}

// Helper function to get chart-specific colors from theme
export function getChartColors(theme: Theme) {
  return theme.chart.colors;
}

// Helper function to get chart-specific marks styling from theme
export function getChartMarks(theme: Theme) {
  return theme.chart.marks;
} 