import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #495057;
  position: sticky;
  top: 0;
  background: white;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
`;

interface DataTableProps {
  data: any[];
}

export const DataTable = ({ data }: DataTableProps) => {
  if (!data.length) return null;

  const columns = Object.keys(data[0]);

  return (
    <Table>
      <thead>
        <tr>
          {columns.map(col => (
            <Th key={col}>{col}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 50).map((row, i) => (
          <tr key={i}>
            {columns.map(col => (
              <Td key={col}>{String(row[col])}</Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}; 