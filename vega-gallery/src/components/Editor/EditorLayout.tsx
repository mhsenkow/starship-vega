import styled from 'styled-components'
import { CodeEditor } from './CodeEditor'
import { Preview } from './Preview'
import { chartSpecs } from '../../charts/specs'
import { useState, useRef, useEffect } from 'react'
import { TemplateEditor } from './TemplateEditor'
import { theme } from '../../types/theme'
import { ErrorBoundary } from '../ErrorBoundary'
import { VisualEditor } from './VisualEditor'
import { StyleEditor } from './StyleEditor'
import { ChartPreview } from './ChartPreview'
import { ResizableContainer } from './ResizableContainer'
import { TopLevelSpec } from 'vega-lite'
import { MarkType } from '../../types/vega'
import { sampleDatasets } from '../../utils/sampleData'
import { DatasetSelector } from './DatasetSelector'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
`

const TabContainer = styled.div`
  display: flex;
  gap: 2px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  border-radius: 6px;
  color: ${props => props.$active ? '#0f172a' : '#64748b'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.$active ? 'white' : '#f1f5f9'};
  }
`

const EditorContent = styled.div`
  flex: 1;
  overflow: hidden;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const SuggestedCharts = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 16px;
`;

const ChartButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.$active ? props.theme.colors.primary + '10' : 'white'};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 14px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const defaultSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: { values: [] },
  mark: 'bar',
  encoding: {}
};

/**
 * Main chart editor layout component
 * - Manages editor state and mode switching
 * - Coordinates between visual/code/style editors
 * - Handles chart preview updates
 * Dependencies: VisualEditor, StyleEditor, CodeEditor, ChartPreview
 */

interface EditorLayoutProps {
  chartId: string;
  onBack: () => void;
}

type EditorTab = 'data' | 'encoding' | 'style' | 'code';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  padding: 24px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const TabContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

// Update DatasetSelector container
const SelectorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e9ecef;
  border-radius: 8px;
`;

const DatasetGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const RecommendationsSection = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.neutral[50]};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const RecommendationTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.neutral[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const RecommendationGrid = styled.div`
  display: flex;
  gap: 8px;
`;

const RecommendationCard = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary[200] : props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.$active ? props.theme.colors.primary[50] : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary[200]};
    background: ${props => props.$active ? props.theme.colors.primary[100] : props.theme.colors.neutral[50]};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.$active ? props.theme.colors.primary[600] : props.theme.colors.neutral[600]};
  }

  .description {
    font-size: 12px;
    color: ${props => props.theme.colors.neutral[600]};
    text-align: left;
  }
