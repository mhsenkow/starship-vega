import Editor from '@monaco-editor/react'
import styled from 'styled-components'

const EditorContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  height: 600px;
`

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  return (
    <EditorContainer>
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
    </EditorContainer>
  )
}
