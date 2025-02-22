import { useVirtualizer } from '@tanstack/react-virtual';
import styled from 'styled-components';
import { useRef } from 'react';

const VirtualTable = styled.div`
  height: 400px;
  overflow: auto;
`;

export const DataPreview = ({ data }: { data: any[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <VirtualTable ref={parentRef}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {/* Render row data */}
          </div>
        ))}
      </div>
    </VirtualTable>
  );
}; 