`;

export const EditorLayout = ({ chartId, onBack }: EditorLayoutProps) => {
  const [currentTab, setCurrentTab] = useState<EditorTab>('data');
  const [currentType, setCurrentType] = useState(chartId);
  
  // Safely initialize dataset
  const [currentDataset, setCurrentDataset] = useState(() => {
    const firstDataset = Object.entries(sampleDatasets)
      .find(([_, dataset]) => dataset.values?.length > 0);
    return firstDataset ? firstDataset[0] : '';
  });

  // Initialize spec with safe defaults
  const [currentSpec, setCurrentSpec] = useState(() => {
    const baseSpec = chartSpecs[chartId] || defaultSpec;
    const dataset = sampleDatasets[currentDataset];
    return {
      ...baseSpec,
      data: { 
        values: dataset?.values || []
      },
      width: 'container',
      height: 'container',
      autosize: { type: 'fit', contains: 'padding' }
    };
  });

  useEffect(() => {
    console.log('Current spec updated:', currentSpec);
  }, [currentSpec]);

  const handleDatasetChange = (datasetId: string) => {
    console.log('Dataset change triggered:', datasetId);
    console.log('Available datasets:', Object.keys(sampleDatasets));
    
    const dataset = sampleDatasets[datasetId];
    if (!dataset) {
      console.warn('Dataset not found:', datasetId);
      console.log('Available datasets:', Object.keys(sampleDatasets));
      return;
    }

    setCurrentDataset(datasetId);
    
    // Create new spec with updated data
    const newSpec: TopLevelSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      ...currentSpec,
      data: { 
        values: dataset.values 
      },
      mark: {
        ...currentSpec.mark,
        type: typeof currentSpec.mark === 'string' ? currentSpec.mark : currentSpec.mark.type,
        cursor: 'pointer'
      },
      config: {
        ...currentSpec.config,
        mark: {
          ...currentSpec.config?.mark,
          cursor: 'pointer'
        }
      },
      encoding: getCompatibleEncodings(
        typeof currentSpec.mark === 'string' ? currentSpec.mark : currentSpec.mark.type,
        currentSpec.encoding || {},
        dataset.values[0] || {}
      ),
      width: 'container',
      height: 'container',
      autosize: { type: 'fit', contains: 'padding' }
    };

    console.log('New spec:', newSpec);
    setCurrentSpec(newSpec);
  };

  // Add this helper function in the same file
  const getCompatibleEncodings = (
    markType: string,
    currentEncodings: any,
    newDataFields: any
  ): Record<string, any> => {
    if (!currentEncodings || !newDataFields) return {};

    const dataFields = Object.keys(newDataFields);
    const compatibleEncodings: Record<string, any> = {};

    // Try to preserve existing encodings if fields exist in new dataset
    Object.entries(currentEncodings).forEach(([channel, encoding]: [string, any]) => {
      if (encoding?.field && dataFields.includes(encoding.field)) {
        compatibleEncodings[channel] = encoding;
      }
    });

    // If no compatible encodings found, suggest new ones based on data types
    if (Object.keys(compatibleEncodings).length === 0) {
      const quantitativeFields = dataFields.filter(field => 
        typeof newDataFields[field] === 'number'
      );
      const categoricalFields = dataFields.filter(field => 
        typeof newDataFields[field] === 'string'
      );
      const temporalFields = dataFields.filter(field => 
        !isNaN(Date.parse(newDataFields[field]))
      );

      // Suggest basic encodings based on chart type and available fields
      switch (markType) {
        case 'bar':
          if (categoricalFields.length && quantitativeFields.length) {
            compatibleEncodings.x = { field: categoricalFields[0], type: 'nominal' };
            compatibleEncodings.y = { field: quantitativeFields[0], type: 'quantitative' };
          }
          break;
        case 'line':
          if (temporalFields.length && quantitativeFields.length) {
            compatibleEncodings.x = { field: temporalFields[0], type: 'temporal' };
            compatibleEncodings.y = { field: quantitativeFields[0], type: 'quantitative' };
          }
          break;
        case 'point':
          if (quantitativeFields.length >= 2) {
            compatibleEncodings.x = { field: quantitativeFields[0], type: 'quantitative' };
            compatibleEncodings.y = { field: quantitativeFields[1], type: 'quantitative' };
          }
          break;
        // Add more cases as needed
      }
    }

    return compatibleEncodings;
  };

  const handleChartTypeChange = (newType: string) => {
    setCurrentType(newType);
    
    // Get the base spec for the new chart type
    const baseSpec = chartSpecs[newType] || defaultSpec;
    
    // Create new spec while preserving data and compatible encodings
    const newSpec = {
      ...baseSpec,
      data: currentSpec.data, // Keep current data
      width: 'container',
      height: 'container',
      autosize: { type: 'fit', contains: 'padding' },
      // Try to preserve compatible encodings
      encoding: getCompatibleEncodings(
        baseSpec.mark as string,
        currentSpec.encoding,
        { values: currentSpec.data.values }
      )
    };

    setCurrentSpec(newSpec);
  };

  const handleCodeChange = (value: string) => {
    try {
      setCurrentSpec(JSON.parse(value));
    } catch (e) {
      // Handle JSON parse error
    }
  };

  return (
    <EditorContainer>
      <Header>
        <BackButton onClick={onBack}>
          <span>←</span> Back to Gallery
        </BackButton>
      </Header>
      
      <MainContent>
        <LeftPanel>
          <TabContainer>
            <Tab 
              $active={currentTab === 'data'} 
              onClick={() => setCurrentTab('data')}
            >
              Data
            </Tab>
            <Tab 
              $active={currentTab === 'encoding'} 
              onClick={() => setCurrentTab('encoding')}
            >
              Encoding
            </Tab>
            <Tab 
              $active={currentTab === 'style'} 
              onClick={() => setCurrentTab('style')}
            >
              Style
            </Tab>
            <Tab 
              $active={currentTab === 'code'} 
              onClick={() => setCurrentTab('code')}
            >
              Code
            </Tab>
          </TabContainer>
          
          <TabContent>
            {currentTab === 'data' && (
              <DatasetSelector 
                chartId={chartId}
                currentDataset={currentDataset}
                onSelect={handleDatasetChange}
                mode="editor"
              />
            )}
            {currentTab === 'encoding' && (
              <VisualEditor 
                spec={currentSpec} 
                onChange={setCurrentSpec} 
              />
            )}
            {currentTab === 'style' && (
              <StyleEditor 
                spec={currentSpec} 
                onChange={setCurrentSpec} 
              />
            )}
            {currentTab === 'code' && (
              <CodeEditor 
                value={JSON.stringify(currentSpec, null, 2)}
                onChange={handleCodeChange}
              />
            )}
          </TabContent>
        </LeftPanel>

        <RightPanel>
          <ErrorBoundary>
            <ChartPreview 
              spec={currentSpec}
              mode="editor"
            />
          </ErrorBoundary>
        </RightPanel>
      </MainContent>
    </EditorContainer>
  );
};
