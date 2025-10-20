/**
 * Main App component that handles routing between gallery and editor views.
 * Uses CSS modules for styling and maintains selected chart state.
 */

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/common/Layout'
import { GalleryGrid } from './components/Gallery/GalleryGrid'
import { EditorLayout } from './components/Editor/EditorLayout'
import { DataManagement } from './components/DataManagement/DataManagement'
import { initDB } from './utils/indexedDB'
import { seedDatabaseWithSampleData } from './utils/seedData'
import { DatabaseErrorModal } from './components/DataManagement/DatabaseErrorModal'
import ErrorBoundary from './components/common/ErrorBoundary'
import { DashboardContainer } from './components/Dashboard/DashboardContainer'
import { ThemeProvider } from './styles/ThemeProvider.module'
import { ThemePanel } from './components/common/ThemePanel.module'
import { AppHeader } from './components/common/AppHeader.module'
import DropdownTest from './components/DropdownTest'
import styles from './App.module.css'

function App() {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false)
  const [isEditorPanelVisible, setIsEditorPanelVisible] = useState(true)
  
  const [dbError, setDbError] = useState<Error | null>(null)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isDbSeeded, setIsDbSeeded] = useState(false)

  useEffect(() => {
    // Initialize database and seed with sample data
    const initializeApp = async () => {
      try {
        // First initialize the database
        await initDB();
        
        // Then seed with sample data if needed
        const seeded = await seedDatabaseWithSampleData();
        setIsDbSeeded(seeded);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError(error instanceof Error ? error : new Error('Unknown database error'));
        setIsErrorModalOpen(true);
      }
    };
    
    initializeApp();
  }, []);

  const handleDatabaseReset = () => {
    // Reload the application after database reset
    window.location.reload();
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <div className={styles.appContainer}>
            <AppHeader 
              onThemeToggle={() => setIsThemePanelOpen(!isThemePanelOpen)}
              isEditor={!!selectedChart}
              onBackToGallery={() => setSelectedChart(null)}
              isEditorPanelVisible={isEditorPanelVisible}
            />
            {selectedChart ? (
              <EditorLayout 
                chartId={selectedChart} 
                onBack={() => setSelectedChart(null)}
                onPanelVisibilityChange={setIsEditorPanelVisible}
              />
            ) : (
              <Layout>
                <Routes>
                  <Route path="/" element={<GalleryGrid onChartSelect={setSelectedChart} />} />
                  <Route path="/data" element={<DataManagement isDbSeeded={isDbSeeded} />} />
                  <Route path="/dashboard" element={<DashboardContainer />} />
                  <Route path="/dropdown-test" element={<DropdownTest />} />
                </Routes>
              </Layout>
            )}
            
            {isErrorModalOpen && (
              <DatabaseErrorModal 
                isOpen={isErrorModalOpen}
                error={dbError}
                onClose={() => setIsErrorModalOpen(false)}
                onReset={handleDatabaseReset}
              />
            )}
            
            <ThemePanel 
              open={isThemePanelOpen}
              onClose={() => setIsThemePanelOpen(false)}
            />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
