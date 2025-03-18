/**
 * FixedPerformanceSettings.js
 * 
 * Contains fixed performance settings for the application.
 * These settings are applied directly to tilesets without UI controls.
 */

import { PointCloudShading } from "cesium";

/**
 * The performance quality preset to use
 * Options: 'ultra', 'high', 'medium', 'low'
 */
export let PERFORMANCE_PRESET = 'medium';

/**
 * Control whether frustum culling is enabled
 * When true, points outside the camera view are culled (not rendered)
 * When false, all points are kept in memory regardless of visibility
 */
export let ENABLE_FRUSTUM_CULLING = true;

/**
 * Debug options for visualizing culling behavior
 * When true, shows red planes representing the view frustum
 * Set to false if you don't want to see the red visualization
 */
export const DEBUG_SHOW_FRUSTUM_CULLING = false; // Disabled by default to avoid red visualization

/**
 * How aggressively to unload tiles outside view
 * Lower values (like 0) are more aggressive at unloading
 * Higher values keep more in memory
 */
export const CACHE_BYTES = 0; // Set to 0 for most aggressive unloading

/**
 * List of available presets for easy cycling
 */
export const AVAILABLE_PRESETS = ['ultra', 'high', 'medium', 'low', 'lowest'];

/**
 * Callback function registry for when settings change
 */
const settingsChangeCallbacks = [];

/**
 * Register a callback function to be called when settings change
 * @param {Function} callback - Function to call when settings change
 */
export function onSettingsChange(callback) {
  if (typeof callback === 'function' && !settingsChangeCallbacks.includes(callback)) {
    settingsChangeCallbacks.push(callback);
  }
}

/**
 * Remove a previously registered callback function
 * @param {Function} callback - Function to remove from callbacks
 */
export function offSettingsChange(callback) {
  const index = settingsChangeCallbacks.indexOf(callback);
  if (index !== -1) {
    settingsChangeCallbacks.splice(index, 1);
  }
}

/**
 * Notify all registered callbacks that settings have changed
 */
function notifySettingsChanged() {
  const settings = {
    preset: PERFORMANCE_PRESET,
    frustumCulling: ENABLE_FRUSTUM_CULLING
  };
  
  settingsChangeCallbacks.forEach(callback => {
    try {
      callback(settings);
    } catch (e) {
      console.error('Error in settings change callback:', e);
    }
  });
}

/**
 * Performance settings configuration based on preset
 */
export const PERFORMANCE_SETTINGS = {
  // Ultra settings - highest quality
  ultra: {
    maximumScreenSpaceError: 8,
    maximumMemoryUsage: 1024,
    dynamicScreenSpaceErrorDensity: 0.00002,
    dynamicScreenSpaceErrorFactor: 4,
    foveatedConeSize: 0.1,
    geometricErrorScale: 0.5,
    maximumAttenuation: 8,
    pointBudget: 5000000  // 5 million points for ultra quality
  },
  
  // High settings - good quality with reasonable performance
  high: {
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 512,
    dynamicScreenSpaceErrorDensity: 0.00004,
    dynamicScreenSpaceErrorFactor: 4,
    foveatedConeSize: 0.15,
    geometricErrorScale: 0.7,
    maximumAttenuation: 8,
    pointBudget: 3000000  // 3 million points
  },
  
  // Medium settings - balanced performance and quality
  medium: {
    maximumScreenSpaceError: 24,
    maximumMemoryUsage: 256,
    dynamicScreenSpaceErrorDensity: 0.00006,
    dynamicScreenSpaceErrorFactor: 6,
    foveatedConeSize: 0.2,
    geometricErrorScale: 1.0,
    maximumAttenuation: 6,
    pointBudget: 2000000  // 2 million points
  },
  
  // Low settings - best performance
  low: {
    maximumScreenSpaceError: 32,
    maximumMemoryUsage: 128,
    dynamicScreenSpaceErrorDensity: 0.00008,
    dynamicScreenSpaceErrorFactor: 8,
    foveatedConeSize: 0.3,
    geometricErrorScale: 1.5,
    maximumAttenuation: 4,
    pointBudget: 1000000  // 1 million points
  },
  
  // Lowest settings - for very performance-critical situations
  lowest: {
    maximumScreenSpaceError: 64, // Much higher for better performance
    maximumMemoryUsage: 64,      // Lower memory usage
    dynamicScreenSpaceErrorDensity: 0.0001,
    dynamicScreenSpaceErrorFactor: 10,
    foveatedConeSize: 0.4,
    geometricErrorScale: 2.0,
    maximumAttenuation: 4,
    pointBudget: 500000  // Half a million points
  }
};

/**
 * Applies fixed performance settings to a Cesium3DTileset
 * @param {Cesium3DTileset} tileset - The tileset to apply settings to
 * @param {Cesium.Viewer} viewer - The Cesium viewer instance
 */
