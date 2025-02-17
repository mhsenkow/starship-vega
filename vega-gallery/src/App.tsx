import { useState } from 'react'
import styled from 'styled-components'
import { Layout } from './components/common/Layout'
import { GalleryGrid } from './components/Gallery/GalleryGrid'
import { EditorLayout } from './components/Editor/EditorLayout'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`

function App() {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)

  return (
    <AppContainer>
      <Layout>
        {!selectedChart ? (
          <GalleryGrid onChartSelect={setSelectedChart} />
        ) : (
          <EditorLayout 
            chartId={selectedChart} 
            onBack={() => setSelectedChart(null)} 
          />
        )}
      </Layout>
    </AppContainer>
  )
}

export default App
