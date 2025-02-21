import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`; 