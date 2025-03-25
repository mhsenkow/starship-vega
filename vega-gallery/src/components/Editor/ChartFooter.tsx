import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { TablePagination } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

const DataSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const SummaryText = styled.div`
  font-size: 0.9rem;
  color: #495057;
`;

const ViewDataButton = styled.button`
  padding: 6px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #f1f3f5; }
`;

const DataTable = styled.table`
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

const ColumnStats = styled.div`
  padding: 12px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
`;

const ColumnStat = styled.div`
  margin-bottom: 12px;
`;

const ColumnName = styled.div`
  font-weight: 500;
  color: #495057;
`;

const StatsList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const StatItem = styled.li`
  margin-bottom: 4px;
`;

const ColumnType = styled.span`
  font-weight: 500;
  color: #495057;
`;

const DataTableContainer = styled.div`
  max-width: 100%;
  overflow-x: auto;
  margin: 16px 0;
`;

const SampleOption = styled.div<{ $active: boolean }>`
  padding: 6px 12px;
  background: ${props => props.$active ? props.theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : props.theme.text.primary};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SamplingContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const ColumnInput = styled.input`
  width: 80px;
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ColumnControls = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const ColumnToggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : '#ddd'};
  border-radius: 4px;
  background: ${props => props.$active ? `${props.theme.colors.primary}10` : 'white'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.text.primary};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? `${props.theme.colors.primary}20` : '#f8f9fa'};
  }

  svg {
    font-size: 16px;
  }
`;

interface ChartFooterProps {
  data: any;
  spec: any;
  sampleSize: number;
  onSampleSizeChange: (size: number) => void;
}

export const ChartFooter = ({ data, spec, sampleSize, onSampleSizeChange }: ChartFooterProps) => {
  // Add debug log to see what we're getting
  console.log('ChartFooter data:', data);
  console.log('ChartFooter spec:', spec);

  const [showDataTable, setShowDataTable] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Add state for visible columns
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());

  // Get columns and sample data
  const { columns, sampledData } = useMemo(() => {
    // Handle both data formats
    const values = Array.isArray(data) ? data : spec?.data?.values || [];
    if (!values.length) {
      return { columns: [], sampledData: [] };
    }

    const cols = Object.keys(values[0]).filter(key => !key.startsWith('Symbol'));
    const totalRows = values.length;
    const sampleCount = Math.max(1, Math.floor(totalRows * (sampleSize / 100)));
    const sampled = values.slice(0, sampleCount);

    // Initialize visible columns if empty
    if (visibleColumns.size === 0) {
      setVisibleColumns(new Set(cols));
    }

    return { columns: cols, sampledData: sampled };
  }, [data, spec, sampleSize]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(column)) {
        next.delete(column);
      } else {
        next.add(column);
      }
      return next;
    });
  };

  const toggleAllColumns = () => {
    if (visibleColumns.size === columns.length) {
      setVisibleColumns(new Set());
    } else {
      setVisibleColumns(new Set(columns));
    }
  };

  return (
    <FooterContainer>
      <DataSummary>
        <SummaryText>
          {(Array.isArray(data) ? data.length : spec?.data?.values?.length || 0).toLocaleString()} total rows 
          (showing {sampledData.length} samples) × {columns.length} columns
        </SummaryText>
        <ViewDataButton onClick={() => setShowDataTable(!showDataTable)}>
          {showDataTable ? 'Hide Data' : 'View Data'}
        </ViewDataButton>
      </DataSummary>

      {showDataTable && (
        <>
          <SamplingContainer>
            {[1, 10, 25, 50, 75, 100].map(size => (
              <SampleOption
                key={size}
                $active={sampleSize === size}
                onClick={() => onSampleSizeChange(size)}
                role="button"
                tabIndex={0}
              >
                {size}%
              </SampleOption>
            ))}
          </SamplingContainer>

          <ColumnControls>
            <ColumnToggle 
              $active={visibleColumns.size === columns.length}
              onClick={toggleAllColumns}
            >
              {visibleColumns.size === columns.length ? (
                <VisibilityOffIcon />
              ) : (
                <VisibilityIcon />
              )}
              All Columns
            </ColumnToggle>
            {columns.map(col => (
              <ColumnToggle
                key={col}
                $active={visibleColumns.has(col)}
                onClick={() => toggleColumn(col)}
              >
                {visibleColumns.has(col) ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
                {col}
              </ColumnToggle>
            ))}
          </ColumnControls>

          <DataTableContainer>
            <DataTable>
              <thead>
                <tr>
                  {columns.filter(col => visibleColumns.has(col)).map(col => (
                    <th key={col}>
                      {col}
                      <ColumnType>
                        {typeof sampledData[0]?.[col]}
                      </ColumnType>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampledData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: Record<string, any>, i: number) => (
                    <tr key={i}>
                      {columns
                        .filter(col => visibleColumns.has(col))
                        .map(col => (
                          <td key={col}>{String(row[col] ?? '')}</td>
                        ))}
                    </tr>
                  ))}
              </tbody>
            </DataTable>
            <TablePagination
              component="div"
              count={sampledData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </DataTableContainer>
        </>
      )}
    </FooterContainer>
  );
}; 