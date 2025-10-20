/**
 * IBM Carbon Design System Icons
 * Replacing Material UI icons with robust, accessible Carbon icons
 * 
 * Using @carbon/icons-react for properly designed and maintained icons
 * These are self-contained and provide excellent accessibility
 */

import React from 'react';
import {
  // Navigation & Layout
  Dashboard,
  Grid,
  List,
  ViewMode_1 as ViewComfortable,
  ViewMode_2 as ViewStream,
  View as ViewComfy,
  ArrowLeft,
  
  // Data & Charts  
  Bar,
  ChartLine,
  ChartPie,
  
  // Actions
  Add,
  TrashCan,
  Edit,
  Close,
  Save,
  
  // UI
  Information,
  Search,
  PaintBrush,
  Sun,
  Moon,
  CloudUpload,
  Number_1 as Number1,
  CategoryNew,
  Image as ImageIcon,
  Download,
  DataBase as DatabaseIcon,
  
  // Additional commonly used icons
  Code,
  Settings,
  Camera as CameraIcon,
  Menu,
  Filter,
  Cloud,
  Table as TableChart,
  Shuffle,
  Bot,
  Light as LightMode,
  Moon as DarkMode,
  Flash as Flare,
  PaintBrush as Palette,
  CircleFilled as Circle,
  SquareFill as Square,
  Renew as HistoryToggleOff,
  View as VisibilityIcon,
  ViewOff as VisibilityOffIcon,
  Tuning as TuneIcon,
  Grid as BlurOnIcon,
  // VisualEditor icons
  ChartLine as AutoGraphIcon,
  Information as RecommendIcon,
  // Note: Width icons will use Grid icon as fallback
  // StyleEditor icons - using available Carbon icons as fallbacks
  Types as FormatSizeIcon,
  PaintBrush as FormatColorFillIcon,
  Grid as BorderStyleIcon,
  Settings as AutoFixHighIcon,
  
  // CanvasView Icons - using available icons
} from '@carbon/icons-react';

// Icon props interface for consistency
export interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  description?: string;
}

// Re-export Carbon icons with consistent naming for Material UI compatibility
export const DashboardIcon = Dashboard;
export const ArrowLeftIcon = ArrowLeft;

// Editor Layout Icons
export const BrushIcon = PaintBrush;
export { TuneIcon }; // already imported as TuneIcon from Tuning
export const CodeIcon = Code;
export const CameraAltIcon = CameraIcon;
export const GridViewIcon = Grid;
export const ViewListIcon = List;
export const BarChartIcon = Bar;
export const TimelineIcon = ChartLine;
export const PieChartIcon = ChartPie;

// VisualEditor Icons
export { AutoGraphIcon, RecommendIcon };

// StyleEditor Icons
export { FormatSizeIcon, FormatColorFillIcon, BorderStyleIcon, AutoFixHighIcon };

// Preview Icons
export const DownloadIcon = Download;

// Width Icons - Custom SVG components for better visual distinction
export const WidthNormalIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" {...props}>
    <rect x="2" y="6" width="12" height="4" rx="1" />
  </svg>
);

export const WidthMediumIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" {...props}>
    <rect x="1" y="5" width="14" height="6" rx="1" />
  </svg>
);

export const WidthWideIcon = ({ size = 16, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" {...props}>
    <rect x="0" y="4" width="16" height="8" rx="1" />
  </svg>
);

export const InfoIcon = Information;
export const AddIcon = Add;
export const DeleteIcon = TrashCan;
export const EditIcon = Edit;
export const CloseIcon = Close;
export const SaveIcon = Save;
export const SearchIcon = Search;
export const UploadIcon = CloudUpload;
export const NumbersIcon = Number1;
export const CategoryIcon = CategoryNew;
export const StorageIcon = DatabaseIcon;
export const UploadFileIcon = CloudUpload;
export { ImageIcon }; // Already imported as ImageIcon from Image
export const TableChartIcon = TableChart;
export const CloudUploadIcon = CloudUpload;
export const DirectionsIcon = Settings; // Using Settings as directions icon fallback

// CanvasView Icons
export const DeleteOutlineIcon = TrashCan;
export const MoreVertIcon = Menu; // Using existing Menu import
export const InfoOutlinedIcon = Information;
export const EditOutlinedIcon = Edit;
export const ViewComfyIcon = ViewComfy;
export const ViewStreamIcon = ViewStream;
export const ViewColumnIcon = Grid; // Using Grid as a wide view icon
export const ViewComfortableIcon = ViewComfortable;
export const ShuffleIcon = Shuffle;
export const SmartToyIcon = Bot;
export const HelpOutlineIcon = Information;
export const LightModeIcon = LightMode;
export const DarkModeIcon = DarkMode;
export const FlareIcon = Flare;
export const PaletteIcon = Palette;
export const CircleIcon = Circle;
export const SquareIcon = Square;
export const HistoryToggleOffIcon = HistoryToggleOff;
export { VisibilityIcon, VisibilityOffIcon, BlurOnIcon };

// Additional commonly used icons
export {
  Code,
  Settings,
  CameraIcon,
  Menu,
  Filter,
};

// Export the base icons as well for direct use
export {
  Dashboard,
  Grid,
  List,
  Bar,
  ChartLine,
  ChartPie,
  Add,
  TrashCan,
  Edit,
  Close,
  Save,
  Information,
  Search,
  PaintBrush,
  Sun,
  Moon,
  CloudUpload,
  Number1,
  CategoryNew,
  Download,
  DatabaseIcon,
  Cloud,
  TableChart,
};

// Export aliased icons
export { ViewComfortable, ViewStream, ViewComfy };

// Custom icon wrapper for consistent sizing if needed
export const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ 
  size = 16, 
  children,
  ...props 
}) => {
  const childElement = React.Children.only(children) as React.ReactElement;
  const iconSize = typeof size === 'number' ? size : 16;
  
  return (
    <div style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...props}>
      {React.isValidElement(childElement) ? React.cloneElement(childElement, { 
        width: iconSize,
        height: iconSize
      } as any) : childElement}
    </div>
  );
};