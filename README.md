# ScanAudit Cesium Viewer

A 3D point cloud viewer built with CesiumJS for ScanAudit. This application allows users to view and interact with 3D point cloud data from various datasets.

## Features

- Interactive 3D point cloud visualization
- Multiple dataset selection with Castle, Barn, and Guesthouse options
- OSM Buildings integration
- Sidebar with various tools panels
- Dataset toggle controls
- Clipping plane tools
- Navigation and measurement functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/bbbence66/Cesium-development.git
   cd Cesium-development
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. The application will be available at `http://localhost:8080` (or another port if configured differently)

## Project Structure

- `src/` - Source code
  - `css/` - CSS stylesheets
  - `ui/` - UI components
  - `utils/` - Utility functions and managers
- `public/` - Static assets
  - `assets/images/` - Image files including the ScanAudit logo
- `dist/` - Build output (generated)

## License

This project is proprietary and confidential.

## Acknowledgments

- [CesiumJS](https://cesium.com/platform/cesiumjs/) - The platform for 3D geospatial visualization
- [ScanAudit](https://scanaudit.com) - For the point cloud data and requirements 