import React, { useState, useEffect, useMemo } from 'react';
import styles from './ChartFooter.module.css';
import { TopLevelSpec } from 'vega-lite';
import { createDataSample, detectDataTypes } from '../../utils/dataUtils';
import { VisibilityIcon, VisibilityOffIcon, TuneIcon, InfoIcon } from '../common/Icons';
import { Button } from '../../design-system/components/ButtonSystem';
import DataColumnToken, { ColumnMetadata } from '../common/DataColumnToken';

// Simple TablePagination replacement
interface PaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  rowsPerPageOptions?: number[];
}

// Styled components migrated to CSS modules

const CustomTablePagination: React.FC<PaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25]
}) => {
  return (
    <div className={styles.paginationContainer}>
      <div>
        Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, count)} of {count} entries
      </div>
      <div className={styles.paginationControls}>
        <span>Rows per page:</span>
        <select
          className={styles.rowsPerPageSelect}
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
        >
          {rowsPerPageOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <Button 
          variant="secondary" 
          size="small"
          onClick={() => onPageChange(null, page - 1)}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button 
          variant="secondary" 
          size="small"
          onClick={() => onPageChange(null, page + 1)}
          disabled={(page + 1) * rowsPerPage >= count}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Additional styled components migrated to CSS modules


// All styled components migrated to CSS modules

interface ChartFooterProps {
  data?: any[] | null;
  spec?: TopLevelSpec | null;
  sampleSize: number;
  onSampleSizeChange: (size: number) => void;
}

export const ChartFooter = ({ data, spec, sampleSize, onSampleSizeChange }: ChartFooterProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState<any[]>([]);
  const [originalDataLength, setOriginalDataLength] = useState(0);
  const [isDataSampled, setIsDataSampled] = useState(false);
  const [showSamplingOptions, setShowSamplingOptions] = useState(false);
  const [columnMetadata, setColumnMetadata] = useState<Record<string, ColumnMetadata>>({});

  // Process data for display
  useEffect(() => {
    // Only log when we have meaningful data to avoid console spam
    if (data || spec) {
      // console.log('ChartFooter data:', data);
      // console.log('ChartFooter spec:', spec);
    }
    
    // Get the data from props or from spec
    let rawData: any[] = [];
    
    if (Array.isArray(data)) {
      // Use data directly if it's an array
      rawData = data;
    } else if (spec?.data) {
      // Safely extract data from spec with type checking
      const specData = spec.data;
      if ('values' in specData && Array.isArray(specData.values)) {
        rawData = specData.values;
      }
    }
    
    // Don't proceed if we have no data
    if (rawData.length === 0 && !data && !spec?.data) {
      return;
    }
    
    setOriginalDataLength(rawData.length);
    
    // Apply sampling if dataset is large
    if (rawData.length > 100) {
      const sampledData = createDataSample(rawData, sampleSize);
      setTableData(sampledData);
      setIsDataSampled(true);
    } else {
      setTableData(rawData);
      setIsDataSampled(false);
    }

    // Calculate column metadata
    if (rawData.length > 0) {
      const dataTypes = detectDataTypes(rawData);
      const metadata: Record<string, ColumnMetadata> = {};
      
      // Extract columns from the first row of data
      Object.keys(rawData[0] || {}).forEach(column => {
        // Get column values for statistics
        const values = rawData
          .map(row => row[column])
          .filter(val => val !== null && val !== undefined);
          
        const uniqueValues = new Set(values).size;
        const missingValues = rawData.length - values.length;
        
        // Calculate basic statistics for numerical columns
        let stats = undefined;
        if (dataTypes[column] === 'quantitative') {
          const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
          if (numericValues.length > 0) {
            const min = Math.min(...numericValues);
            const max = Math.max(...numericValues);
            const sum = numericValues.reduce((a, b) => a + b, 0);
            const mean = sum / numericValues.length;
            
            stats = { min, max, mean };
          }
        }
        
        metadata[column] = {
          name: column,
          type: dataTypes[column] || 'nominal',
          uniqueValues,
          missingValues,
          stats
        };
      });
      
      setColumnMetadata(metadata);
    }
  }, [data, spec, sampleSize]);

  // Get columns from the first row of data
  const columns = useMemo(() => {
    if (!tableData.length) return [];
    return Object.keys(tableData[0] || {});
  }, [tableData]);

  // Get the data for the current page
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return tableData.slice(startIndex, startIndex + rowsPerPage);
  }, [tableData, page, rowsPerPage]);

  const handleChangePage = (
    _event: unknown,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle applying sample size change
  const handleSampleSizeChange = (newSize: number, event?: React.MouseEvent) => {
    // Stop event propagation to prevent interference with parent components
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // console.log(`Setting sample size to ${newSize}`);
    onSampleSizeChange(newSize);
    setShowSamplingOptions(false);
  };

  // Toggle sampling options visibility
  const toggleSamplingOptions = (event?: React.MouseEvent) => {
    // Stop event propagation to prevent interference with parent components
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setShowSamplingOptions(!showSamplingOptions);
  };

  // Handle column token click
  const handleColumnTokenClick = (column: ColumnMetadata) => {
    // Copy column name to clipboard
    navigator.clipboard.writeText(column.name).then(() => {
      // console.log('Column name copied to clipboard:', column.name);
    });
  };

  return (
    <div className={styles.footerContainer}>
      <div className={styles.dataSummary}>
        <div className={styles.summaryText}>
          {originalDataLength > 0 ? (
            <>
              {originalDataLength} total rows{isDataSampled && ` (showing ${tableData.length} samples)`} × {columns.length} columns
              {isDataSampled && (
                <div className={styles.samplingIndicator} title={`Table shows a sample of ${tableData.length} out of ${originalDataLength} rows for performance`}>
                  <InfoIcon size={16} />
                  Sampled Data
                </div>
              )}
            </>
          ) : (
            'No data available'
          )}
        </div>
        <div className={styles.buttonContainer}>
          {originalDataLength > 100 && (
            <button 
              className={styles.viewDataButton}
              onClick={(event) => toggleSamplingOptions(event)} 
              title="Adjust sampling options"
            >
              <span className={styles.iconWrapper}>
                <TuneIcon size={16} />
              </span>
              Sampling
            </button>
          )}
          <button className={styles.viewDataButton} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <>
                <span className={styles.iconWrapper}>
                  <VisibilityOffIcon size={16} />
                </span>
                Hide Data
              </>
            ) : (
              <>
                <span className={styles.iconWrapper}>
                  <VisibilityIcon size={16} />
                </span>
                View Data
              </>
            )}
          </button>
        </div>
      </div>

      {showSamplingOptions && originalDataLength > 100 && (
        <div className={styles.samplingContainer}>
          <span>Sample size:</span>
          {[100, 250, 500, 1000, 2000, 5000].map(size => (
            <span
              key={size}
              className={`${styles.sampleOption} ${sampleSize === size ? styles.active : ''}`}
              onClick={(event) => handleSampleSizeChange(size, event)}
              role="button"
              tabIndex={0}
            >
              {size} rows
            </span>
          ))}
          <span
            className={`${styles.sampleOption} ${sampleSize === originalDataLength ? styles.active : ''}`}
            onClick={(event) => handleSampleSizeChange(originalDataLength, event)}
            role="button"
            tabIndex={0}
          >
            All ({originalDataLength})
          </span>
        </div>
      )}

      <div className={`${styles.tableContainer} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map(column => (
                  <th key={column} className={styles.tableHeader}>
                    {columnMetadata[column] ? (
                      <DataColumnToken 
                        column={columnMetadata[column]} 
                        showStats={true}
                        onClick={handleColumnTokenClick}
                      />
                    ) : (
                      column
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr key={i}>
                  {columns.map(column => (
                    <td key={column}>{String(row[column])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CustomTablePagination
          count={tableData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </div>
    </div>
  );
}; 