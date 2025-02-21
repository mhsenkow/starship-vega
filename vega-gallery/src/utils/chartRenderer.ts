import { TopLevelSpec as VegaLiteSpec } from 'vega-lite'
import { Spec as VegaSpec } from 'vega'
import vegaEmbed, { EmbedOptions, Config } from 'vega-embed'
import { ChartStyle } from '../types/chart'

interface RenderOptions {
  mode?: 'gallery' | 'editor';
  style?: Partial<ChartStyle>;
  actions?: boolean;
}

// Function to apply visual effects directly to SVG elements
const applyVisualEffectsToSVG = (element: HTMLElement, style?: Partial<ChartStyle>) => {
  if (!style) return;

  const svg = element.querySelector('svg');
  if (!svg) return;

  // Apply glow effect
  if (style.marks?.glowRadius) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', style.marks.glowRadius.toString());
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Apply filter to marks
    const marks = svg.querySelectorAll('.mark-symbol path, .mark-circle path');
    marks.forEach(mark => {
      mark.setAttribute('filter', 'url(#glow)');
      if (style.marks?.glowColor) {
        mark.setAttribute('stroke', style.marks.glowColor);
      }
    });
  }

  // Apply drop shadow
  if (style.marks?.shadowRadius) {
    const defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'shadow');
    
    const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
    feDropShadow.setAttribute('dx', '0');
    feDropShadow.setAttribute('dy', '4');
    feDropShadow.setAttribute('stdDeviation', style.marks.shadowRadius.toString());
    
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
    if (!svg.querySelector('defs')) {
      svg.appendChild(defs);
    }

    const marks = svg.querySelectorAll('.mark-symbol path, .mark-circle path');
    marks.forEach(mark => {
      mark.setAttribute('filter', 'url(#shadow)');
    });
  }

  // Apply blur effect
  if (style.marks?.blur) {
    const defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'blur');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', style.marks.blur.toString());
    
    filter.appendChild(feGaussianBlur);
    defs.appendChild(filter);
    if (!svg.querySelector('defs')) {
      svg.appendChild(defs);
    }

    const marks = svg.querySelectorAll('.mark-symbol path, .mark-circle path');
    marks.forEach(mark => {
      mark.setAttribute('filter', 'url(#blur)');
    });
  }

  // Apply gradient background
  if (style.view?.gradientType !== 'none' && style.view?.gradientStart && style.view?.gradientEnd) {
    const defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 
      style.view.gradientType === 'linear' ? 'linearGradient' : 'radialGradient'
    );
    gradient.setAttribute('id', 'background-gradient');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', style.view.gradientStart);
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', style.view.gradientEnd);
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    if (!svg.querySelector('defs')) {
      svg.appendChild(defs);
    }

    // Add background rect
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'url(#background-gradient)');
    svg.insertBefore(rect, svg.firstChild);
  }
};

const applyChartStyles = (spec: VegaLiteSpec | VegaSpec, style?: Partial<ChartStyle>) => {
  if (!style) return spec;

  // Create a base config that will work with Vega-Lite
  const config = {
    axis: {
      // Axis styling
      tickOpacity: style.axis?.tickOpacity,
      domain: true,
      domainColor: style.axis?.baselineColor,
      domainWidth: style.axis?.baselineWidth,
      domainOpacity: style.axis?.baselineOpacity,
    },
    view: {
      // View styling
      fill: style.view?.backgroundColor,
      fillOpacity: style.view?.backgroundOpacity,
      padding: style.view?.padding,
    },
    title: {
      fontSize: style.legend?.titleFontSize
    },
    legend: {
      labelFontSize: style.legend?.labelFontSize
    }
  };

  return {
    ...spec,
    config: {
      ...spec.config,
      ...config
    }
  };
};

export function validateEncoding(spec: any, markType: string) {
  const invalidChannels = {
    line: ['theta', 'radius'],
    bar: ['theta', 'radius'],
    point: ['theta', 'radius'],
    area: ['theta', 'radius'],
    // Add more mark-specific invalid channels
  };

  if (spec.encoding && invalidChannels[markType]) {
    const encoding = { ...spec.encoding };
    invalidChannels[markType].forEach(channel => {
      delete encoding[channel];
    });
    return { ...spec, encoding };
  }

  return spec;
}

