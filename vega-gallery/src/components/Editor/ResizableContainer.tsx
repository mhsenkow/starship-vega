import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
`;

const LeftPanel = styled.div`
  height: 100%;
  background: white;
  overflow-y: auto;
`;

const RightPanel = styled.div`
  flex: 1;
  height: 100%;
  background: white;
  overflow: hidden;
`;

const Divider = styled.div`
  position: absolute;
  width: 4px;
  height: 100%;
  background: #e9ecef;
  cursor: col-resize;
  transition: background 0.2s;

  &:hover {
    background: #4dabf7;
  }

  &:active {
    background: #4dabf7;
  }
`;

interface ResizableContainerProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultWidth?: number;
}

export const ResizableContainer = ({ 
  left,
  right,
  defaultWidth = 400 
}: ResizableContainerProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    startWidth.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const containerWidth = containerRef.current?.offsetWidth || 0;
      const delta = e.pageX - startX.current;
      const newWidth = Math.min(
        Math.max(startWidth.current + delta, 200),
        containerWidth - 400
      );

      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Container ref={containerRef}>
      <LeftPanel style={{ width: `${width}px` }}>
        {left}
      </LeftPanel>
      <Divider
        onMouseDown={handleMouseDown}
        style={{ left: `${width}px` }}
      />
      <RightPanel>
        {right}
      </RightPanel>
    </Container>
  );
}; 