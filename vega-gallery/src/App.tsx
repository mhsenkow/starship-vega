/**
 * Main App component that handles routing between gallery and editor views.
 * Uses styled-components for styling and maintains selected chart state.
 */

import { useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/common/Layout'
import { GalleryGrid } from './components/Gallery/GalleryGrid'
import { EditorLayout } from './components/Editor/EditorLayout'
import { DataManagement } from './components/DataManagement/DataManagement'
import { theme } from './types/theme'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`

function App() {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppContainer>
          <Layout>
            <Routes>
              <Route path="/" element={
                !selectedChart ? (
                  <GalleryGrid onChartSelect={setSelectedChart} />
                ) : (
                  <EditorLayout 
                    chartId={selectedChart} 
                    onBack={() => setSelectedChart(null)} 
                  />
                )
              } />
              <Route path="/data" element={<DataManagement />} />
            </Routes>
          </Layout>
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
