import {
    Ion,
    Viewer,
    Terrain,
    createOsmBuildingsAsync,
    Cartesian3,
    Math,
    createWorldImagery,
    IonWorldImageryStyle
  } from "cesium";
  import "cesium/Widgets/widgets.css";
  import "../src/css/main.css";
  import "../src/css/sidebar.css";
  import "../src/css/sidebar-panels.css";
  import "../src/css/dataset-selector.css";
  import "../src/css/logo.css";
  
  // Import our custom TilesetManager
  import { TilesetManager, SCAN_AUDIT_TILESETS } from "./utils/TilesetManager";
  
  // Import the sidebar setup
  import initializeSidebar from "./ui/sidebar/SidebarSetup";
  
  // Import the dataset selector
  import { createDatasetSelector } from './ui/DatasetSelector';
  import { createLogo } from './ui/Logo';
  
  // Your access token can be found at: https://cesium.com/ion/tokens.
  Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMmUwMWI1My1kZTE3LTRjN2QtYjU4OS1mZDM0ODNlYjk1MjYiLCJpZCI6MjgyODY0LCJpYXQiOjE3NDE1OTk1MDN9.N6iesXHoMViCX6RW5EC4z1wmpB3V0bN4V95WvAx3wF8";
  
  /**
   * Main application entry point
   */
  async function startApp() {
    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Viewer("cesiumContainer", {
      terrain: Terrain.fromWorldTerrain(),
    });
    
    // Create our tileset manager
    const tilesetManager = new TilesetManager(viewer);
    
    // Store the TilesetManager instance on the viewer for easy access
    viewer.tilesetManager = tilesetManager;
    
    // Add Cesium OSM Buildings, a global 3D buildings layer.
    const buildingTileset = await createOsmBuildingsAsync();
    viewer.scene.primitives.add(buildingTileset);
    
    // Store a reference to the OSM buildings in the TilesetManager
    tilesetManager.setOsmBuildingsTileset(buildingTileset);
    
    // Add the ScanAudit logo
    createLogo();
    
    try {
      // Load all the scan audit point cloud tilesets
      console.log("Loading scan audit point cloud tilesets...");
      await tilesetManager.loadTilesets(SCAN_AUDIT_TILESETS);
      
      // Navigate to the first tileset
      await tilesetManager.navigateToDefault();
      
      // Initialize the sidebar after the point cloud data is loaded
      initializeSidebar(viewer);
      
      // Initialize the dataset selector
      createDatasetSelector(tilesetManager, viewer);
      
      // Add keyboard shortcut to toggle frustum culling for testing
      document.addEventListener('keydown', (e) => {
        if (e.key === 'F' || e.key === 'f') {
          // Import needed to access the function
          const { toggleFrustumCullingForTesting, ENABLE_FRUSTUM_CULLING } = require('./utils/FixedPerformanceSettings');
          toggleFrustumCullingForTesting(viewer, !ENABLE_FRUSTUM_CULLING);
          showErrorMessage(`Frustum Culling: ${!ENABLE_FRUSTUM_CULLING ? 'ON' : 'OFF'}`);
        }
        
        // Press 'C' to clear the tile cache manually
        if (e.key === 'C' || e.key === 'c') {
          tilesetManager.clearTileCache();
          showErrorMessage("Manually cleared tile cache");
        }
      });
    } catch (error) {
      console.error("Error initializing point clouds:", error);
      
      // If there's an error, fall back to the default San Francisco view
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
        orientation: {
          heading: Math.toRadians(0.0),
          pitch: Math.toRadians(-15.0),
        },
      });
      
      // Still initialize the sidebar even if point clouds failed to load
      initializeSidebar(viewer);
      
      // Create the dataset selector with empty data
      createDatasetSelector(null, viewer);
    }
  }
  
  // Helper function to show error messages to the user
  function showErrorMessage(message) {
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Add to body
    document.body.appendChild(errorElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorElement.classList.add('fade-out');
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.parentNode.removeChild(errorElement);
        }
      }, 1000);
    }, 5000);
  }
  
  // Start the application
  startApp().catch(error => {
    console.error("Application startup failed:", error);
    showErrorMessage("Application failed to start. Please refresh the page.");
  });