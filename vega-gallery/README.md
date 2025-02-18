Vega Gallery
An interactive gallery and playground for Vega-Lite visualizations.
Features
✅ Gallery view with responsive chart cards
✅ Live chart editor with preview
✅ Category and complexity filters
✅ Responsive layout for different screen sizes

##Implementation Details
###Gallery View
Responsive 3-column grid layout (reference: GalleryGrid.tsx lines 13-27)
Fixed-size chart previews for consistent layout
Filtering by category and complexity level
Hover animations on cards

###Editor View
Split-pane layout with code editor and preview
Live preview updates
Responsive chart rendering
Error handling for invalid specifications

###Chart Rendering
Dual-mode rendering system for gallery and editor views
Fixed dimensions for gallery cards (300x180)
Container-responsive for editor preview
SVG renderer for crisp visuals

###Getting Started
Clone the repository
Install dependencies
npm install
Start the development server
npm run dev

###Tech Stack- React- TypeScript- Vega-Lite- Monaco Editor- Styled Components
###TODO
[ ] Add more chart examples
[ ] Implement chart sharing
[ ] Add chart thumbnails
[ ] Support for custom data sources
[ ] Add chart templates
[ ] Implement chart export options
[✓] Add visual styling controls