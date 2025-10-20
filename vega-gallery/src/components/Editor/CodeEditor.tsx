import Editor from '@monaco-editor/react'
import styles from './CodeEditor.module.css'

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  return (
    <div className={styles.editorContainer}>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        onChange={(value) => onChange(value || '')}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  )
}
