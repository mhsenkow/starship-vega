import { ChartStyle } from './chart';

export interface ChartColors {
  primary: string;
  secondary: string;
  background: string;
}

export interface ChartMarks {
  opacity: number;
  stroke: string;
  strokeWidth: number;
  blend: string;
}

export interface ChartView {
  padding: number;
  backgroundColor?: string;
  backgroundOpacity?: number;
}

export interface ChartStyle {
  colors: ChartColors;
  marks: ChartMarks;
  view: ChartView;
}

export interface AppTheme {
  colors: {
    primary: string;
    border: string;
    surface: string;
    background: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Combined theme that includes both app and chart styling
export interface Theme extends AppTheme {
  chart: ChartStyle;
}

// Default theme with both app and chart styles
export const theme: Theme = {
  colors: {
    primary: '#4dabf7',
    border: '#e9ecef',
    surface: '#ffffff',
    background: '#f8f9fa'
  },
  text: {
    primary: '#2c3e50',
    secondary: '#6c757d'
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px'
  },
  chart: {
    colors: {
      primary: '#4C78A8',
      secondary: '#72B7B2',
      background: 'white'
    },
    marks: {
      opacity: 0.6,
      stroke: 'white',
      strokeWidth: 1,
      blend: 'multiply'
    },
    view: {
      padding: 20,
      backgroundColor: 'white'
    }
  }
};