export function applyFixedSettings(tileset, viewer) {
  if (!tileset) return;
  
  // Get settings based on the chosen preset
  const settings = PERFORMANCE_SETTINGS[PERFORMANCE_PRESET];
  
  // === FRUSTUM CULLING SPECIFIC SETTINGS ===
  // These settings control how aggressively tiles are unloaded when not in view
  
  // Core culling settings
  tileset.cullWithChildrenBounds = ENABLE_FRUSTUM_CULLING;
  tileset.maximumMemoryUsage = ENABLE_FRUSTUM_CULLING ? settings.maximumMemoryUsage : 10000; // Higher value when disabled
  
  // Force immediate unloading of tiles outside frustum
  tileset.cacheBytes = CACHE_BYTES;
  tileset.maximumCacheSize = ENABLE_FRUSTUM_CULLING ? 10 : 1000; // Keep fewer tiles in cache when culling enabled
  
  // These settings affect how culling works in combination with LOD
  tileset.skipLevelOfDetail = ENABLE_FRUSTUM_CULLING;
  tileset.immediatelyLoadDesiredLevelOfDetail = ENABLE_FRUSTUM_CULLING;
  tileset.loadSiblings = !ENABLE_FRUSTUM_CULLING; // Don't load siblings when culling enabled
  
  // Never preload tiles outside view when culling is enabled
  tileset.preloadWhenHidden = !ENABLE_FRUSTUM_CULLING;
  tileset.preloadFlightDestinations = !ENABLE_FRUSTUM_CULLING;
  tileset.cullRequestsWhileMoving = ENABLE_FRUSTUM_CULLING;
  tileset.foveatedTimeDelay = 0; // Immediate culling with no delay
  
  // Add debug visualization if enabled
  if (viewer) {
    viewer.scene.debugShowFrustumPlanes = DEBUG_SHOW_FRUSTUM_CULLING && ENABLE_FRUSTUM_CULLING;
    // Additional debugging
    viewer.scene.debugShowFrustums = DEBUG_SHOW_FRUSTUM_CULLING && ENABLE_FRUSTUM_CULLING;
    viewer.scene.debugShowFrustumCulling = DEBUG_SHOW_FRUSTUM_CULLING && ENABLE_FRUSTUM_CULLING;
  }
  
  // === OTHER PERFORMANCE SETTINGS ===
  
  // Apply core tileset settings
  tileset.maximumScreenSpaceError = settings.maximumScreenSpaceError;
  
  // Dynamic screen space error settings
  tileset.dynamicScreenSpaceError = true;
  tileset.dynamicScreenSpaceErrorDensity = settings.dynamicScreenSpaceErrorDensity;
  tileset.dynamicScreenSpaceErrorFactor = settings.dynamicScreenSpaceErrorFactor;
  
  // Foveated rendering settings
  tileset.foveatedScreenSpaceError = true;
  tileset.foveatedConeSize = settings.foveatedConeSize;
  
  // Point cloud shading settings
  tileset.pointCloudShading = new PointCloudShading({
    attenuation: true,
    geometricErrorScale: settings.geometricErrorScale,
    maximumAttenuation: settings.maximumAttenuation,
    eyeDomeLighting: true,
    eyeDomeLightingStrength: 0.7,
    eyeDomeLightingRadius: 1.0
  });
  
  // Apply point budget
  if (tileset.hasOwnProperty('maximumMemoryUsage')) {
    tileset.maximumMemoryUsage = settings.maximumMemoryUsage;
  }
  
  // Apply point budget limitation - different properties depending on the Cesium version
  if (tileset.pointCloudShading && settings.pointBudget) {
    // When pointCloudShading is accessible, use maximumPointSize
    if (typeof tileset.pointCloudShading.maximumPointSize === 'number') {
      tileset.pointCloudShading.maximumPointSize = settings.pointBudget;
    }
  }
  
  // Also try to set maximumPointsNodeSize if it exists (some Cesium versions)
  if (typeof tileset.maximumPointsNodeSize !== 'undefined') {
    tileset.maximumPointsNodeSize = settings.pointBudget;
  }
  
  // Other optimizations
  tileset.preferLeaves = true;
  tileset.progressiveResolutionHeightFraction = 0.5;
  
  console.log(`Applied ${PERFORMANCE_PRESET} performance settings to tileset with frustum culling ${ENABLE_FRUSTUM_CULLING ? 'ENABLED' : 'DISABLED'}`);
}

/**
 * Get the tileset creation options with predefined performance settings
 * @returns {Object} Tileset creation options
 */
