import { TopLevelSpec } from 'vega-lite'
import vegaEmbed from 'vega-embed'

interface RenderOptions {
  mode?: 'gallery' | 'editor'
}

export const renderVegaLite = async (
  element: HTMLElement, 
  spec: TopLevelSpec,
  options: RenderOptions = {}
) => {
  try {
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
      }),
      config: {
        ...spec.config,
        view: {
          ...spec.config?.view,
          stroke: null
        }
      }
    }

    await vegaEmbed(element, responsiveSpec, {
      actions: false,
      renderer: 'svg',
      downloadFileName: 'chart'
    })

  } catch (error) {
    console.error('Error rendering Vega-Lite chart:', error)
  }
} 