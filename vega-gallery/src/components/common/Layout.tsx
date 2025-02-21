import styled from 'styled-components'

const LayoutContainer = styled.div`
  width: 100%;
  max-width: ${props => props.theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <LayoutContainer>{children}</LayoutContainer>
}

export const GalleryLayout = styled(LayoutContainer)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${(props) => props.theme.spacing.lg};
`;

export const EditorLayout = styled(LayoutContainer)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;