export function getTilesetOptions() {
  const settings = PERFORMANCE_SETTINGS[PERFORMANCE_PRESET];
  
  return {
    // Performance Settings
    maximumScreenSpaceError: settings.maximumScreenSpaceError,
    maximumMemoryUsage: settings.maximumMemoryUsage,
    
    // Dynamic Screen Space Error
    dynamicScreenSpaceError: true,
    dynamicScreenSpaceErrorDensity: settings.dynamicScreenSpaceErrorDensity,
    dynamicScreenSpaceErrorFactor: settings.dynamicScreenSpaceErrorFactor,
    
    // Foveated rendering
    foveatedScreenSpaceError: true,
    foveatedConeSize: settings.foveatedConeSize,
    
    // Frustum culling settings
    cullWithChildrenBounds: ENABLE_FRUSTUM_CULLING,
    skipLevelOfDetail: ENABLE_FRUSTUM_CULLING,
    immediatelyLoadDesiredLevelOfDetail: ENABLE_FRUSTUM_CULLING,
    loadSiblings: !ENABLE_FRUSTUM_CULLING,
    cacheBytes: CACHE_BYTES,
    maximumCacheSize: ENABLE_FRUSTUM_CULLING ? 10 : 1000,
    preloadWhenHidden: !ENABLE_FRUSTUM_CULLING,
    
    // Point cloud specific settings
    pointCloudShading: {
      attenuation: true,
      geometricErrorScale: settings.geometricErrorScale,
      maximumAttenuation: settings.maximumAttenuation,
      eyeDomeLighting: true,
      eyeDomeLightingStrength: 0.7
    }
  };
}

/**
 * Toggle frustum culling at runtime for testing purposes
 * @param {Cesium.Viewer} viewer - The Cesium viewer instance
 * @param {boolean} enable - Whether to enable or disable frustum culling
 * @param {boolean} [showDebugVisualization=false] - Whether to show red debug visualization
 */
export function toggleFrustumCullingForTesting(viewer, enable, showDebugVisualization = false) {
  if (!viewer) return;
  
  // Update global setting
  ENABLE_FRUSTUM_CULLING = enable;
  console.log(`Toggling frustum culling to: ${enable ? 'ON' : 'OFF'}`);
  
  // Force all tilesets to trim their caches 
  if (enable) {
    viewer.scene.primitives._primitives.forEach(primitive => {
      if (primitive && primitive.trimLoadedTiles) {
        primitive.trimLoadedTiles();
      }
    });
  }
  
  // Apply to all tilesets in the scene
  viewer.scene.primitives._primitives.forEach(primitive => {
    if (primitive && primitive.constructor && primitive.constructor.name === 'Cesium3DTileset') {
      applyFixedSettings(primitive, viewer);
      
      // Force the tileset to update its cache
      if (primitive.tileLoad) {
        primitive.tileLoad.raiseEvent = function() {};
        primitive.tileUnload.raiseEvent = function() {};
      }
      
      console.log(`Applied frustum culling setting (${enable ? 'ON' : 'OFF'}) to tileset`);
    }
  });
  
  // Toggle debug visualization only if explicitly requested
  viewer.scene.debugShowFrustumPlanes = showDebugVisualization && enable;
  viewer.scene.debugShowFrustums = showDebugVisualization && enable;
  viewer.scene.debugShowFrustumCulling = showDebugVisualization && enable;
  
  // Force a scene update
  viewer.scene.requestRender();
  
  // Notify any registered callbacks about the settings change
  notifySettingsChanged();
}

/**
 * Switch to a different performance preset and apply to all tilesets
 * @param {string} preset - The preset to switch to ('ultra', 'high', 'medium', 'low')
 * @param {Cesium.Viewer} viewer - The Cesium viewer instance
 * @returns {boolean} Whether the switch was successful
 */
export function switchPerformancePreset(preset, viewer) {
  if (!AVAILABLE_PRESETS.includes(preset)) {
    console.error(`Invalid preset: ${preset}. Must be one of: ${AVAILABLE_PRESETS.join(', ')}`);
    return false;
  }
  
  // Update the current preset
  PERFORMANCE_PRESET = preset;
  console.log(`Switched to ${preset.toUpperCase()} performance preset`);
  
  // Apply to all tilesets in the scene
  if (viewer) {
    viewer.scene.primitives._primitives.forEach(primitive => {
      if (primitive && primitive.constructor && primitive.constructor.name === 'Cesium3DTileset') {
        applyFixedSettings(primitive, viewer);
      }
    });
    
    // Force a scene update
    viewer.scene.requestRender();
  }
  
  // Notify any registered callbacks about the settings change
  notifySettingsChanged();
  
  return true;
}

/**
 * Cycle to the next or previous performance preset
 * @param {Cesium.Viewer} viewer - The Cesium viewer instance
 * @param {boolean} [next=true] - Whether to cycle to the next (true) or previous (false) preset
 * @returns {string} The new preset
 */
export function cyclePerformancePreset(viewer, next = true) {
  const currentIndex = AVAILABLE_PRESETS.indexOf(PERFORMANCE_PRESET);
  let newIndex;
  
  if (next) {
    // Cycle to next preset (wrapping around to the start if necessary)
    newIndex = (currentIndex + 1) % AVAILABLE_PRESETS.length;
  } else {
    // Cycle to previous preset (wrapping around to the end if necessary)
    newIndex = (currentIndex - 1 + AVAILABLE_PRESETS.length) % AVAILABLE_PRESETS.length;
  }
  
  const newPreset = AVAILABLE_PRESETS[newIndex];
  switchPerformancePreset(newPreset, viewer);
  return newPreset;
} 