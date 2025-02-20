import styled from 'styled-components';
import { ChartStyle } from '../../types/chart';

interface ChartContainerProps {
  style: Partial<ChartStyle>;
}

export const ChartContainer = styled.div<ChartContainerProps>`
  .chart-svg {
    filter: ${props => {
      const filters = [];
      if (props.style.marks?.glowRadius) {
        filters.push(`drop-shadow(0 0 ${props.style.marks.glowRadius}px ${props.style.marks.glowColor || '#fff'})`);
      }
      if (props.style.marks?.shadowRadius) {
        filters.push(`drop-shadow(0 4px ${props.style.marks.shadowRadius}px rgba(0,0,0,0.2))`);
      }
      if (props.style.marks?.blur) {
        filters.push(`blur(${props.style.marks.blur}px)`);
      }
      return filters.length ? filters.join(' ') : 'none';
    }};
  }

  background: ${props => {
    if (props.style.view?.gradientType === 'linear') {
      return `linear-gradient(
        ${props.style.view.gradientStart || '#fff'},
        ${props.style.view.gradientEnd || '#fff'}
      )`;
    }
    if (props.style.view?.gradientType === 'radial') {
      return `radial-gradient(
        ${props.style.view.gradientStart || '#fff'},
        ${props.style.view.gradientEnd || '#fff'}
      )`;
    }
    return 'none';
  }};
`; 