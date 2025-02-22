import { DatasetMetadata } from '../types/dataset';
import { ChartType } from '../types/chart';

export interface ChartRecommendation {
  chartType: ChartType;
  confidence: number;
  reason: string;
  suggestedEncodings: Record<string, {
    field: string;
    type: string;
    aggregate?: string;
    scale?: any;
  }>;
}

// Add these helper functions
const analyzeDistribution = (field: string, values: any[]) => {
  const nums = values.map(v => Number(v[field])).filter(n => !isNaN(n));
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
  const skewness = nums.reduce((a, b) => a + Math.pow(b - mean, 3), 0) / (nums.length * Math.pow(variance, 1.5));
  return { mean, variance, skewness };
};

const detectSeasonality = (timeField: string, valueField: string, values: any[]) => {
  // Sort by time
  const sorted = [...values].sort((a, b) => new Date(a[timeField]).getTime() - new Date(b[timeField]).getTime());
  
  // Check for repeating patterns
  const diffs = [];
  for (let i = 1; i < sorted.length; i++) {
    diffs.push(sorted[i][valueField] - sorted[i-1][valueField]);
  }
  
  // Look for sign changes in differences (peaks and valleys)
  let signChanges = 0;
  for (let i = 1; i < diffs.length; i++) {
    if (Math.sign(diffs[i]) !== Math.sign(diffs[i-1])) {
      signChanges++;
    }
  }
  
  return signChanges > (sorted.length / 4); // Arbitrary threshold
};

