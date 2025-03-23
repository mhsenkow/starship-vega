import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { TablePagination } from '@mui/material';

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
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const SummaryText = styled.div`
  font-size: 0.9rem;
  color: #495057;
`;

const ViewDataButton = styled.button`
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

interface ChartFooterProps {
  data: any;
  spec: any;
}

export const ChartFooter = ({ data, spec }: ChartFooterProps) => {
  const [showDataTable, setShowDataTable] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Process only a sample of the data for statistics
  const stats = useMemo(() => {
    console.log("Processing data:", data);
    
    if (!Array.isArray(data) || data.length === 0) {
      return {
        rowCount: 0,
        columnCount: 0,
        columns: []
      };
    }

    try {
      // Get column names from the first row
      const columns = Object.keys(data[0]);
      
      // Take a sample of the data for statistics (max 1000 rows)
      const sampleSize = Math.min(1000, data.length);
      const sampleStep = Math.max(1, Math.floor(data.length / sampleSize));
      const sampledData = data.filter((_, index) => index % sampleStep === 0);

      // Calculate statistics for each column
      const columnStats = columns.map(column => {
        const values = sampledData
          .map(row => row[column])
          .filter(val => val != null);
        
        // Determine column type
        let type = 'nominal';
        if (values.every(v => typeof v === 'number')) {
          type = 'quantitative';
        } else if (values.every(v => !isNaN(Date.parse(String(v))))) {
          type = 'temporal';
        }

        // Calculate statistics based on type
        let stats = {
          name: column,
          type,
          uniqueValues: new Set(values).size,
          nullCount: sampledData.length - values.length
        };

        // Add numeric statistics if quantitative
        if (type === 'quantitative') {
          const numericValues = values as number[];
          Object.assign(stats, {
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
            mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
            median: numericValues.sort((a, b) => a - b)[Math.floor(numericValues.length / 2)]
          });
        }

        return stats;
      });

      return {
        rowCount: data.length,
        columnCount: columns.length,
        columns: columnStats
      };
    } catch (error) {
      console.error('Invalid data structure:', data, error);
      return {
        rowCount: 0,
        columnCount: 0,
        columns: []
      };
    }
  }, [data]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <FooterContainer>
      <DataSummary>
        <SummaryText>
          {stats.rowCount.toLocaleString()} rows × {stats.columnCount} columns
        </SummaryText>
        <ViewDataButton onClick={() => setShowDataTable(!showDataTable)}>
          {showDataTable ? 'Hide Data' : 'View Data'}
        </ViewDataButton>
      </DataSummary>

      {showDataTable && (
        <DataTableContainer>
          <DataTable>
            <thead>
              <tr>
                {stats.columns.map(col => (
                  <th key={col.name}>
                    {col.name}
                    <ColumnType>{col.type}</ColumnType>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <tr key={i}>
                    {stats.columns.map(col => (
                      <td key={col.name}>{String(row[col.name])}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </DataTable>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </DataTableContainer>
      )}

      <ColumnStats>
        {stats.columns.map(col => (
          <ColumnStat key={col.name}>
            <ColumnName>{col.name}</ColumnName>
            <StatsList>
              <StatItem>Type: {col.type}</StatItem>
              <StatItem>Unique Values: {col.uniqueValues}</StatItem>
              <StatItem>Null Count: {col.nullCount}</StatItem>
              {col.type === 'quantitative' && (
                <>
                  <StatItem>Min: {col.min?.toLocaleString()}</StatItem>
                  <StatItem>Max: {col.max?.toLocaleString()}</StatItem>
                  <StatItem>Mean: {col.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</StatItem>
                  <StatItem>Median: {col.median?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</StatItem>
                </>
              )}
            </StatsList>
          </ColumnStat>
        ))}
      </ColumnStats>
    </FooterContainer>
  );
}; 