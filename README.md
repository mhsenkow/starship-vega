# Vega Gallery

An interactive gallery and playground for Vega-Lite visualizations with real-time visual editing capabilities.

## ✨ Features

### Gallery View
- ✅ Responsive 3-column grid layout with chart cards
- ✅ Advanced filtering system:
  - Category filters (Statistical, Time Series, Hierarchical, Correlation, Part-to-Whole)
  - Complexity filters (Beginner, Intermediate, Advanced)
  - Search functionality with keywords
  - Smart sorting by category and complexity
- ✅ Interactive chart previews
- ✅ Consistent 300x180 chart previews

### Editor View
- ✅ Three-mode editor:
  - Visual Editor: No-code chart configuration
  - Style Editor: Detailed visual customization
  - Code Editor: Direct JSON specification editing
- ✅ Live preview with automatic updates
- ✅ Responsive chart rendering
- ✅ Error handling for invalid specifications
- ✅ Dataset compatibility checking

### Visualization Types
- ✅ Statistical Charts:
  - Scatter plots
  - Bar charts (Simple, Grouped, Stacked)
  - Box plots
  - Violin plots
  - Histograms with KDE
  - Q-Q plots
  - Error bars
  - Correlation heatmaps
- ✅ Time Series:
  - Line charts
  - Area charts
  - Stream graphs
  - Radial plots
  - Interactive multi-line
- ✅ Hierarchical:
  - Treemaps
  - Sunburst charts
  - Force-directed graphs
  - Chord diagrams
- ✅ Part-to-Whole:
  - Pie charts
  - Waffle charts
- ✅ Specialized:
  - Heat maps
  - Bullet charts
  - Connected scatter plots

### Chart Customization
- ✅ Dataset selection with compatibility checks
- ✅ Mark type switching with automatic encoding suggestions
- ✅ Visual controls for:
  - Chart dimensions and layout
  - Colors and opacity
  - Fonts and typography
  - Axes and grid styling
  - Legend configuration

### Data Management
- ✅ Built-in sample datasets
- ✅ Custom data upload support:
  - JSON and CSV formats
  - Automatic data type detection
  - Dataset-chart compatibility checking
- ✅ Smart encoding suggestions
- ✅ Interactive data preview

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
npm install

3. Start the development server:
npm start

4. Open your browser and navigate to:
http://localhost:5173/ 

## 🛠 Tech Stack
- React 19
- TypeScript
- Vega-Lite
- Monaco Editor
- Styled Components
- Vite

## 📝 Implementation Details

### Rendering System
- SVG-based rendering for crisp visuals
- Dual-mode rendering:
  - Fixed dimensions (300x180) for gallery
  - Container-responsive for editor
- Optimized performance with smart re-rendering

### Styling
- IBM Plex Sans for UI
- IBM Plex Mono for code
- Consistent color scheme and spacing
- Responsive layout breakpoints
- Customizable chart themes

### Data Management
- Built-in sample datasets
- Automatic data type detection
- Smart encoding suggestions
- Dataset-chart compatibility checking
- Support for multiple data formats

## 🎯 Roadmap & TODOs

### Phase 1: Enhanced Visualization (Q2 2024)
- [ ] Geographic visualizations
  - Maps with data overlays
  - Choropleth maps
  - Point maps with clustering
- [ ] Advanced interactions
  - Cross-filtering between charts
  - Drill-down capabilities
  - Custom interaction builders
- [ ] Animation system
  - Transition animations
  - Time-based animations
  - Interactive playback controls
- [ ] Fix: Implement missing chart types in `/src/charts/distribution/index.ts`
- [ ] Fix: Complete implementation of violin plots and KDE histograms
- [ ] Fix: Add error handling for invalid chart specifications

### Phase 2: Data Management (Q3 2024)
- [ ] Advanced data sources
  - Database connections
  - REST API integration
  - Real-time data streaming
- [ ] Data transformation
  - Visual data transformation builder
  - Custom formula support
  - Aggregation functions
  - Data cleaning tools
- [ ] Fix: Complete data validation in DatasetSelector component
- [ ] Fix: Implement proper error boundaries for data loading
- [ ] Fix: Add data type inference for CSV uploads

### Phase 3: Collaboration (Q4 2024)
- [ ] User management
  - User accounts
  - Team workspaces
  - Access control
- [ ] Sharing capabilities
  - Public/private charts
  - Embeddable visualizations
  - Export to multiple formats
- [ ] Version control
  - Chart version history
  - Collaborative editing
  - Change tracking
- [ ] Fix: Implement missing export functionality
- [ ] Fix: Add proper state management for user sessions

### Phase 4: Enterprise Features (Q1 2025)
- [ ] Dashboard builder
  - Multi-chart layouts
  - Interactive dashboard filters
  - Real-time updates
- [ ] Advanced analytics
  - Statistical analysis tools
  - Trend detection
  - Anomaly highlighting
- [ ] Integration capabilities
  - API for external tools
  - Plugin system
  - Custom extensions
- [ ] Fix: Complete implementation of chart interactivity
- [ ] Fix: Add proper TypeScript types for all chart configurations

### Immediate TODOs
1. Fix empty distribution charts implementation
2. Complete missing chart type definitions
3. Implement proper error handling in chart renderer
4. Add validation for dataset compatibility
5. Complete style editor functionality
6. Add proper TypeScript types for chart configurations
7. Implement missing chart interactions
8. Add tests for core components
9. Fix responsive layout issues
10. Complete documentation for all components

Meta isn't allowed to use this but anyone else, feel free. 