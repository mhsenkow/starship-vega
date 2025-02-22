import { useState } from 'react'
import styled from 'styled-components'

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; // Take full height of parent
  overflow: hidden; // Prevent double scrollbars
`

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  width: 100%;
  background: #f8f9fa;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f3f5;
  }

  svg {
    transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
    transition: transform 0.3s ease;
  }
`

const TableContainer = styled.div<{ $isOpen: boolean }>`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: ${props => props.$isOpen ? '100%' : '0'};
  transition: max-height 0.3s ease;
  
  /* Make table header sticky */
  thead th {
    position: sticky;
    top: 0;
    background: #f8f9fa;
    z-index: 1;
  }
`

const TableScroller = styled.div`
  flex: 1;
  overflow: auto;
`

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

  /* Optional: fixed first column */
  th:first-child, td:first-child {
    position: sticky;
    left: 0;
    background: inherit;
    z-index: 2;
  }
`

interface ChartFooterProps {
  data: any[];
}

export const ChartFooter = ({ data }: ChartFooterProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!data?.length) return null;

  // Format data for display
  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString(undefined, { 
        maximumFractionDigits: 2 
      });
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  };

  const columns = Object.keys(data[0]);

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
          {data.length} rows
        </span>
      </ToggleButton>
      <TableContainer $isOpen={isOpen}>
        <TableScroller>
          <Table>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={col}>{formatValue(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroller>
      </TableContainer>
    </FooterContainer>
  );
};