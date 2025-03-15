/**
 * TilesetManager.js
 * Utility for loading and managing 3D Tileset point clouds in Cesium.
 */

import {
  Cesium3DTileset,
  HeadingPitchRange,
  Math as CesiumMath
} from "cesium";

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
      
      const tileset = await Cesium3DTileset.fromUrl(url);
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