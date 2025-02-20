import { TopLevelSpec as VegaLiteSpec } from 'vega-lite'
import { Spec as VegaSpec } from 'vega'
import vegaEmbed, { EmbedOptions } from 'vega-embed'

interface RenderOptions {
  mode?: 'gallery' | 'editor'
}

export const renderVegaLite = async (
  element: HTMLElement, 
  spec: VegaLiteSpec | VegaSpec,
  options: RenderOptions = {}
) => {
  try {
    const isVegaLite = spec.$schema?.includes('vega-lite')
    
    let embedOptions: EmbedOptions = {
      actions: false,
      renderer: 'svg',
      downloadFileName: 'chart',
      defaultStyle: true
    }

    if (isVegaLite) {
      // Handle Vega-Lite specs
      const responsiveSpec = {
        ...spec,
        ...(options.mode === 'gallery' ? {
          width: 300,
          height: 180,
          autosize: { type: "fit", contains: "padding" }
        } : {
          width: "container",
          height: "container",
          autosize: { type: "fit", contains: "padding" }
        })
      }
      embedOptions = { ...embedOptions, mode: 'vega-lite' }
      await vegaEmbed(element, responsiveSpec, embedOptions)
    } else {
      // Handle pure Vega specs
      const responsiveSpec = {
        ...spec,
        autosize: "fit",
        signals: [
          {
            name: "width",
            value: options.mode === 'gallery' ? 300 : element.clientWidth
          },
          {
            name: "height",
            value: options.mode === 'gallery' ? 180 : element.clientHeight
          }
        ]
      }
      embedOptions = { ...embedOptions, mode: 'vega' }
      await vegaEmbed(element, responsiveSpec, embedOptions)
    }

  } catch (error) {
    console.error('Error rendering chart:', error)
    throw error
  }
} 