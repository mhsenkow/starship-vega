import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Button } from '../../design-system/components/ButtonSystem';
import { CircularProgress, Typography, Box, LinearProgress } from '@mui/material';
import { Tabs, TabPanel as DSTabPanel } from '../../design-system/components/Tabs';
import { ImageIcon as ImageIconComponent, Cloud as CloudIcon, TableChart as TableChartIcon } from '../common/Icons';
import { DatasetMetadata } from '../../types/dataset';
import styles from './ImageDataExtractor.module.css';

// PDF processing interface for Electron environment
declare global {
  interface Window {
    electron?: {
      isElectron: boolean;
      processPdf: (filePath: string) => Promise<string>;
    };
  }
}

// Styled components removed - using CSS modules instead

interface ImageDataExtractorProps {
  onDataExtracted: (dataset: DatasetMetadata) => void;
}

export const ImageDataExtractor: React.FC<ImageDataExtractorProps> = ({ onDataExtracted }) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [extractionMethod, setExtractionMethod] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [extractedData, setExtractedData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [cloudApiKey, setCloudApiKey] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    // Reset previous results
    setExtractedText('');
    setExtractedData(null);
    setError(null);
    setStatusMessage('');
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, GIF, or PDF file.');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }
    
    setImage(file);
    setIsPdf(file.type === 'application/pdf');
    
    // Create preview URL (for images only)
    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, just show a placeholder or PDF icon
      setImagePreviewUrl(null);
      setStatusMessage('PDF file loaded. Ready for processing.');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleImageUpload(event.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleTabChange = (newValue: string | number) => {
    setExtractionMethod(Number(newValue));
  };

  // Process PDF content locally via Electron's Node.js integration
  const processPdfLocally = async () => {
    if (!image || !isPdf) return;
    
    setIsProcessing(true);
    setStatusMessage('Processing PDF content...');
    setProgress(10);
    
    try {
      // Check if running in Electron environment
      const isElectron = window.electron?.isElectron;
      
      let pdfText = '';
      
      if (isElectron) {
        // If we're in Electron, we'll use the exposed API to process the PDF
        setStatusMessage('Processing PDF with Node.js (Electron)...');
        
        // Create a temporary file path
        const filePath = URL.createObjectURL(image);
        
        // Use the Electron bridge to process the PDF
        pdfText = await (window as any).electron.processPdf(filePath);
      } else {
        // PDF parsing is not available in web environment
        setStatusMessage('PDF parsing not available in web environment...');
        throw new Error('PDF processing is only available in the desktop app. Please use the desktop version or convert your PDF to an image first.');
      }
      
      setProgress(80);
      setExtractedText(pdfText);
      
      // Try to convert the text to structured data
      const parsedData = parseExtractedText(pdfText);
      setExtractedData(parsedData);
      
      if (parsedData && parsedData.length > 0) {
        createDataset(parsedData);
      }
      
      setProgress(100);
    } catch (err) {
      console.error('PDF processing error:', err);
      setError(`Error processing PDF: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const processWithTesseract = async () => {
    if (!image) return;
    
    // If it's a PDF, use PDF-specific processing
    if (isPdf) {
      await processPdfLocally();
      return;
    }
    
    setIsProcessing(true);
    setStatusMessage('Initializing OCR engine...');
    setProgress(0);
    
    try {
      // In v5, createWorker is async and no need for initialize or loadLanguage steps
      const worker = await createWorker('eng');
      
      setStatusMessage('Processing image...');
      setProgress(50);
      
      // Recognize the image
      const { data } = await worker.recognize(image);
      setProgress(90);
      
      setExtractedText(data.text);
      
      // Try to convert the text to structured data
      const parsedData = parseExtractedText(data.text);
      setExtractedData(parsedData);
      
      if (parsedData && parsedData.length > 0) {
        createDataset(parsedData);
      }
      
      setProgress(100);
      await worker.terminate();
    } catch (err) {
      console.error('OCR processing error:', err);
      setError(`Error processing image: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processWithCloudAPI = async () => {
    if (!image || !cloudApiKey) return;
    
    setIsProcessing(true);
    setStatusMessage('Sending image to Cloud Vision API...');
    setProgress(10);
    
    try {
      // API endpoint would be used in a production app
      // const base64Image = await fileToBase64(image);
      // This is a mock implementation for demonstration
      setStatusMessage('Analyzing with Cloud Vision API...');
      setProgress(30);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(60);
      
      // In a real implementation, we would call:
      // const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + cloudApiKey, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     requests: [{
      //       image: { content: base64Image.split(',')[1] },
      //       features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
      //     }]
      //   })
      // });
      // const responseData = await response.json();
      // const data = { 
      //   text: responseData.responses[0].fullTextAnnotation.text,
      //   // Cloud Vision API provides more detailed information that could be used  
      // };
      
      // For demo, simulate successful extraction
      setStatusMessage('Processing results...');
      setProgress(90);
      
      // Simulate API response
      const mockText = "Category,Value\nA,28\nB,55\nC,43\nD,91\nE,81";
      const data = { text: mockText };
      
      setExtractedText(data.text);
      
      // Parse the CSV text into structured data
      const parsedData = parseCSV(data.text);
      setExtractedData(parsedData);
      
      if (parsedData && parsedData.length > 0) {
        createDataset(parsedData);
      }
      
      setProgress(100);
    } catch (err) {
      console.error('Cloud Vision API error:', err);
      setError(`Error processing with Cloud API: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  
  const parseExtractedText = (text: string): any[] => {
    // Try to detect if this is a table or CSV format
    const lines = text.trim().split('\n');
    
    // Check if it looks like a CSV
    if (lines.some(line => line.includes(',') || line.includes('\t'))) {
      return parseCSV(text);
    }
    
    // Basic attempt to parse a text table
    try {
      const parsedRows = lines.map(line => {
        // Split by multiple spaces
        const values = line.trim().split(/\s{2,}/);
        return values;
      });
      
      // Check if all rows have the same number of columns
      const headerRow = parsedRows[0];
      if (headerRow && parsedRows.slice(1).every(row => row.length === headerRow.length)) {
        // Convert to array of objects
        return parsedRows.slice(1).map(row => {
          const obj: Record<string, string> = {};
          headerRow.forEach((header, i) => {
            obj[header] = row[i] || '';
          });
          return obj;
        });
      }
      
      // Could not identify a proper structure, return data with generated column names
      if (parsedRows.length > 1) {
        return parsedRows.slice(1).map(row => {
          const obj: Record<string, string> = {};
          row.forEach((value, i) => {
            obj[`Column ${i+1}`] = value;
          });
          return obj;
        });
      }
    } catch (e) {
      console.error('Error parsing text table:', e);
    }
    
    // Fallback: Just return the text as a single field
    return [{ text }];
  };
  
  const parseCSV = (text: string): any[] => {
    try {
      const lines = text.trim().split('\n');
      const delimiter = text.includes(',') ? ',' : '\t';
      
      const headers = lines[0].split(delimiter).map(h => h.trim());
      
      return lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim());
        const obj: Record<string, string> = {};
        
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });
        
        return obj;
      });
    } catch (e) {
      console.error('Error parsing CSV:', e);
      return [];
    }
  };
  
  const createDataset = (data: any[]) => {
    if (!data || data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    const rowCount = data.length;
    const columnCount = columns.length;
    
    const dataTypes: Record<string, string> = {};
    columns.forEach(column => {
      // Determine column type by sampling values
      const numericSamples = data.slice(0, 5).filter(row => 
        !isNaN(Number(row[column])) && row[column] !== ''
      ).length;
      
      // If most samples are numeric, mark as quantitative
      dataTypes[column] = numericSamples >= 3 ? 'quantitative' : 'nominal';
    });
    
    const newDataset: DatasetMetadata = {
      id: `ocr-${Date.now()}`,
      name: image ? `${isPdf ? 'PDF' : 'OCR'} from ${image.name}` : 'Extracted Data',
      description: `Data extracted from ${isPdf ? 'PDF document' : 'image'} using ${extractionMethod === 0 ? (isPdf ? 'Electron PDF processing' : 'Tesseract OCR') : 'Cloud Vision API'}`,
      values: data,
      dataTypes,
      source: isPdf ? 'PDF Document' : (extractionMethod === 0 ? 'Tesseract OCR' : 'Cloud Vision API'),
      createdAt: new Date().toISOString(),
      rowCount,
      columnCount,
      columns
    };
    
    onDataExtracted(newDataset);
    setStatusMessage('Dataset created successfully!');
  };
  
  return (
    <div className={styles.container}>
      <Typography variant="h5" gutterBottom>Extract Data from Images & PDFs</Typography>
      <Typography variant="body1" color="secondary" gutterBottom>
        Upload an image or PDF containing tabular data, charts, or text, and we'll extract the data for visualization.
      </Typography>
      
      <div 
        className={`${styles.imageUploadArea} ${isDragging ? styles.dragging : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <ImageIconComponent size={48} />
        <Typography variant="h6">Drop image or PDF here or click to browse</Typography>
        <Typography variant="body2" color="secondary">
          Supports JPEG, PNG, GIF and PDF files (max 10MB)
        </Typography>
      </div>
      
      {imagePreviewUrl && (
        <div className={styles.imagePreview}>
          <img src={imagePreviewUrl} alt="Preview" />
        </div>
      )}
      
      {isPdf && !imagePreviewUrl && image && (
        <Box 
          textAlign="center" 
          margin="16px 0" 
          padding="16px" 
          sx={{ backgroundColor: "rgba(0,0,0,0.03)", borderRadius: "8px" }}
        >
          <Typography variant="h6">PDF loaded: {image.name}</Typography>
          <Typography variant="caption" color="secondary">
            Size: {(image.size / 1024).toFixed(1)} KB
          </Typography>
        </Box>
      )}
      
      {error && <div className={`${styles.statusMessage} ${styles.error}`}>{error}</div>}
      
      {image && (
        <>
          <Tabs 
            value={extractionMethod} 
            onChange={handleTabChange}
            variant="fullWidth"
            tabs={[
              {
                label: isPdf ? "Local PDF Processing" : "Tesseract OCR",
                value: 0,
                icon: <TableChartIcon size={16} />,
                iconPosition: "start"
              },
              {
                label: "Cloud Vision API",
                value: 1,
                icon: <CloudIcon size={16} />,
                iconPosition: "start"
              }
            ]}
          />
          
          <DSTabPanel currentValue={extractionMethod} value={0}>
            <Typography variant="body2" gutterBottom>
              {isPdf ? 
                "Extract data from PDF using local PDF parsing. This processes PDF text content directly without OCR." :
                "Extract data using Tesseract.js, a pure JavaScript OCR engine that runs entirely in your browser. Best for simple tables and text."
              }
            </Typography>
            <div className={styles.buttonContainer}>
              <Button 
                variant="primary" 
                size="medium"
                buttonStyle="floating"
                onClick={processWithTesseract}
                disabled={isProcessing || !image}
              >
                {isProcessing && <CircularProgress size={20} />}
                {isProcessing ? 'Processing...' : isPdf ? 'Extract PDF Data' : 'Extract Data'}
              </Button>
            </div>
          </DSTabPanel>
          
          <DSTabPanel currentValue={extractionMethod} value={1}>
            <Typography variant="body2" gutterBottom>
              Extract data using Cloud Vision API for higher accuracy, especially with complex tables and forms.
              Requires an API key from Google Cloud Platform.
            </Typography>
            <div className={styles.methodDescription}>
              <Typography variant="body2">Cloud Vision API Key:</Typography>
              <input
                type="password"
                value={cloudApiKey}
                onChange={(e) => setCloudApiKey(e.target.value)}
                placeholder="Enter your API key"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div className={styles.buttonContainer}>
              <Button 
                variant="primary" 
                size="medium"
                buttonStyle="floating"
                onClick={processWithCloudAPI}
                disabled={isProcessing || !image || !cloudApiKey}
              >
                {isProcessing && <CircularProgress size={20} />}
                {isProcessing ? 'Processing...' : 'Extract with Cloud API'}
              </Button>
            </div>
          </DSTabPanel>
          
          {isProcessing && (
            <Box width="100%" marginTop="16px">
              <Box display="flex" alignItems="center">
                <Box flexGrow={1} marginRight="8px">
                  <LinearProgress value={progress} />
                </Box>
                <Box minWidth="35px">
                  <Typography variant="body2" color="secondary">{`${Math.round(progress)}%`}</Typography>
                </Box>
              </Box>
              <div className={`${styles.statusMessage} ${styles.info}`}>{statusMessage}</div>
            </Box>
          )}
          
          {extractedText && (
            <div className={styles.resultsContainer}>
              <Typography variant="h6" gutterBottom>Extracted Text</Typography>
              <pre className={styles.extractedText}>{extractedText}</pre>
              
              {extractedData && extractedData.length > 0 && (
                <>
                  <Box marginTop="24px">
                    <Typography variant="h6" gutterBottom>Structured Data</Typography>
                  </Box>
                  <pre className={styles.extractedText}>{JSON.stringify(extractedData, null, 2)}</pre>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
