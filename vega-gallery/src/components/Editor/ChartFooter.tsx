import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  width: 100%;
  background: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    background: #f1f3f5;
    border-color: #ddd;
  }

  svg {
    transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
    transition: transform 0.3s ease;
  }
`;

const TableContainer = styled.div<{ $isOpen: boolean }>`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: ${props => props.$isOpen ? '600px' : '0'};
  transition: max-height 0.3s ease;
  margin-top: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const TableScroller = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 200px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 6px 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    background: #f8f9fa;
    z-index: 1;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f8f9fa;
  border-top: 1px solid #eee;

  select {
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background: #f1f3f5;
      }
    }
  }
`;

const TableControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;

  input {
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const EncodingSection = styled.div`
  padding: 16px;
  border-top: 1px solid #eee;
  background: #f8f9fa;

  h3 {
    margin: 0 0 16px 0;
    font-size: 1.1rem;
    color: #2c3e50;
  }
`;

const EncodingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const EncodingControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EncodingLabel = styled.div`
  font-weight: 500;
  color: #495057;
`;

const EncodingButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #495057;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
    border-color: ${props => props.theme.colors.primary};
  }

  &.recommend {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

interface ChartFooterProps {
  data: any;
}

export const ChartFooter = ({ data }: { data: any }) => {
  // 1. All useState hooks
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // 2. Extract data and columns with useMemo
  const { validData, columns } = useMemo(() => {
    if (!data) return { validData: [], columns: [] };

    console.log('Processing data:', data);

    // Handle array structure
    if (Array.isArray(data)) {
      // Find the data object in the array (usually at index 3)
      const dataObj = data.find(item => item && typeof item === 'object' && 'values' in item);
      if (dataObj) {
        return {
          validData: dataObj.values || [],
          columns: dataObj.columns || []
        };
      }
    }

    // Handle object structure
    if (data.data?.values && data.data?.columns) {
      return {
        validData: data.data.values,
        columns: data.data.columns
      };
    }

    // Handle direct values and columns
    if (data.values && data.columns) {
      return {
        validData: data.values,
        columns: data.columns
      };
    }

    console.error('Invalid data structure:', data);
    return { validData: [], columns: [] };
  }, [data]);

  // 3. Filter data with useMemo
  const filteredData = useMemo(() => {
    if (!validData.length) return [];
    
    return validData.filter((row: any) => {
      if (!row) return false;
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [validData, searchTerm]);

  // 4. Sort data with useMemo
  const sortedData = useMemo(() => {
    if (!sortConfig || !filteredData.length) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      if (!a || !b) return 0;
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }, [filteredData, sortConfig]);

  // 5. Calculate pagination values
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  // Early return if no data
  if (validData.length === 0 || columns.length === 0) {
    return <div>No data available</div>;
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <FooterContainer>
      <ToggleButton 
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path 
            d="M2 4L6 8L10 4" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
        {isOpen ? 'Hide Data' : 'Show Data'}
        <span style={{ color: '#868e96', marginLeft: 'auto' }}>
          {validData.length} rows
        </span>
      </ToggleButton>

      <TableContainer $isOpen={isOpen}>
        <TableControls>
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </TableControls>

        <TableScroller>
          <Table>
            <thead>
              <tr>
                {columns.map(col => (
                  <th 
                    key={col}
                    onClick={() => setSortConfig({
                      key: col,
                      direction: sortConfig?.key === col && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                    })}
                  >
                    {col}
                    {sortConfig?.key === col && (
                      <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map(col => (
                    <td key={col}>{formatValue(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroller>

        <PaginationControls>
          <select 
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>

          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
              {' '}({sortedData.length} total rows)
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </PaginationControls>
      </TableContainer>
    </FooterContainer>
  );
}; 