import vegaEmbed, { EmbedOptions, VisualizationSpec as VegaSpec } from 'vega-embed'
import { TopLevelSpec as VegaLiteSpec } from 'vega-lite'
import { ExtendedSpec, MarkType } from '../types/vega'
import { ChartStyle } from '../types/chart'
import { enhanceChartSpec } from './chartEnhancements'
import { getCurrentVegaTheme, getThemeColors } from './vegaThemes'

interface RenderOptions {
  mode?: 'gallery' | 'editor';
  style?: Partial<ChartStyle>;
  applySampling?: boolean;
}

// Define InlineData interface locally since it's used in this file
interface InlineData {
  values: any[];
  [key: string]: any;
}

const applyVisualEffectsToSVG = (element: HTMLElement, style?: Partial<ChartStyle>) => {
  if (!style) return;

  try {
    const svg = element.querySelector('svg');
    if (!svg) return;

    // Apply basic visual effects supported by ChartStyle
    if (style.marks?.opacity !== undefined) {
      svg.style.opacity = style.marks.opacity.toString();
    }

    // Apply drop shadow if specified
    if (style.marks?.shadowRadius) {
      const defs = svg.querySelector('defs') || svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'defs'));
      
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.id = 'chart-drop-shadow';
    
      const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
      feDropShadow.setAttribute('dx', '2');
      feDropShadow.setAttribute('dy', '2');
      feDropShadow.setAttribute('stdDeviation', style.marks.shadowRadius.toString());
      feDropShadow.setAttribute('flood-color', '#000000');
      feDropShadow.setAttribute('flood-opacity', '0.3');
    
      filter.appendChild(feDropShadow);
      defs.appendChild(filter);
      
      svg.style.filter = (svg.style.filter || '') + ' url(#chart-drop-shadow)';
    }
  } catch (error) {
    console.warn('Failed to apply visual effects to SVG:', error);
  }
};

const applyChartStyles = (spec: VegaLiteSpec | VegaSpec, style?: Partial<ChartStyle>) => {
  if (!style) return spec;

  // Create a deep copy of the spec
  const styledSpec = JSON.parse(JSON.stringify(spec));
  
  // Apply color scheme if specified in marks
  if (style.marks && (style.marks as any).colorScheme) {
    if (!styledSpec.config) styledSpec.config = {};
    if (!styledSpec.config.range) styledSpec.config.range = {};
    styledSpec.config.range.category = (style.marks as any).colorScheme;
  }
  
  // Apply font family if specified in view
  if (style.view && (style.view as any).fontFamily) {
    if (!styledSpec.config) styledSpec.config = {};
    styledSpec.config.font = (style.view as any).fontFamily;
  }
  
  // Apply border radius to bars if specified in marks
  if (style.marks && (style.marks as any).borderRadius && (styledSpec as any).mark?.type === 'bar') {
    if (!styledSpec.config) styledSpec.config = {};
    if (!styledSpec.config.bar) styledSpec.config.bar = {};
    (styledSpec.config.bar as any).cornerRadius = (style.marks as any).borderRadius;
  }
  
  return styledSpec;
};

// Helper function to determine chart type
const getChartType = (spec: any): MarkType => {
  if (!spec || !spec.mark) return 'bar';
  return typeof spec.mark === 'string' ? spec.mark : spec.mark.type;
};

/**
 * AGGRESSIVELY apply current theme colors to any Vega-Lite specification
 * This ensures that NO hardcoded colors make it through to the final chart
 */
