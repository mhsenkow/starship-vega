import { useMemo } from 'react';
import { ChartCard } from './ChartCard';
import { Container, Grid } from './styles';
import { ChartConfig, ChartCategory, Complexity } from '../../../types/chart';
import { chartSpecs } from '../../../charts/specs';
import { useNavigate } from 'react-router-dom';

// Example chart configurations showing different variations
const EXAMPLE_CHARTS: ChartConfig[] = [
  // Bar Chart Variations
  {
    id: 'bar-vertical',
    title: 'Vertical Bar Chart',
    description: 'Classic vertical bar chart for comparing categories',
    category: ChartCategory.Statistical,
    complexity: Complexity.Beginner,
    spec: {
      ...chartSpecs.barChart,
      encoding: {
        x: { field: 'category', type: 'nominal' },
        y: { field: 'value', type: 'quantitative' }
      }
    }
  },
  {
    id: 'bar-horizontal',
    title: 'Horizontal Bar Chart',
    description: 'Horizontal bars, great for long category names',
    category: ChartCategory.Statistical,
    complexity: Complexity.Beginner,
    spec: {
      ...chartSpecs.barChart,
      encoding: {
        y: { field: 'category', type: 'nominal' },
        x: { field: 'value', type: 'quantitative' }
      }
    }
  },
  {
    id: 'bar-grouped',
    title: 'Grouped Bar Chart',
    description: 'Compare categories within groups',
    category: ChartCategory.Comparison,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.groupedBar
    }
  },

  // Pie Chart Variations
  {
    id: 'pie-basic',
    title: 'Basic Pie Chart',
    description: 'Simple pie chart for part-to-whole relationships',
    category: ChartCategory.PartToWhole,
    complexity: Complexity.Beginner,
    spec: {
      ...chartSpecs.pieChart
    }
  },
  {
    id: 'pie-donut',
    title: 'Donut Chart',
    description: 'Pie chart with center hole for better readability',
    category: ChartCategory.PartToWhole,
    complexity: Complexity.Beginner,
    spec: {
      ...chartSpecs.pieChart,
      mark: { type: 'arc', innerRadius: 50 }
    }
  },
  {
    id: 'pie-nested',
    title: 'Nested Pie Chart',
    description: 'Multi-level pie chart for hierarchical data',
    category: ChartCategory.Hierarchical,
    complexity: Complexity.Advanced,
    spec: {
      ...chartSpecs.pieChart,
      layer: [
        { mark: { type: 'arc', innerRadius: 0, outerRadius: 80 } },
        { mark: { type: 'arc', innerRadius: 90, outerRadius: 120 } }
      ]
    }
  },

  // Scatter Plot Variations
  {
    id: 'scatter-basic',
    title: 'Basic Scatter Plot',
    description: 'Simple scatter plot showing correlation',
    category: ChartCategory.Correlation,
    complexity: Complexity.Beginner,
    spec: {
      ...chartSpecs.scatterPlot
    }
  },
  {
    id: 'scatter-bubble',
    title: 'Bubble Chart',
    description: 'Scatter plot with sized points',
    category: ChartCategory.Correlation,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.bubblePlot
    }
  },
  {
    id: 'scatter-connected',
    title: 'Connected Scatter',
    description: 'Scatter plot with connected points showing progression',
    category: ChartCategory.Correlation,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.connectedScatter
    }
  },

  // Line Chart Variations
  {
    id: 'line-basic',
    title: 'Basic Line Chart',
    description: 'Simple line chart for temporal data',
    category: ChartCategory.TimeSeries,
    complexity: Complexity.Beginner,
    spec: {
      ...chartSpecs.lineChart
    }
  },
  {
    id: 'line-multi',
    title: 'Multi-Line Chart',
    description: 'Multiple lines for comparing trends',
    category: ChartCategory.TimeSeries,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.lineChart,
      encoding: {
        x: { field: 'date', type: 'temporal' },
        y: { field: 'value', type: 'quantitative' },
        color: { field: 'category', type: 'nominal' }
      }
    }
  },
  {
    id: 'line-area',
    title: 'Area Chart',
    description: 'Line chart with filled areas',
    category: ChartCategory.TimeSeries,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.lineChart,
      mark: { type: 'area', line: true }
    }
  },

  // Statistical Variations
  {
    id: 'stats-boxplot',
    title: 'Box Plot',
    description: 'Show distribution and outliers',
    category: ChartCategory.Statistical,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.boxPlot
    }
  },
  {
    id: 'stats-violin',
    title: 'Violin Plot',
    description: 'Detailed distribution visualization',
    category: ChartCategory.Statistical,
    complexity: Complexity.Advanced,
    spec: {
      ...chartSpecs.violinPlot
    }
  },
  {
    id: 'stats-histogram',
    title: 'Histogram',
    description: 'Distribution of numerical data',
    category: ChartCategory.Statistical,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.histogramKde
    }
  },

  // Advanced Bar Variations
  {
    id: 'bar-stacked',
    title: 'Stacked Bar Chart',
    description: 'Show part-to-whole relationships over categories',
    category: ChartCategory.PartToWhole,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.stackedBar
    }
  },

  // Advanced Area Charts
  {
    id: 'area-stream',
    title: 'Stream Graph',
    description: 'Flowing visualization of temporal patterns',
    category: ChartCategory.TimeSeries,
    complexity: Complexity.Advanced,
    spec: {
      ...chartSpecs.streamGraph
    }
  },

  // Heat Maps
  {
    id: 'heatmap-basic',
    title: 'Heat Map',
    description: 'Color-coded matrix of values',
    category: ChartCategory.Correlation,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.heatmap
    }
  },

  // Radial Variations
  {
    id: 'radial-basic',
    title: 'Radial Chart',
    description: 'Circular visualization of values',
    category: ChartCategory.PartToWhole,
    complexity: Complexity.Advanced,
    spec: {
      ...chartSpecs.radialChart
    }
  },

  // More Statistical Plots
  {
    id: 'stats-density',
    title: 'Density Plot',
    description: 'Smooth distribution visualization',
    category: ChartCategory.Statistical,
    complexity: Complexity.Advanced,
    spec: {
      ...chartSpecs.histogramKde,
      mark: { type: 'area', opacity: 0.5, color: '#72B7B2' }
    }
  },

  {
    id: 'stats-violin-categorical',
    title: 'Categorical Violin Plot',
    description: 'Distribution comparison across categories',
    category: ChartCategory.Statistical,
    complexity: Complexity.Advanced,
    spec: {
      ...chartSpecs.violinPlot,
      encoding: {
        y: { field: 'category', type: 'nominal' },
        x: { field: 'value', type: 'quantitative' },
        color: { field: 'category', type: 'nominal' }
      }
    }
  },

  {
    id: 'bar-stacked-categories',
    title: 'Stacked Bar Chart',
    description: 'Categories stacked to show total and composition',
    category: ChartCategory.PartToWhole,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.barChartStacked
    }
  },
  {
    id: 'bar-grouped-categories',
    title: 'Grouped Bar Chart',
    description: 'Categories grouped side by side for comparison',
    category: ChartCategory.Comparison,
    complexity: Complexity.Intermediate,
    spec: {
      ...chartSpecs.barChartUnstacked
    }
  }
];

interface GalleryGridProps {
  onChartSelect: (id: string) => void;
}

export const GalleryGrid = ({ onChartSelect }: GalleryGridProps) => {
  const navigate = useNavigate();

  const handleChartClick = (chart: ChartConfig) => {
    const params = new URLSearchParams({
      type: chart.id,
      category: chart.category,
      complexity: chart.complexity
    });
    navigate(`/editor?${params.toString()}`);
  };

  return (
    <Container>
      <Grid>
        {EXAMPLE_CHARTS.map(chart => (
          <ChartCard
            key={chart.id}
            chart={chart}
            onClick={() => handleChartClick(chart)}
          />
        ))}
      </Grid>
    </Container>
  );
}; 