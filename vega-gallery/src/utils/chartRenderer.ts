import vegaEmbed, { EmbedOptions } from 'vega-embed'
import { ExtendedSpec, MarkType } from '../types/vega'
import { ChartStyle } from '../types/chart'
import { enhanceChartSpec } from './chartEnhancements'
import { getCurrentVegaTheme, getThemeColors } from './vegaThemes'

// Cache for theme data to prevent excessive recomputation
let themeCache: {
  currentTheme: any;
  themeColors: any;
  lastTheme: string | null;
  lastColorSet: string | null;
  cacheTime: number;
} | null = null;

const CACHE_DURATION = 1000; // 1 second cache

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


// Helper function to determine chart type
const getChartType = (spec: any): MarkType => {
  if (!spec || !spec.mark) return 'bar';
  return typeof spec.mark === 'string' ? spec.mark : spec.mark.type;
};

/**
 * Clean up problematic spec properties that cause Vega-Lite warnings
 */
const cleanSpecForRendering = (spec: any): any => {
  const cleanedSpec = JSON.parse(JSON.stringify(spec));
  
  // Remove problematic fit properties that cause warnings
  if (cleanedSpec.width && (cleanedSpec.width === 'container' || typeof cleanedSpec.width === 'number')) {
    // Remove fit properties when width is discrete
    if (cleanedSpec.autosize) {
      delete cleanedSpec.autosize.fit;
    }
  }
  
  // Ensure proper width/height handling to avoid infinite extent warnings
  if (cleanedSpec.width && cleanedSpec.height) {
    // If both width and height are set, ensure they're not conflicting with autosize
    if (cleanedSpec.autosize?.type === 'fit') {
      cleanedSpec.autosize = { type: 'pad' };
    }
  }
  
  return cleanedSpec;
};

/**
 * AGGRESSIVELY apply current theme colors to any Vega-Lite specification
 * This ensures that NO hardcoded colors make it through to the final chart
 */
