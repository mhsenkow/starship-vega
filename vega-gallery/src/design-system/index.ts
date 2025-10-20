/**
 * Design System
 * Centralized design system with tokens, CSS variables, and components
 */

// Design tokens
export * from './tokens';
export { designTokens } from './tokens';

// CSS variables
export * from './css-variables';
export { cssVariables, lightThemeVars, darkThemeVars } from './css-variables';

// Components
export * from './components/ButtonSystem';
export * from './components/Input';
export * from './components/Card';
export * from './components/Typography.module';
export * from './components/Tabs.module';
export * from './components/Loading';
export * from './components/Box.module';
export * from './components/Tooltip.module';

// Re-export commonly used component groups
import { Button, ButtonGroup } from './components/ButtonSystem';
import { Input, Textarea, Select, SearchInput, NumberInput } from './components/Input';
import { Card, CardHeader, CardContent, CardActions, MediaCardWrapper, StatsCard, StatsCardContent } from './components/Card';
import { Typography } from './components/Typography.module';
import { Tabs, Tab, TabPanel } from './components/Tabs.module';
import { CircularProgress, LinearProgress, Skeleton, LoadingOverlay } from './components/Loading';
import { Box } from './components/Box.module';
import { Tooltip } from './components/Tooltip.module';

export const Components = {
  Button,
  ButtonGroup,
  Input,
  Textarea,
  Select,
  SearchInput,
  NumberInput,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  MediaCardWrapper,
  StatsCard,
  StatsCardContent,
  Typography,
  Tabs,
  Tab,
  TabPanel,
  CircularProgress,
  LinearProgress,
  Skeleton,
  LoadingOverlay,
  Box,
  Tooltip,
} as const;
