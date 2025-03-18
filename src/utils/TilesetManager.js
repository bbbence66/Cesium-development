/**
 * TilesetManager.js
 * Utility for loading and managing 3D Tileset point clouds in Cesium.
 */

import {
  Cesium3DTileset,
  HeadingPitchRange,
  Math as CesiumMath
} from "cesium";

// Import fixed performance settings
import { getTilesetOptions, applyFixedSettings, ENABLE_FRUSTUM_CULLING } from './FixedPerformanceSettings';

/**
 * Class to manage loading and navigation of 3D Tilesets
 */
export class TilesetManager {
  /**
   * Create a new TilesetManager
   * @param {Viewer} viewer - The Cesium viewer instance
   */
  constructor(viewer) {
    this.viewer = viewer;
    this.tilesets = {};
    this.osmBuildingsTileset = null; // Store reference to OSM Buildings tileset
  }

  /**
   * Set the OSM Buildings tileset reference
   * @param {Cesium3DTileset} tileset - The OSM Buildings tileset
   */
  setOsmBuildingsTileset(tileset) {
    this.osmBuildingsTileset = tileset;
    // Apply fixed performance settings to OSM Buildings tileset
    applyFixedSettings(tileset, this.viewer);
    console.log("OSM Buildings tileset reference saved and performance settings applied");
  }

  /**
   * Toggle the visibility of OSM Buildings
   * @param {boolean} [force] - Force a specific state (if not provided, will toggle)
   * @returns {boolean} The new visibility state
   */
  toggleOsmBuildings(force) {
    if (!this.osmBuildingsTileset) {
      console.warn("OSM Buildings tileset not found");
      
      // Fallback: Try to find the OSM Buildings tileset in the scene primitives
      const primitives = this.viewer.scene.primitives;
      for (let i = 0; i < primitives.length; i++) {
        const primitive = primitives.get(i);
        // Look for 3D Tileset with Cesium3DTileset properties
        if (primitive && primitive.hasOwnProperty('tileVisible') && 
            primitive.hasOwnProperty('maximumScreenSpaceError') &&
            primitive !== this.tilesets[Object.keys(this.tilesets)[0]]?.cesiumTileset) {
          this.osmBuildingsTileset = primitive;
          // Apply fixed performance settings to newly found OSM Buildings tileset
          applyFixedSettings(this.osmBuildingsTileset, this.viewer);
          console.log("OSM Buildings tileset found, referenced, and performance settings applied");
          break;
        }
      }
      
      if (!this.osmBuildingsTileset) {
        console.error("Could not find OSM Buildings tileset");
        return false;
      }
    }
    
    // Toggle or force the visibility state
    const newState = force !== undefined ? force : !this.osmBuildingsTileset.show;
    this.osmBuildingsTileset.show = newState;
    console.log(`Toggled OSM Buildings: ${newState ? 'ON' : 'OFF'}`);
    return newState;
  }

  /**
   * Load a tileset from a URL
   * @param {string} url - URL to the tileset JSON
   * @param {string} name - Display name for the tileset
   * @returns {Promise<Cesium3DTileset|null>} The loaded tileset or null if loading failed
   */
  async loadTileset(url, name) {
    try {
      console.log(`Loading tileset: ${name}`);
      
      // Create tileset with fixed performance optimization settings
      const tileset = await Cesium3DTileset.fromUrl(url, getTilesetOptions());
      
      // Apply our fixed performance settings, passing the viewer
      applyFixedSettings(tileset, this.viewer);
      
      this.viewer.scene.primitives.add(tileset);
      
      // Store the tileset with its metadata
      const id = name.toLowerCase().replace(/\s+/g, '-');
      this.tilesets[id] = {
        cesiumTileset: tileset,
        name: name,
        url: url,
        show: true
      };
      
      console.log(`Successfully loaded: ${name}`);
      return tileset;
    } catch (error) {
      console.error(`Error loading tileset ${name}:`, error);
      return null;
    }
  }

  /**
   * Load multiple tilesets from an array of configurations
   * @param {Array<Object>} tilesetConfigs - Array of {url, name} objects
   * @returns {Promise<Array<Cesium3DTileset>>} Array of successfully loaded tilesets
   */
  async loadTilesets(tilesetConfigs) {
    const loadPromises = tilesetConfigs.map(config => 
      this.loadTileset(config.url, config.name)
    );
    
    const loadedTilesets = await Promise.all(loadPromises);
    const successfulTilesets = loadedTilesets.filter(tileset => tileset !== null);
    
    if (successfulTilesets.length > 0) {
      console.log(`Loaded ${successfulTilesets.length} of ${tilesetConfigs.length} tilesets`);
    } else {
      console.error('Failed to load any tilesets');
    }
    
    return successfulTilesets;
  }

  /**
   * Navigate to a specific tileset
   * @param {string} tilesetId - The ID of the tileset to navigate to
   * @param {HeadingPitchRange} [headingPitchRange] - Optional viewing angle
   */
  async navigateToTileset(tilesetId, headingPitchRange = new HeadingPitchRange(0, -CesiumMath.PI/4, 0)) {
    try {
      const tilesetInfo = this.tilesets[tilesetId];
      if (!tilesetInfo || !tilesetInfo.cesiumTileset) {
        console.error(`Tileset with ID '${tilesetId}' not found`);
        return;
      }
      
      console.log(`Navigating to: ${tilesetInfo.name}...`);
      
      // Wait for the tileset to load its root tile if it hasn't already
      await tilesetInfo.cesiumTileset.readyPromise;
      
      // Fly to the tileset
      this.viewer.zoomTo(tilesetInfo.cesiumTileset, headingPitchRange);
    } catch (error) {
      console.error('Error navigating to tileset:', error);
    }
  }

  /**
   * Navigate to the first loaded tileset or a default view if none loaded
   * @returns {Promise<void>}
   */
  async navigateToDefault() {
    const tilesetIds = Object.keys(this.tilesets);
    if (tilesetIds.length > 0) {
      await this.navigateToTileset(tilesetIds[0]);
    } else {
      console.error("No tilesets loaded to navigate to.");
    }
  }

  /**
   * Manually clear the tile cache for all loaded tilesets.
   * This is useful for testing frustum culling - call this when looking away
   * from a tileset to force unloading of tiles.
   */
  clearTileCache() {
    console.log("Manually clearing tile cache for all tilesets...");
    
    // Force all tilesets to trim their caches
    this.viewer.scene.primitives._primitives.forEach(primitive => {
      if (primitive && primitive.constructor && primitive.constructor.name === 'Cesium3DTileset') {
        // Force the tileset to clear its cache
        primitive.trimLoadedTiles();
        
        // Additional cache clearing operations
        if (primitive._cache) {
          primitive._cache.reset();
        }
        
        console.log("Cleared cache for a tileset");
      }
    });
    
    // Force a scene update
    this.viewer.scene.requestRender();
  }
}

/**
 * Default tileset configurations for the scan audit point clouds
 */
export const SCAN_AUDIT_TILESETS = [
  {
    url: "https://scanaudit.s3.amazonaws.com/pointclouds/PY3Dtiles-EPSG4978-rgbTRUE/tileset.json",
    name: "Castle"
  },
  {
    url: "https://scanaudit.s3.amazonaws.com/pointclouds/Istallo-3dtiles/tileset.json",
    name: "Barn"
  },
  {
    url: "https://scanaudit.s3.amazonaws.com/pointclouds/Vendeghaz-3dtiles/tileset.json",
    name: "Guesthouse"
  }
]; 