const forceApplyCurrentTheme = (spec: any): any => {
  // Check cache first to avoid excessive theme computation
  const now = Date.now();
  const currentThemeAttr = document.documentElement.getAttribute('data-theme');
  const currentColorSet = document.documentElement.getAttribute('data-color-set');
  
  let currentTheme: any;
  let themeColors: any;
  
  if (themeCache && 
      now - themeCache.cacheTime < CACHE_DURATION &&
      themeCache.lastTheme === currentThemeAttr &&
      themeCache.lastColorSet === currentColorSet) {
    // Use cached values
    currentTheme = themeCache.currentTheme;
    themeColors = themeCache.themeColors;
  } else {
    // Refresh cache
    currentTheme = getCurrentVegaTheme();
    themeColors = getThemeColors();
    
    // Validate theme colors structure
    if (!themeColors || !themeColors.categoryScheme || !Array.isArray(themeColors.categoryScheme)) {
      // console.warn('[Force Theme] Invalid theme colors structure, using fallback');
      themeColors = {
        primary: '#1976d2',
        categoryScheme: ['#1976d2', '#757575', '#2e7d32', '#ed6c02', '#d32f2f'],
        ordinalScheme: ['#1976d2', '#757575', '#2e7d32'],
        divergingScheme: ['#d32f2f', '#f57c00', '#fdd835']
      };
    }
    
    themeCache = {
      currentTheme,
      themeColors,
      lastTheme: currentThemeAttr,
      lastColorSet: currentColorSet,
      cacheTime: now
    };
    // Reduced logging - only log in development mode
  // Temporarily disabled for production
  // if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  //   console.log(`[Force Theme] Applying theme colors:`, themeColors.categoryScheme);
  // }
  }
  
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
  
  // Get primary color for mark theming
  const primaryColor = themeColors.primary;
  
  // Helper function to determine if mark should be filled
  const shouldFillMark = (markType: string | undefined) => {
    if (!markType) return false;
    const filledMarks = ['bar', 'arc', 'area', 'rect', 'square'];
    const nonFilledMarks = ['line', 'point', 'circle', 'text', 'parallel-coordinates', 'wordcloud'];
    if (nonFilledMarks.includes(markType)) return false;
    return filledMarks.includes(markType);
  };
  
  // 2. FORCE mark-level theming - ensure mark always has proper structure
  if (typeof themedSpec.mark === 'string') {
    themedSpec.mark = {
      type: themedSpec.mark,
      color: primaryColor,
      filled: shouldFillMark(themedSpec.mark)
    };
  } else if (themedSpec.mark && typeof themedSpec.mark === 'object') {
    // Ensure filled property and color are always defined
    if (themedSpec.mark.filled === undefined) {
      themedSpec.mark.filled = shouldFillMark(themedSpec.mark.type);
    }
    if (!themedSpec.mark.color && !themedSpec.encoding?.color) {
      themedSpec.mark.color = primaryColor;
    }
    // Ensure opacity is defined for marks that need it
    if (themedSpec.mark.opacity === undefined && ['circle', 'point', 'line', 'violin', 'boxplot'].includes(themedSpec.mark.type)) {
      themedSpec.mark.opacity = 0.7;
    }
    
    // Ensure violin and boxplot marks have proper configuration
    if (themedSpec.mark.type === 'violin' || themedSpec.mark.type === 'boxplot') {
      // Ensure mark has all required properties
      if (themedSpec.mark.opacity === undefined) {
        themedSpec.mark.opacity = 0.7;
      }
      if (themedSpec.mark.filled === undefined) {
        themedSpec.mark.filled = true;
      }
      if (themedSpec.mark.filled && themedSpec.mark.fillOpacity === undefined) {
        themedSpec.mark.fillOpacity = 0.8;
      }
      
      // Additional safety: ensure all mark properties exist
      themedSpec.mark = {
        ...themedSpec.mark,
        opacity: themedSpec.mark.opacity || 0.7,
        filled: themedSpec.mark.filled !== false,
        fillOpacity: themedSpec.mark.filled !== false ? (themedSpec.mark.fillOpacity || 0.8) : undefined
      };
    }
    
    // Ensure fillOpacity is defined for filled marks that need it
    if (themedSpec.mark.filled && themedSpec.mark.fillOpacity === undefined && ['violin', 'boxplot', 'area'].includes(themedSpec.mark.type)) {
      themedSpec.mark.fillOpacity = 0.8;
    }
    
    // Additional safety: ensure fillOpacity exists for any filled mark
    if (themedSpec.mark.filled && themedSpec.mark.fillOpacity === undefined) {
      themedSpec.mark.fillOpacity = 0.8;
    }
    
    // Special handling for violin plots - always ensure they have proper fillOpacity
    if (themedSpec.mark.type === 'violin') {
      if (themedSpec.mark.filled === undefined) {
        themedSpec.mark.filled = true;
      }
      if (themedSpec.mark.filled && themedSpec.mark.fillOpacity === undefined) {
        themedSpec.mark.fillOpacity = 0.8;
      }
    }
    
    // Additional comprehensive safety check for any filled mark
    if (themedSpec.mark.filled === true && themedSpec.mark.fillOpacity === undefined) {
      themedSpec.mark.fillOpacity = 0.8;
    }
  } else if (!themedSpec.mark || themedSpec.mark.type === undefined) {
    // Handle undefined mark case
    // console.warn('[Force Theme] Mark is undefined, setting default mark to bar');
    themedSpec.mark = {
      type: 'bar',
      color: primaryColor,
      filled: true
    };
  }
  
  // 3. Clean up incompatible encodings BEFORE color application
  const markType = typeof themedSpec.mark === 'string' ? themedSpec.mark : themedSpec.mark?.type;
  
  if (themedSpec.encoding) {
    // Clean up encodings based on mark type
    if (markType === 'violin' || markType === 'boxplot') {
      // Remove x and y encodings that are incompatible with violin/boxplot
      delete themedSpec.encoding.x;
      delete themedSpec.encoding.y;
    }
    
    if (markType === 'rect') {
      // Remove size encoding that's incompatible with rect
      delete themedSpec.encoding.size;
    }
    
    if (markType === 'line' || markType === 'point') {
      // Remove theta and radius encodings that are incompatible with line/point
      delete themedSpec.encoding.theta;
      delete themedSpec.encoding.radius;
    }
    
    if (markType === 'arc') {
      // Remove all incompatible encodings for arc charts
      delete themedSpec.encoding.x;
      delete themedSpec.encoding.y;
      delete themedSpec.encoding.size;
    }
    
    if (markType === 'text') {
      // Remove incompatible encodings for text marks
      delete themedSpec.encoding.theta;
      delete themedSpec.encoding.radius;
    }
    
    // Remove problematic transforms that cause warnings
    if (markType === 'line' && themedSpec.transform) {
      // Remove 'nearest' transform which is not supported for line marks
      themedSpec.transform = themedSpec.transform.filter((transform: any) => 
        !(transform.nearest || (typeof transform === 'string' && transform === 'nearest'))
      );
      if (themedSpec.transform.length === 0) {
        delete themedSpec.transform;
      }
    }
  }
  
  if (markType === 'boxplot') {
    // Boxplots need continuous axes - ensure we have proper encodings
    if (themedSpec.encoding) {
      // If no y encoding, create one from data
      if (!themedSpec.encoding.y && themedSpec.data && themedSpec.data.values) {
        const dataValues = themedSpec.data.values;
        if (dataValues.length > 0) {
          const firstRow = dataValues[0];
          const numericFields = Object.keys(firstRow).filter(key => 
            typeof firstRow[key] === 'number' && !isNaN(firstRow[key]) && isFinite(firstRow[key])
          );
          if (numericFields.length > 0) {
            themedSpec.encoding.y = { field: numericFields[0], type: 'quantitative' };
          }
        }
      }
      
      // Ensure y encoding has proper scale configuration
      if (themedSpec.encoding.y) {
        themedSpec.encoding.y.scale = {
          ...themedSpec.encoding.y.scale,
          domain: [0, 100], // Set reasonable domain to avoid infinite extents
          nice: true
        };
      }
      
      // If no x encoding but we have categorical data, create one
      if (!themedSpec.encoding.x && themedSpec.data && themedSpec.data.values) {
        const dataValues = themedSpec.data.values;
        if (dataValues.length > 0) {
          const firstRow = dataValues[0];
          const categoricalFields = Object.keys(firstRow).filter(key => 
            typeof firstRow[key] === 'string' || typeof firstRow[key] === 'number'
          );
          if (categoricalFields.length > 0) {
            themedSpec.encoding.x = { field: categoricalFields[0], type: 'nominal' };
          }
        }
      }
    }
  }

  // 4. FORCE color encoding to use theme colors
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
  
  // Reduced logging - only log in development mode
  // Temporarily disabled for production
  // if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  //   console.log(`[Force Theme] Final themed spec config range:`, themedSpec.config.range);
  //   console.log(`[Force Theme] Final themed spec mark:`, themedSpec.mark);
  // }
  
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
  
  // Validate spec has required properties
  if (typeof spec !== 'object' || (!spec.data && !spec.datasets && !(spec as any).layer && !(spec as any).hconcat && !(spec as any).vconcat && !(spec as any).facet && !(spec as any).repeat)) {
    console.error('Chart specification is missing required data property or is invalid:', spec);
    throw new Error('Chart specification is missing required data property');
  }
  
  if (!spec.mark && !(spec as any).layer && !(spec as any).hconcat && !(spec as any).vconcat && !(spec as any).facet && !(spec as any).repeat) {
    // console.warn('Chart specification is missing required mark property, attempting to fix:', spec);
    
    // Try to infer mark type from chart name or other properties
    let inferredMark = 'point'; // default fallback
    
    // Check if this might be a word cloud based on data structure
    if (spec.data && ((spec.data as any).values || (spec.data as any).url)) {
      const dataValues = (spec.data as any).values || [];
      if (dataValues.length > 0 && dataValues[0].text && dataValues[0].value) {
        inferredMark = 'text'; // likely word cloud
      }
    }
    
    // Check if this is a Vega spec (not Vega-Lite) that might be missing mark
    if (spec.$schema && spec.$schema.includes('vega.github.io/schema/vega')) {
      // For Vega specs, check if it has marks array
      if ((spec as any).marks && Array.isArray((spec as any).marks) && (spec as any).marks.length > 0) {
        // This is a valid Vega spec, don't add a mark property
        return; // Skip mark inference for Vega specs
      }
    }
    
    // Create a basic mark configuration
    spec.mark = {
      type: inferredMark as MarkType,
      filled: inferredMark === 'text' ? false : true,
      ...(inferredMark === 'text' && { baseline: 'middle', align: 'center' }),
      ...(inferredMark === 'point' && { opacity: 0.7 })
    };
    
    // Temporarily disabled for production
    // if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    //   console.log('Inferred mark configuration:', spec.mark);
    // }
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
        defaultStyle: false,
        // Suppress Vega-Lite warnings
        logLevel: 0,
        // Optimize canvas performance for word clouds and other canvas-heavy charts
        config: {
          view: {
            continuousWidth: 600,
            continuousHeight: 400
          }
        }
      };
      
      // Reduced logging - only log in development mode
  // Temporarily disabled for production
  // if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  //   console.log('Rendering Vega spec with forced theme');
  // }
      // Final safety check for fillOpacity before embedding
      if (renderedSpec.mark) {
        const markType = typeof renderedSpec.mark === 'string' ? renderedSpec.mark : renderedSpec.mark.type;
        if (['violin', 'boxplot', 'area'].includes(markType)) {
          // Ensure mark is an object
          if (typeof renderedSpec.mark === 'string') {
            renderedSpec.mark = { type: renderedSpec.mark };
          }
          
          if (renderedSpec.mark.filled === undefined) {
            renderedSpec.mark.filled = true;
          }
          if (renderedSpec.mark.filled && renderedSpec.mark.fillOpacity === undefined) {
            renderedSpec.mark.fillOpacity = 0.8;
          }
        }
      }
      
      // Additional comprehensive safety check for any filled mark
      if (renderedSpec.mark && typeof renderedSpec.mark === 'object') {
        if (renderedSpec.mark.filled === true && renderedSpec.mark.fillOpacity === undefined) {
          renderedSpec.mark.fillOpacity = 0.8;
        }
      }
      
      // Final comprehensive check for violin plots specifically
      if (renderedSpec.mark && typeof renderedSpec.mark === 'object' && renderedSpec.mark.type === 'violin') {
        if (renderedSpec.mark.filled === undefined) {
          renderedSpec.mark.filled = true;
        }
        if (renderedSpec.mark.filled && renderedSpec.mark.fillOpacity === undefined) {
          renderedSpec.mark.fillOpacity = 0.8;
        }
      }
      
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
        // Temporarily disabled for production
        // if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
        //   console.log(`Applying data sampling for ${chartType} chart with ${inlineData.values.length} points`);
        // }
        
        const specifiedSampleSize = (spec.config as any)?.sampleSize;
        processedSpec = enhanceChartSpec(spec, chartType, specifiedSampleSize);
      }
    }
    
    // Process the spec for Vega-Lite with theme application
    renderedSpec = processVegaLiteSpec(processedSpec);
    
    // Clean up problematic spec properties that cause warnings
    renderedSpec = cleanSpecForRendering(renderedSpec);
    
    // CRITICAL: Force apply current theme to eliminate ALL hardcoded colors
    renderedSpec = forceApplyCurrentTheme(renderedSpec);
    
    // Validate spec after theme application
    if (!renderedSpec.mark && !renderedSpec.layer && !renderedSpec.hconcat && !renderedSpec.vconcat && !renderedSpec.facet && !renderedSpec.repeat) {
      console.error('[Chart Renderer] Spec lost mark property during theme application:', renderedSpec);
      throw new Error('Chart specification lost mark property during processing');
    }
    
    if (!renderedSpec.data && !renderedSpec.datasets && !renderedSpec.layer && !renderedSpec.hconcat && !renderedSpec.vconcat && !renderedSpec.facet && !renderedSpec.repeat) {
      console.error('[Chart Renderer] Spec lost data property during theme application:', renderedSpec);
      throw new Error('Chart specification lost data property during processing');
    }
    
    // Clear any existing content first
    if (element.children.length > 0) {
      // Temporarily disabled for production
      // if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
      //   console.log('Clearing existing content before rendering');
      // }
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }

    const embedOptions: EmbedOptions = {
      actions: false,
      renderer: 'svg',
      hover: true,
      defaultStyle: false,
      // Suppress Vega-Lite warnings
      logLevel: 0,
      // Optimize canvas performance for word clouds and other canvas-heavy charts
      config: {
        view: {
          continuousWidth: 600,
          continuousHeight: 400
        }
      }
    };

    // Temporarily disabled for production
    // if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    //   console.log(`[Chart Renderer] Rendering chart with spec keys:`, Object.keys(renderedSpec));
    //   console.log(`[Chart Renderer] Spec has data:`, !!renderedSpec.data);
    //   console.log(`[Chart Renderer] Spec has mark:`, !!renderedSpec.mark);
    //   console.log(`[Chart Renderer] Theme colors:`, renderedSpec.config?.range?.category);
    // }

    // Final safety check for fillOpacity before embedding
    if (renderedSpec.mark) {
      const markType = typeof renderedSpec.mark === 'string' ? renderedSpec.mark : renderedSpec.mark.type;
      if (['violin', 'boxplot', 'area'].includes(markType)) {
        // Ensure mark is an object
        if (typeof renderedSpec.mark === 'string') {
          renderedSpec.mark = { type: renderedSpec.mark };
        }
        
        if (renderedSpec.mark.filled === undefined) {
          renderedSpec.mark.filled = true;
        }
        if (renderedSpec.mark.filled && renderedSpec.mark.fillOpacity === undefined) {
          renderedSpec.mark.fillOpacity = 0.8;
        }
      }
    }
    
    // Additional comprehensive safety check for any filled mark
    if (renderedSpec.mark && typeof renderedSpec.mark === 'object') {
      if (renderedSpec.mark.filled === true && renderedSpec.mark.fillOpacity === undefined) {
        renderedSpec.mark.fillOpacity = 0.8;
      }
    }
    
    // Final comprehensive check for violin plots specifically
    if (renderedSpec.mark && typeof renderedSpec.mark === 'object' && renderedSpec.mark.type === 'violin') {
      if (renderedSpec.mark.filled === undefined) {
        renderedSpec.mark.filled = true;
      }
      if (renderedSpec.mark.filled && renderedSpec.mark.fillOpacity === undefined) {
        renderedSpec.mark.fillOpacity = 0.8;
      }
    }

    // Return the view instance to allow for snapshot creation
    const vegaResult = await vegaEmbed(element, renderedSpec, embedOptions);
    
    if (!vegaResult || !vegaResult.view) {
      console.error('Failed to create Vega view. vegaEmbed result:', vegaResult);
      throw new Error('Failed to create Vega view');
    }
    
    // Temporarily disabled for production
    // if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    //   console.log(`[Chart Renderer] Chart rendered successfully with theme colors`);
    // }

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
    if (typeof spec.mark === 'string') {
      const filled = shouldFillMark(spec.mark);
      renderedSpec.mark = { 
        type: spec.mark, 
        filled,
        ...(filled && spec.mark === 'violin' && { fillOpacity: 0.8 })
      };
    } else if (typeof spec.mark === 'object' && spec.mark && spec.mark.type) {
      // Ensure 'filled' property is always set
      const filled = shouldFillMark(spec.mark.type);
      renderedSpec.mark = {
        ...spec.mark,
        filled,
        ...(filled && ['violin', 'boxplot', 'area'].includes(spec.mark.type) && { fillOpacity: 0.8 })
      };
    } else {
      // Default mark if none is specified
      // console.warn('Chart specification is missing a mark type, using a default');
      renderedSpec.mark = { type: 'point', filled: false };
    }
  }

  // Preserve existing width and height if specified
  const hasWidth = 'width' in spec && spec.width !== undefined;
  const hasHeight = 'height' in spec && spec.height !== undefined;

  // Add schema, dimensions, etc.
  const markType = typeof renderedSpec.mark === 'string' ? 
    renderedSpec.mark : renderedSpec.mark?.type;
  
  // Smart autosize configuration based on mark type and encoding
  // Use 'pad' for charts that don't work well with 'fit'
  const hasFaceting = renderedSpec.encoding && (renderedSpec.encoding.row || renderedSpec.encoding.column);
  const hasDiscreteAxis = renderedSpec.encoding && (
    (renderedSpec.encoding.x && ['ordinal', 'nominal'].includes(renderedSpec.encoding.x.type)) ||
    (renderedSpec.encoding.y && ['ordinal', 'nominal'].includes(renderedSpec.encoding.y.type))
  );
  
  const hasDiscreteSize = renderedSpec.encoding && renderedSpec.encoding.size;
  const hasDiscreteWidth = renderedSpec.encoding && renderedSpec.encoding.x && ['ordinal', 'nominal'].includes(renderedSpec.encoding.x.type);
  const hasDiscreteHeight = renderedSpec.encoding && renderedSpec.encoding.y && ['ordinal', 'nominal'].includes(renderedSpec.encoding.y.type);
  
  // Check for any discrete dimensions that would cause fit warnings
  const hasAnyDiscreteDimension = hasDiscreteSize || hasDiscreteWidth || hasDiscreteHeight || hasDiscreteAxis;
  
  const usePadAutosize = [
    'arc', 'boxplot', 'violin', 'rect', 'heatmap'
  ].includes(markType) || 
  hasAnyDiscreteDimension || // Any chart with discrete dimensions should use pad
  hasFaceting; // Faceted views should use pad
  
  // For charts that consistently cause fit warnings, disable autosize entirely
  const disableAutosize = [
    'rect', 'heatmap'
  ].includes(markType) || hasAnyDiscreteDimension || hasFaceting;
  
  renderedSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    ...renderedSpec,
    // Only set width/height if not already specified
    ...(!hasWidth && { width: 'container' }),
    ...(!hasHeight && { height: 'container' }),
    // Smart autosize configuration
    ...(disableAutosize ? {} : {
    autosize: {
        type: usePadAutosize ? 'pad' : 'fit',
      contains: 'padding',
      resize: true
    }
    })
  };

  // Clean up incompatible properties for specific mark types
  
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
  
  // Note: Encoding cleanup is now handled in forceThemeColors function
  
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