import { TopLevelSpec as VegaLiteSpec } from 'vega-lite'
import { Spec as VegaSpec } from 'vega'
import vegaEmbed, { EmbedOptions, Config } from 'vega-embed'
import { ChartStyle } from '../types/chart'
import { ExtendedSpec } from '../types/vega'

interface RenderOptions {
  mode?: 'gallery' | 'editor';
  style?: Partial<ChartStyle>;
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

export const renderVegaLite = async (
  element: HTMLElement, 
  spec: ExtendedSpec,
  options: RenderOptions = {}
) => {
  try {
    // Add proper configuration for effects
    const enhancedSpec = {
      ...spec,
      config: {
        ...spec.config,
        // Enable animations
        animation: spec.config?.animation || true,
        // Add mark-specific configs
        mark: {
          ...spec.config?.mark,
          // Enable tooltips
          tooltip: true,
          // Enable transitions
          transition: true
        },
        // Add view configs
        view: {
          ...spec.config?.view,
          // Enable continuousWidth for responsive sizing
          continuousWidth: true
        }
      }
    };

    await vegaEmbed(element, enhancedSpec, {
      actions: false,
      renderer: 'svg',
      hover: true // Enable hover effects
    });

    // Apply visual effects after the chart is rendered
    applyVisualEffectsToSVG(element, options.style);

  } catch (error) {
    console.error('Error rendering chart:', error);
    throw error;
  }
}; 