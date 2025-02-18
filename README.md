# Vega Gallery

An interactive gallery and playground for Vega-Lite visualizations with real-time visual editing capabilities.

## ✨ Features

### Gallery View
- ✅ Responsive 3-column grid layout with chart cards
- ✅ Category filters (Statistical, Time Series)
- ✅ Complexity filters (Beginner, Intermediate)
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

### Chart Customization
- ✅ Dataset selection with compatibility checks
- ✅ Mark type switching with automatic encoding suggestions
- ✅ Visual controls for:
  - Chart dimensions and layout
  - Colors and opacity
  - Fonts and typography
  - Axes and grid styling
  - Legend configuration
- ✅ Support for multiple chart types:
  - Bar charts
  - Line charts
  - Scatter plots
  - Pie charts
  - Box plots
  - Area charts
  - Tick plots
  - Trail visualizations

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

### Styling
- IBM Plex Sans for UI
- IBM Plex Mono for code
- Consistent color scheme and spacing
- Responsive layout breakpoints

### Data Management
- Built-in sample datasets
- Automatic data type detection
- Smart encoding suggestions
- Dataset-chart compatibility checking
- Support for multiple data formats

## 🎯 Roadmap
- [ ] Add more chart examples
  - Support for geographic visualizations
  - Hierarchical data visualizations
- [ ] Implement chart sharing
  - URL-based sharing
  - Export to image
- [ ] Add chart thumbnails
  - Pre-rendered previews
  - Loading states
- [ ] Support for custom data sources
  - CSV upload
  - JSON import
  - API integration
- [ ] Add chart templates
  - Starter templates
  - Common configurations
- [ ] Implement chart export options
  - PNG/SVG export
  - Vega-Lite spec export
- [✓] Add visual styling controls