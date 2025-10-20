import { useState } from 'react'
import { CodeEditor } from './CodeEditor'
import { VisualEditor } from './VisualEditor'
import { StyleEditor } from './StyleEditor'
import { TopLevelSpec } from 'vega-lite'
import styles from './TemplateEditor.module.css'

interface TemplateEditorProps {
  spec: string;
  onChange: (spec: string) => void;
}

export const TemplateEditor = ({ spec, onChange }: TemplateEditorProps) => {
  const [mode, setMode] = useState<'visual' | 'code' | 'style'>('visual')
  const [previewHeight, setPreviewHeight] = useState(600)
  
  const handleVisualChange = (updates: Partial<TopLevelSpec>) => {
    try {
      const currentSpec = JSON.parse(spec)
      const newSpec = {
        ...currentSpec,
        // Handle data updates
        ...(updates.data && { data: updates.data }),
        // Handle encoding updates
        ...(updates.encoding && { encoding: {
          ...currentSpec.encoding,
          ...updates.encoding
        }}),
        // Handle mark updates
        ...(updates.mark && { mark: {
          ...(typeof currentSpec.mark === 'object' ? currentSpec.mark : { type: currentSpec.mark }),
          ...updates.mark
        }}),
        // Handle config updates
        ...(updates.config && { config: {
          ...currentSpec.config,
          ...updates.config,
          axis: {
            ...currentSpec.config?.axis,
            ...updates.config.axis
          },
          legend: {
            ...currentSpec.config?.legend,
            ...updates.config.legend
          },
          title: {
            ...currentSpec.config?.title,
            ...updates.config.title
          }
        }})
      }
      onChange(JSON.stringify(newSpec, null, 2))
    } catch (err) {
      console.error('Failed to update specification:', err)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${mode === 'visual' ? styles.active : ''}`}
          onClick={() => setMode('visual')}
        >
          Visual Editor
        </button>
        <button 
          className={`${styles.tab} ${mode === 'style' ? styles.active : ''}`}
          onClick={() => setMode('style')}
        >
          Style Editor
        </button>
        <button 
          className={`${styles.tab} ${mode === 'code' ? styles.active : ''}`}
          onClick={() => setMode('code')}
        >
          Code Editor
        </button>
      </div>
      
      <div className={styles.editorContent}>
        <div className={styles.editorPanel}>
          {mode === 'code' ? (
            <CodeEditor value={spec} onChange={onChange} />
          ) : mode === 'style' ? (
            <StyleEditor spec={JSON.parse(spec)} onChange={handleVisualChange} />
          ) : (
            <VisualEditor spec={JSON.parse(spec)} onChange={handleVisualChange} />
          )}
        </div>
      </div>
    </div>
  )
} 