export const getChartRecommendations = (dataset: DatasetMetadata): ChartRecommendation[] => {
  const recommendations: ChartRecommendation[] = [];
  const dataTypes = dataset.dataTypes || {};
  const fields = Object.keys(dataTypes);
  
  // Helper to check if field has unique values
  const getUniqueValueCount = (field: string) => {
    return new Set(dataset.values.map(row => row[field])).size;
  };

  // Helper to check if field is date-like
  const isTimeField = (field: string) => {
    return dataset.values.some(row => !isNaN(Date.parse(row[field])));
  };

  // Helper to check if field has numeric values
  const isNumeric = (field: string) => {
    return dataset.values.every(row => !isNaN(Number(row[field])));
  };

  // Find temporal fields
  const temporalFields = fields.filter(field => isTimeField(field));
  
  // Find numeric fields
  const numericFields = fields.filter(field => isNumeric(field));
  
  // Find categorical fields
  const categoricalFields = fields.filter(field => {
    const uniqueCount = getUniqueValueCount(field);
    return uniqueCount < dataset.values.length * 0.3; // Less than 30% unique values
  });

  // Analyze distributions for numeric fields
  numericFields.forEach(field => {
    const stats = analyzeDistribution(field, dataset.values);
    
    // Check for skewed distributions
    if (Math.abs(stats.skewness) > 1) {
      recommendations.push({
        chartType: 'boxplot',
        confidence: 0.85,
        reason: `Field "${field}" shows significant skewness (${stats.skewness.toFixed(2)}). Box plots are great for showing distribution characteristics.`,
        suggestedEncodings: {
          x: { field: categoricalFields[0] || field, type: categoricalFields.length ? 'nominal' : 'quantitative' },
          y: { field: field, type: 'quantitative' }
        }
      });
    }
  });

  // Check for time series patterns with seasonality
  if (temporalFields.length > 0 && numericFields.length > 0) {
    const timeField = temporalFields[0];
    numericFields.forEach(field => {
      const hasSeasonality = detectSeasonality(timeField, field, dataset.values);
      
      if (hasSeasonality) {
        recommendations.push({
          chartType: 'area',
          confidence: 0.9,
          reason: `Detected seasonal patterns in "${field}" over time. Area charts help visualize periodic patterns and cumulative trends.`,
          suggestedEncodings: {
            x: { field: timeField, type: 'temporal' },
            y: { field: field, type: 'quantitative', scale: { zero: true } },
            ...(categoricalFields.length > 0 && {
              color: { field: categoricalFields[0], type: 'nominal' }
            })
          }
        });
      }
    });
  }

  // Check for correlations between numeric fields
  if (numericFields.length >= 2) {
    // Calculate correlation
    const correlation = calculateCorrelation(dataset.values, numericFields[0], numericFields[1]);
    if (Math.abs(correlation) > 0.5) {
      recommendations.push({
        chartType: 'point',
        confidence: 0.95,
        reason: `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation (${correlation.toFixed(2)}) detected between "${numericFields[0]}" and "${numericFields[1]}".`,
        suggestedEncodings: {
          x: { field: numericFields[0], type: 'quantitative', scale: { zero: false } },
          y: { field: numericFields[1], type: 'quantitative', scale: { zero: false } },
          size: { field: numericFields[2], type: 'quantitative', scale: { range: [30, 300] } }
        }
      });
    }
  }

  // Check for small multiples opportunity
  if (categoricalFields.length >= 2 && numericFields.length > 0) {
    recommendations.push({
      chartType: 'point',
      confidence: 0.8,
      reason: `Multiple categorical fields found. Consider a faceted view to show relationships across categories.`,
      suggestedEncodings: {
        x: { field: numericFields[0], type: 'quantitative' },
        y: { field: numericFields[1] || numericFields[0], type: 'quantitative' },
        row: { field: categoricalFields[0], type: 'nominal' },
        column: { field: categoricalFields[1], type: 'nominal' },
        color: { field: categoricalFields[2] || categoricalFields[0], type: 'nominal' }
      }
    });
  }

  // Check for stacked proportions
  if (temporalFields.length > 0 && categoricalFields.length > 0 && numericFields.length > 0) {
    recommendations.push({
      chartType: 'area',
      confidence: 0.85,
      reason: `Time series data with categories detected. Stacked area charts can show how proportions change over time.`,
      suggestedEncodings: {
        x: { field: temporalFields[0], type: 'temporal' },
        y: { 
          field: numericFields[0], 
          type: 'quantitative',
          aggregate: 'sum',
          stack: 'normalize'
        },
        color: { field: categoricalFields[0], type: 'nominal' }
      }
    });
  }

  // Check for time series patterns
  if (temporalFields.length > 0 && numericFields.length > 0) {
    recommendations.push({
      chartType: 'line',
      confidence: 0.9,
      reason: `Found time-based field "${temporalFields[0]}" with numeric measurements. Line charts are excellent for showing trends over time.`,
      suggestedEncodings: {
        x: { field: temporalFields[0], type: 'temporal' },
        y: { field: numericFields[0], type: 'quantitative' },
        ...(categoricalFields.length > 0 && {
          color: { field: categoricalFields[0], type: 'nominal' }
        })
      }
    });
  }

  // Check for distribution patterns
  if (numericFields.length >= 2) {
    recommendations.push({
      chartType: 'point',
      confidence: 0.85,
      reason: `Found multiple numeric fields. Scatter plots are great for showing relationships between variables.`,
      suggestedEncodings: {
        x: { field: numericFields[0], type: 'quantitative' },
        y: { field: numericFields[1], type: 'quantitative' },
        ...(numericFields[2] && {
          size: { field: numericFields[2], type: 'quantitative' }
        }),
        ...(categoricalFields[0] && {
          color: { field: categoricalFields[0], type: 'nominal' }
        })
      }
    });
  }

  // Check for categorical comparisons
  if (categoricalFields.length > 0 && numericFields.length > 0) {
    const uniqueValues = getUniqueValueCount(categoricalFields[0]);
    if (uniqueValues <= 10) { // Not too many categories
      recommendations.push({
        chartType: 'bar',
        confidence: 0.8,
        reason: `Found categorical field "${categoricalFields[0]}" with ${uniqueValues} categories and numeric measurements. Bar charts excel at comparing values across categories.`,
        suggestedEncodings: {
          x: { field: categoricalFields[0], type: 'nominal' },
          y: { 
            field: numericFields[0], 
            type: 'quantitative',
            aggregate: 'sum'
          },
          ...(categoricalFields.length > 1 && {
            color: { field: categoricalFields[1], type: 'nominal' }
          })
        }
      });
    }
  }

  // Check for part-to-whole relationships
  if (categoricalFields.length > 0 && numericFields.length > 0) {
    const uniqueValues = getUniqueValueCount(categoricalFields[0]);
    if (uniqueValues <= 8) { // Not too many segments
      recommendations.push({
        chartType: 'arc',
        confidence: 0.75,
        reason: `Found categorical field with ${uniqueValues} categories. Pie/donut charts work well for showing proportions when there aren't too many segments.`,
        suggestedEncodings: {
          theta: { 
            field: numericFields[0], 
            type: 'quantitative',
            aggregate: 'sum'
          },
          color: { field: categoricalFields[0], type: 'nominal' }
        }
      });
    }
  }

  // Check for hierarchical data
  const hasHierarchy = fields.some(f => f.includes('parent') || f.includes('level'));
  if (hasHierarchy && numericFields.length > 0) {
    recommendations.push({
      chartType: 'treemap',
      confidence: 0.7,
      reason: 'Detected hierarchical structure in the data. Treemaps are effective for showing hierarchical data with size relationships.',
      suggestedEncodings: {
        size: { 
          field: numericFields[0], 
          type: 'quantitative' 
        },
        color: { 
          field: categoricalFields[0] || numericFields[1], 
          type: categoricalFields.length > 0 ? 'nominal' : 'quantitative' 
        }
      }
    });
  }

  // Add new recommendation logic
  if (numericFields.length >= 2 && categoricalFields.length >= 1) {
    recommendations.push({
      chartType: 'your-new-chart-type',
      confidence: 0.85,
      reason: 'Reason for recommending this chart type',
      suggestedEncodings: {
        x: { field: numericFields[0], type: 'quantitative' },
        y: { field: numericFields[1], type: 'quantitative' },
        color: { field: categoricalFields[0], type: 'nominal' }
      }
    });
  }

  // Sort by confidence and limit to top 5 most confident recommendations
  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
};

// Helper function to calculate correlation
function calculateCorrelation(data: any[], field1: string, field2: string): number {
  const values1 = data.map(d => Number(d[field1])).filter(n => !isNaN(n));
  const values2 = data.map(d => Number(d[field2])).filter(n => !isNaN(n));
  
  const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
  const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
  
  const variance1 = values1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
  const variance2 = values2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);
  
  const covariance = values1.reduce((a, b, i) => a + (b - mean1) * (values2[i] - mean2), 0);
  
  return covariance / Math.sqrt(variance1 * variance2);
} 