const forceApplyCurrentTheme = (spec: any): any => {
  // Get current theme configuration and colors
  const currentTheme = getCurrentVegaTheme();
  const themeColors = getThemeColors();
  
  console.log(`[Force Theme] Applying theme colors:`, themeColors.categoryScheme);
  
  // Create a deep copy to avoid mutations
  const themedSpec = JSON.parse(JSON.stringify(spec));
  
  // 1. FORCE theme configuration at the top level
  if (!themedSpec.config) {
    themedSpec.config = {};
  }
  
  // Apply all theme configuration with no exceptions
  themedSpec.config = {
    ...themedSpec.config,
    ...currentTheme,
    // FORCE color ranges - this is critical
    range: {
      ...themedSpec.config.range,
      ...currentTheme.range,
      // Explicitly override with theme colors
      category: themeColors.categoryScheme,
      ordinal: themeColors.ordinalScheme,
      diverging: themeColors.divergingScheme,
    }
  };
  
  // 2. FORCE mark-level theming for charts without color encoding
  if (!themedSpec.encoding?.color && themeColors.categoryScheme.length > 0) {
    const primaryColor = themeColors.primary;
    
    if (typeof themedSpec.mark === 'string') {
      themedSpec.mark = {
        type: themedSpec.mark,
        color: primaryColor
      };
    } else if (themedSpec.mark && typeof themedSpec.mark === 'object') {
      themedSpec.mark = {
        ...themedSpec.mark,
        color: themedSpec.mark.color || primaryColor
      };
    }
  }
  
  // 3. FORCE color encoding to use theme colors
  if (themedSpec.encoding?.color && themeColors.categoryScheme.length > 0) {
    const colorEncoding = themedSpec.encoding.color;
    
    // For categorical data, force theme color scheme
    if (colorEncoding.type === 'nominal' || colorEncoding.type === 'ordinal') {
      if (!colorEncoding.scale) {
        colorEncoding.scale = {};
      }
      // FORCE the color scale to use theme colors
      colorEncoding.scale.range = themeColors.categoryScheme;
    }
  }
  
  // 4. Remove any remaining hardcoded colors in data
  if (themedSpec.data?.values && Array.isArray(themedSpec.data.values)) {
    themedSpec.data.values = themedSpec.data.values.map((item: any) => {
      if (item.color && typeof item.color === 'string' && item.color.startsWith('#')) {
        // Replace hardcoded hex colors with theme colors
        const index = Math.abs(item.color.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % themeColors.categoryScheme.length;
        return { ...item, color: themeColors.categoryScheme[index] };
      }
      return item;
    });
  }
  
  console.log(`[Force Theme] Final themed spec config range:`, themedSpec.config.range);
  console.log(`[Force Theme] Final themed spec mark:`, themedSpec.mark);
  
  return themedSpec;
};

/**
 * Renders a Vega-Lite specification in the given DOM element.
 * EVERY chart rendered through this function will use the current theme colors.
 */
export const renderVegaLite = async (
  element: HTMLElement, 
  spec: ExtendedSpec,
  options: RenderOptions = {}
) => {
  if (!spec) {
    console.error('Chart specification is undefined or null');
    throw new Error('Chart specification is missing');
  }

  if (!element) {
    console.error('Target element is null or undefined');
    throw new Error('Target element is missing');
  }

  // Check if element is still in the document
  if (!document.body.contains(element)) {
    console.error('Target element is not in the document');
    throw new Error('Target element is not in the document');
  }

  try {
    // Check if the spec is a Vega (not Vega-Lite) spec
    const isVegaSpec = !!(spec.$schema && spec.$schema.includes('vega.github.io/schema/vega'));
    
    let renderedSpec: any;
    
    if (isVegaSpec) {
      // For Vega specs, apply theme and render directly
      renderedSpec = forceApplyCurrentTheme(spec);
      
      const embedOptions: EmbedOptions = {
        renderer: 'svg',
        actions: false,
        defaultStyle: false
      };
      
      console.log('Rendering Vega spec with forced theme');
      const result = await vegaEmbed(element, renderedSpec as any, embedOptions);
      
      if (options.style) {
        applyVisualEffectsToSVG(element, options.style);
      }
      
      return result.view;
    }
    
    // Apply sampling to large datasets by default (unless explicitly disabled)
    let processedSpec = spec;
    if (options.applySampling !== false) {
      const chartType = getChartType(spec);
      const inlineData = spec.data as InlineData;
      
      if (inlineData?.values && Array.isArray(inlineData.values) && inlineData.values.length > 1000) {
        console.log(`Applying data sampling for ${chartType} chart with ${inlineData.values.length} points`);
        
        const specifiedSampleSize = (spec.config as any)?.sampleSize;
        processedSpec = enhanceChartSpec(spec, chartType, specifiedSampleSize);
      }
    }
    
    // Process the spec for Vega-Lite with theme application
    renderedSpec = processVegaLiteSpec(processedSpec);
    
    // CRITICAL: Force apply current theme to eliminate ALL hardcoded colors
    renderedSpec = forceApplyCurrentTheme(renderedSpec);
    
    // Clear any existing content first
    if (element.children.length > 0) {
      console.log('Clearing existing content before rendering');
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }

    const embedOptions: EmbedOptions = {
      actions: false,
      renderer: 'svg',
      hover: true,
      defaultStyle: false
    };

    console.log(`[Chart Renderer] Rendering chart with forced theme colors:`, renderedSpec.config?.range?.category);

    // Return the view instance to allow for snapshot creation
    const vegaResult = await vegaEmbed(element, renderedSpec, embedOptions);
    
    if (!vegaResult || !vegaResult.view) {
      console.error('Failed to create Vega view. vegaEmbed result:', vegaResult);
      throw new Error('Failed to create Vega view');
    }
    
    console.log(`[Chart Renderer] Chart rendered successfully with theme colors`);

    // Apply visual effects after the chart is rendered
    if (options.style) {
      applyVisualEffectsToSVG(element, options.style);
    }
    
    return vegaResult.view;
  } catch (error) {
    console.error('Error rendering chart:', error);
    // Display error message in the container
    try {
      element.innerHTML = `<div style="color: red; padding: 16px; text-align: center;">
        Error rendering chart: ${error instanceof Error ? error.message : 'Unknown error'}
      </div>`;
    } catch (e) {
      console.error('Failed to display error message:', e);
    }
    throw error;
  }
};

/**
 * Process a Vega-Lite specification to handle special chart types and ensure
 * all required properties are set correctly.
 */
const processVegaLiteSpec = (spec: ExtendedSpec): any => {
  // Create a deep copy of the spec to avoid modifying the original
  const processedSpec = JSON.parse(JSON.stringify(spec));

  // Helper to determine if mark should be filled
  const shouldFillMark = (markType: string | undefined) => {
    if (!markType) return false;
    
    const filledMarks = ['bar', 'arc', 'area', 'rect', 'square'];
    const nonFilledMarks = ['line', 'point', 'circle', 'text', 'parallel-coordinates', 'wordcloud'];
    
    if (nonFilledMarks.includes(markType)) {
      return false;
    }
    
    return filledMarks.includes(markType);
  };

  // Check if we're dealing with a parallel coordinates chart
  const isParallelCoordinates = 
    (typeof processedSpec.mark === 'string' && processedSpec.mark === 'parallel-coordinates') || 
    (typeof processedSpec.mark === 'object' && processedSpec.mark?.type === 'parallel-coordinates');

  // Check if we're dealing with a word cloud chart
  const isWordCloud = 
    (typeof processedSpec.mark === 'string' && processedSpec.mark === 'wordcloud') || 
    (typeof processedSpec.mark === 'object' && processedSpec.mark?.type === 'wordcloud');

  let renderedSpec: any = { ...processedSpec };

  // Make a deep copy of the spec to avoid mutation issues
  if (isParallelCoordinates) {
    // For parallel coordinates, we need to ensure we use a line mark type
    renderedSpec = { 
      ...processedSpec,
      mark: { 
        type: 'line', 
        opacity: 0.5,
        filled: false 
      }
    };
  } else if (isWordCloud) {
    // For word cloud, we need to ensure we use a text mark type
    renderedSpec = {
      ...processedSpec,
      mark: {
        type: 'text',
        baseline: 'middle',
        align: 'center'
      }
    };
  } else {
    // Process mark configuration for other chart types
    const markType = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
    
    if (typeof spec.mark === 'string') {
      renderedSpec.mark = shouldFillMark(spec.mark) ? 
        { type: spec.mark, filled: true } : 
        { type: spec.mark, filled: false };
    } else if (typeof spec.mark === 'object' && spec.mark?.type) {
      // Ensure 'filled' property is always set
      renderedSpec.mark = {
        ...spec.mark,
        filled: shouldFillMark(spec.mark.type)
      };
    } else {
      // Default mark if none is specified
      console.warn('Chart specification is missing a mark type, using a default');
      renderedSpec.mark = { type: 'point', filled: false };
    }
  }

  // Preserve existing width and height if specified
  const hasWidth = 'width' in spec && spec.width !== undefined;
  const hasHeight = 'height' in spec && spec.height !== undefined;

  // Add schema, dimensions, etc.
  renderedSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    ...renderedSpec,
    // Only set width/height if not already specified
    ...(!hasWidth && { width: 'container' }),
    ...(!hasHeight && { height: 'container' }),
    // Always ensure we have proper autosize configuration
    autosize: {
      type: 'fit',
      contains: 'padding',
      resize: true
    }
  };

  // Clean up incompatible properties for specific mark types
  const markType = typeof renderedSpec.mark === 'string' ? 
    renderedSpec.mark : renderedSpec.mark?.type;
  
  // Comprehensive arc chart handling - completely remove axes
  if (markType === 'arc') {
    // Remove ALL incompatible encodings for arc charts
    if (renderedSpec.encoding) {
      const { size, x, y, ...restEncodings } = renderedSpec.encoding;
      renderedSpec.encoding = restEncodings;
    }
    
    // Force container sizing for maximum space usage
    renderedSpec.width = 'container';
    renderedSpec.height = 'container';
    
    // Use pad autosize to fill the container completely
    renderedSpec.autosize = {
      type: 'pad',
      resize: true
    };
    
    // Configure view to eliminate all strokes and borders
    renderedSpec.view = {
      stroke: null,
      fill: null
    };
    
    // Completely eliminate all axis configurations
    renderedSpec.config = {
      ...renderedSpec.config,
      // Remove all possible axis configurations
      axis: null,
      axisX: null,
      axisY: null,
      axisTop: null,
      axisBottom: null,
      axisLeft: null,
      axisRight: null,
      // Ensure view has no stroke
      view: {
        ...renderedSpec.config?.view,
        stroke: null,
        fill: null
      }
    };
    
    // Remove any existing axes array if present
    delete renderedSpec.axes;
    delete renderedSpec.axis;
  }
  
  return renderedSpec;
};

/**
 * Creates a snapshot (image) from a Vega view instance.
 * This is useful for saving charts as images or creating thumbnails.
 */
export const createSnapshot = async (view: any): Promise<string> => {
  if (!view) {
    throw new Error('View is required to create snapshot');
  }
  
  try {
    // Convert the view to a canvas data URL
    const canvas = await view.toCanvas();
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error creating snapshot:', error);
    throw new Error(`Failed to create snapshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Validates a Vega-Lite specification for basic correctness.
 * Returns true if the spec appears to be valid, false otherwise.
 */
export const validateSpec = (spec: any): boolean => {
  try {
    // Basic validation checks
    if (!spec || typeof spec !== 'object') {
      return false;
    }
  
    // Check for required properties
    if (!spec.data && !spec.datasets) {
      return false;
    }
  
    // Check for mark
    if (!spec.mark && !spec.layer && !spec.concat && !spec.facet && !spec.repeat) {
      return false;
    }
  
    return true;
  } catch (error) {
    console.error('Error validating spec:', error);
    return false;
  }
}; 