/**
 * Vega-Lite chart rendering utilities
 * - Handles chart rendering and updates
 * - Applies visual effects and styling
 * - Manages chart container sizing
 */

// Add data validation and preprocessing
function preprocessSpec(spec: TopLevelSpec): TopLevelSpec {
  if (!spec.data?.values?.length) {
    return spec;
  }

  const values = spec.data.values;
  const mark = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;

  // Special handling for line charts
  if (mark === 'line') {
    const xField = spec.encoding?.x?.field as string;
    const yField = spec.encoding?.y?.field as string;

    if (!xField || !yField) return spec;

    // Filter out invalid values and sort by x-axis
    const validValues = values
      .filter(d => {
        const x = d[xField];
        const y = d[yField];
        return x != null && y != null && 
               !Number.isNaN(Number(x)) && !Number.isNaN(Number(y));
      })
      .sort((a, b) => {
        // Handle date sorting
        if (spec.encoding?.x?.type === 'temporal') {
          const dateA = new Date(a[xField]);
          const dateB = new Date(b[xField]);
          return dateA.getTime() - dateB.getTime();
        }
        return Number(a[xField]) - Number(b[xField]);
      });

    return {
      ...spec,
      data: { values: validValues },
      encoding: {
        ...spec.encoding,
        x: {
          ...spec.encoding?.x,
          scale: { nice: true },
        },
        y: {
          ...spec.encoding?.y,
          scale: { nice: true },
        }
      }
    };
  }

  return spec;
}

export const renderVegaLite = async (
  container: HTMLElement, 
  spec: TopLevelSpec,
  options: RenderOptions = {}
) => {
  try {
    // Determine chart type and create safe spec
    const markType = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
    
    const safeSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      ...spec,
      // Ensure mark configuration
      mark: (() => {
        const baseConfig = {
          tooltip: true,
          filled: true,
          opacity: 0.8,
          fillOpacity: 0.6,
          stroke: '#fff',
          strokeWidth: 1
        };

        if (typeof spec.mark === 'string') {
          return {
            type: spec.mark,
            ...baseConfig
          };
        }

        // Handle specific chart types
        switch (markType) {
          case 'violin':
            return {
              type: 'violin',
              ...baseConfig,
              orient: 'vertical',
              extent: 'min-max',
              density: true
            };
          case 'arc':
            return {
              type: 'arc',
              ...baseConfig,
              innerRadius: spec.mark?.innerRadius || 0,
              padAngle: spec.mark?.padAngle || 0
            };
          default:
            return {
              ...spec.mark,
              ...baseConfig
            };
        }
      })(),
      
      // Safe config defaults
      config: {
        ...spec.config,
        view: {
          stroke: null,
          ...spec.config?.view
        },
        mark: {
          filled: true,
          opacity: 0.8,
          fillOpacity: 0.6,
          ...spec.config?.mark
        }
      }
    };

    // Ensure data exists
    if (!safeSpec.data?.values?.length) {
      safeSpec.data = {
        values: [{ value: 0 }]
      };
    }

    // Handle specific chart type encodings
    if (!safeSpec.encoding) {
      safeSpec.encoding = {};
    }

    // Add default encodings based on chart type
    switch (markType) {
      case 'violin':
        if (!safeSpec.encoding.y) {
          safeSpec.encoding = {
            ...safeSpec.encoding,
            y: { 
              field: 'value',
              type: 'quantitative',
              scale: { zero: false }
            },
            x: {
              field: 'category',
              type: 'nominal'
            }
          };
        }
        break;
      case 'arc':
        if (!safeSpec.encoding.theta) {
          safeSpec.encoding = {
            ...safeSpec.encoding,
            theta: { field: 'value', type: 'quantitative' },
            color: { field: 'category', type: 'nominal' }
          };
        }
        break;
    }

    // Ensure proper sizing
    safeSpec.width = options.mode === 'gallery' ? 300 : 'container';
    safeSpec.height = options.mode === 'gallery' ? 200 : 'container';
    safeSpec.autosize = { type: 'fit', contains: 'padding', resize: true };

    await vegaEmbed(container, safeSpec, {
      actions: options.mode === 'editor',
      renderer: 'svg',
      theme: 'light',
      defaultStyle: true
    });
  } catch (err) {
    console.error('Error rendering chart:', err);
    throw err;
  }
}; 