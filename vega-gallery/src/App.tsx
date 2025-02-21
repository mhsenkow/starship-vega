import { useState } from 'react'
import styled from 'styled-components'
import { Layout } from './components/common/Layout'
import { GalleryGrid } from './components/Gallery/GalleryGrid'
import { EditorLayout } from './components/Editor/EditorLayout'
import { ThemeProvider } from './providers/ThemeProvider'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`

const App = () => {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)

  return (
    <ThemeProvider>
      <AppContainer>
        <Layout>
          {selectedChart ? (
            <EditorLayout 
              chartId={selectedChart} 
              onBack={() => setSelectedChart(null)} 
            />
          ) : (
            <GalleryGrid onChartSelect={setSelectedChart} />
          )}
        </Layout>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
