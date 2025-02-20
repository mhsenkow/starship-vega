import styled from 'styled-components';

export const ChartControls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 6px;
  
  button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f0f0f0;
      border-color: #999;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0px);
    }
  }
`;

export const ChartContainer = styled.div`
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`; 