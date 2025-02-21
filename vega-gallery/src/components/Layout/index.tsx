import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: ${props => props.theme.layout.contentWidth};
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.header`
  height: ${props => props.theme.layout.headerHeight};
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface.raised};
  border-radius: ${props => props.theme.borders.radius.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Main = styled.main`
  flex: 1;
  background: ${props => props.theme.colors.surface.raised};
  border-radius: ${props => props.theme.borders.radius.lg};
  overflow: hidden;
`;

const Title = styled.h1`
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0;
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutContainer>
      <Header>
        <Title>Vega Gallery</Title>
      </Header>
      <Main>{children}</Main>
    </LayoutContainer>
  );
}; 