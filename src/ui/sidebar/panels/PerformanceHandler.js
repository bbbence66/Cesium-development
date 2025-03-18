/**
 * PerformanceHandler.js
 * 
 * Implements functionality for the Performance panel, connecting
 * UI controls to Cesium performance settings.
 */

import { PointCloudShading } from "cesium";

/**
 * Initialize Performance Panel functionality
 * @param {Object} viewer - The Cesium viewer instance
 */
export function initializePerformancePanel(viewer) {
  // Get all the UI elements
  const fpsValue = document.getElementById('fps-value');
  const memoryValue = document.getElementById('memory-value');
  const pointsValue = document.getElementById('points-value');
  const trianglesValue = document.getElementById('triangles-value');
  
  // Basic settings
  const qualityPresetSelect = document.getElementById('quality-preset');
  const pointBudgetSlider = document.getElementById('point-budget');
  const lodFactorSlider = document.getElementById('lod-factor');
  
  // Advanced settings
  const maxScreenSpaceErrorSlider = document.getElementById('max-screen-space-error');
  const maxMemoryUsageSlider = document.getElementById('max-memory-usage');
  const dynamicSseDensitySlider = document.getElementById('dynamic-sse-density');
  const dynamicSseFactorSlider = document.getElementById('dynamic-sse-factor');
  
  // Optimization checkboxes
  const frustumCullingCheckbox = document.getElementById('opt-frustum-culling');
  const hardwareAccelerationCheckbox = document.getElementById('opt-hardware-acceleration');
  const textureCompressionCheckbox = document.getElementById('opt-texture-compression');
  const shaderCachingCheckbox = document.getElementById('opt-shader-caching');
  const foveatedRenderingCheckbox = document.getElementById('opt-foveated-rendering');
  
  // Buttons
  const applyButton = document.querySelector('.performance-button:not(.secondary)');
  const resetButton = document.querySelector('.performance-button.secondary');
  
  // Initialize range slider value displays
  initializeSliderValueDisplays();
  
  // Update performance statistics display
  function updateStats() {
    if (!viewer || !viewer.scene) return;
    
    // Calculate FPS
    const fps = Math.round(viewer.scene.frameState.frameNumber % 60);
    if (fpsValue) fpsValue.textContent = `${fps}`;
    
    // Memory usage estimate
    // This is a rough approximation - real memory usage would require more detailed tracking
    const approximateMemoryMb = Math.round(
      viewer.scene.primitives._primitives.reduce(
        (total, primitive) => 
          total + (primitive.geometryByteLength || 0) + (primitive.texturesByteLength || 0), 
        0
      ) / (1024 * 1024)
    );
    
    if (memoryValue) memoryValue.textContent = `${approximateMemoryMb} MB`;
    
    // Approximate point count
    let totalPoints = 0;
    viewer.scene.primitives._primitives.forEach(primitive => {
      if (primitive && primitive.constructor.name === 'Cesium3DTileset') {
        // For 3D tilesets, use statistics if available
        if (primitive.statistics && primitive.statistics.pointsLength) {
          totalPoints += primitive.statistics.pointsLength;
        }
      }
    });
    
    const formattedPoints = totalPoints > 1000000 
      ? `${(totalPoints / 1000000).toFixed(1)}M` 
      : totalPoints > 1000 
        ? `${(totalPoints / 1000).toFixed(1)}K` 
        : totalPoints;
    
    if (pointsValue) pointsValue.textContent = formattedPoints;
    
    // Approximate triangle count
    const triangles = Math.round(viewer.scene.globe.tilesToRender.length * 1000 + 
                                viewer.scene.primitives.length * 2000);
    const formattedTriangles = triangles > 1000000 
      ? `${(triangles / 1000000).toFixed(1)}M` 
      : triangles > 1000 
        ? `${(triangles / 1000).toFixed(1)}K` 
        : triangles;
    
    if (trianglesValue) trianglesValue.textContent = formattedTriangles;
    
    // Continue updating stats
    requestAnimationFrame(updateStats);
  }
  
  // Initialize slider value displays
  function initializeSliderValueDisplays() {
    // For each slider with a value display, update the display when the slider changes
    const slidersWithDisplays = [
      { slider: pointBudgetSlider, format: val => `${(parseInt(val) / 1000000).toFixed(1)}M` },
      { slider: lodFactorSlider, format: val => val },
      { slider: maxScreenSpaceErrorSlider, format: val => val },
      { slider: maxMemoryUsageSlider, format: val => `${val} MB` },
      { slider: dynamicSseDensitySlider, format: val => val },
      { slider: dynamicSseFactorSlider, format: val => val }
    ];
    
    slidersWithDisplays.forEach(({ slider, format }) => {
      if (slider) {
        const valueDisplay = slider.nextElementSibling;
        if (valueDisplay && valueDisplay.classList.contains('value-display')) {
          // Set initial value
          valueDisplay.textContent = format(slider.value);
          
          // Update when slider changes
          slider.addEventListener('input', () => {
            valueDisplay.textContent = format(slider.value);
          });
        }
      }
    });
  }
  
  // Apply settings to visual preset selector
  function setPresetBasedOnValues() {
    if (!qualityPresetSelect) return;
    
    const screenSpaceError = parseInt(maxScreenSpaceErrorSlider?.value || 32);
    
    // Determine which preset matches the current values
    if (screenSpaceError <= 8) {
      qualityPresetSelect.value = 'ultra';
    } else if (screenSpaceError <= 16) {
      qualityPresetSelect.value = 'high';
    } else if (screenSpaceError <= 24) {
      qualityPresetSelect.value = 'medium';
    } else if (screenSpaceError <= 32) {
      qualityPresetSelect.value = 'low';
    } else {
      qualityPresetSelect.value = 'custom';
    }
  }
  
  // Update advanced settings when preset changes
  function updateAdvancedSettingsFromPreset() {
    if (!qualityPresetSelect) return;
    
    const preset = qualityPresetSelect.value;
    
    // Set values based on preset
    switch (preset) {
      case 'ultra':
        if (maxScreenSpaceErrorSlider) maxScreenSpaceErrorSlider.value = 8;
        if (maxMemoryUsageSlider) maxMemoryUsageSlider.value = 1024;
        if (dynamicSseDensitySlider) dynamicSseDensitySlider.value = 0.00002;
        if (dynamicSseFactorSlider) dynamicSseFactorSlider.value = 4;
        break;
      case 'high':
        if (maxScreenSpaceErrorSlider) maxScreenSpaceErrorSlider.value = 16;
        if (maxMemoryUsageSlider) maxMemoryUsageSlider.value = 512;
        if (dynamicSseDensitySlider) dynamicSseDensitySlider.value = 0.00004;
        if (dynamicSseFactorSlider) dynamicSseFactorSlider.value = 4;
        break;
      case 'medium':
        if (maxScreenSpaceErrorSlider) maxScreenSpaceErrorSlider.value = 24;
        if (maxMemoryUsageSlider) maxMemoryUsageSlider.value = 256;
        if (dynamicSseDensitySlider) dynamicSseDensitySlider.value = 0.00006;
        if (dynamicSseFactorSlider) dynamicSseFactorSlider.value = 6;
        break;
      case 'low':
        if (maxScreenSpaceErrorSlider) maxScreenSpaceErrorSlider.value = 32;
        if (maxMemoryUsageSlider) maxMemoryUsageSlider.value = 128;
        if (dynamicSseDensitySlider) dynamicSseDensitySlider.value = 0.00008;
        if (dynamicSseFactorSlider) dynamicSseFactorSlider.value = 8;
        break;
      case 'custom':
        // Do nothing, keep current values
        break;
    }
    
    // Update value displays
    updateSliderDisplays();
  }
  
  // Update slider displays without changing values
  function updateSliderDisplays() {
    if (maxScreenSpaceErrorSlider) {
      const display = maxScreenSpaceErrorSlider.nextElementSibling;
      if (display) display.textContent = maxScreenSpaceErrorSlider.value;
    }
    
    if (maxMemoryUsageSlider) {
      const display = maxMemoryUsageSlider.nextElementSibling;
      if (display) display.textContent = `${maxMemoryUsageSlider.value} MB`;
    }
    
    if (dynamicSseDensitySlider) {
      const display = dynamicSseDensitySlider.nextElementSibling;
      if (display) display.textContent = dynamicSseDensitySlider.value;
    }
    
    if (dynamicSseFactorSlider) {
      const display = dynamicSseFactorSlider.nextElementSibling;
      if (display) display.textContent = dynamicSseFactorSlider.value;
    }
  }
  
  // Set up event listeners
  if (qualityPresetSelect) {
    qualityPresetSelect.addEventListener('change', updateAdvancedSettingsFromPreset);
  }
  
  // For advanced settings, set preset to "custom" when they're adjusted
  const advancedSliders = [
    maxScreenSpaceErrorSlider,
    maxMemoryUsageSlider,
    dynamicSseDensitySlider,
    dynamicSseFactorSlider
  ];
  
  advancedSliders.forEach(slider => {
    if (slider) {
      slider.addEventListener('input', () => {
        if (qualityPresetSelect) qualityPresetSelect.value = 'custom';
      });
    }
  });
  
  // Initialize stats update
  updateStats();
  
  // Apply performance settings to all tilesets
  function applyPerformanceSettings() {
    if (!viewer || !viewer.scene) return;
    
    console.log('Applying performance settings...');
    
    // Get values from UI
    const qualityPreset = qualityPresetSelect?.value || 'high';
    const pointBudget = parseInt(pointBudgetSlider?.value || 2000000);
    const lodFactor = parseFloat(lodFactorSlider?.value || 1.0);
    
    // Advanced settings
    const screenSpaceError = parseInt(maxScreenSpaceErrorSlider?.value || 32);
    const memoryLimit = parseInt(maxMemoryUsageSlider?.value || 256);
    const dynamicDensity = parseFloat(dynamicSseDensitySlider?.value || 0.00006);
    const dynamicFactor = parseInt(dynamicSseFactorSlider?.value || 6);
    
    // Optimization checkboxes
    const useFrustumCulling = frustumCullingCheckbox?.checked !== false;
    const useHardwareAcceleration = hardwareAccelerationCheckbox?.checked !== false;
    const useTextureCompression = textureCompressionCheckbox?.checked !== false;
    const useShaderCaching = shaderCachingCheckbox?.checked !== false;
    const useFoveatedRendering = foveatedRenderingCheckbox?.checked !== false;
    
    // Apply settings to all tilesets
    viewer.scene.primitives._primitives.forEach(primitive => {
      if (primitive && primitive.constructor.name === 'Cesium3DTileset') {
        // Screen space error
        primitive.maximumScreenSpaceError = screenSpaceError;
        
        // Memory usage
        primitive.maximumMemoryUsage = memoryLimit;
        
        // Dynamic screen space error settings
        primitive.dynamicScreenSpaceError = true;
        primitive.dynamicScreenSpaceErrorDensity = dynamicDensity;
        primitive.dynamicScreenSpaceErrorFactor = dynamicFactor;
        
        // Foveated rendering
        primitive.foveatedScreenSpaceError = useFoveatedRendering;
        primitive.foveatedConeSize = 0.1 / lodFactor;
        
        // Point cloud shading settings
        if (primitive.pointCloudShading) {
          primitive.pointCloudShading = new PointCloudShading({
            attenuation: true,
            geometricErrorScale: 0.5 * lodFactor,
            maximumAttenuation: useHardwareAcceleration ? 8 : 4,
            eyeDomeLighting: true,
            eyeDomeLightingStrength: 0.7,
            eyeDomeLightingRadius: 1.0
          });
        }
        
        // Additional settings
        if (typeof primitive.cullWithChildrenBounds !== 'undefined') {
          primitive.cullWithChildrenBounds = useFrustumCulling;
        }
        
        if (typeof primitive.preloadWhenHidden !== 'undefined') {
          primitive.preloadWhenHidden = false; // Always disable for performance
        }
        
        if (typeof primitive.progressiveResolutionHeightFraction !== 'undefined') {
          primitive.progressiveResolutionHeightFraction = 0.5; // Better performance
        }
        
        if (typeof primitive.preferLeaves !== 'undefined') {
          primitive.preferLeaves = true; // Better for point clouds
        }
        
        console.log(`Applied performance settings to tileset with SSE=${screenSpaceError}, memory=${memoryLimit}MB`);
      }
    });
    
    // Apply global scene settings
    if (viewer.scene) {
      viewer.scene.useWebVR = useHardwareAcceleration;
      
      if (viewer.scene.globe) {
        viewer.scene.globe.enableLighting = false; // Disable for performance
        viewer.scene.globe.showGroundAtmosphere = false; // Disable for performance
      }
      
      if (viewer.scene.fog) {
        viewer.scene.fog.enabled = false; // Disable for performance
      }
    }
    
    // Show confirmation
    showNotification('Performance settings applied');
  }
  
  // Apply settings when button is clicked
  if (applyButton) {
    applyButton.addEventListener('click', applyPerformanceSettings);
  }
  
  // Reset to defaults
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      // Reset UI controls to defaults
      if (qualityPresetSelect) qualityPresetSelect.value = 'high';
      if (pointBudgetSlider) pointBudgetSlider.value = 2000000;
      if (lodFactorSlider) lodFactorSlider.value = 1;
      
      // Reset advanced settings
      if (maxScreenSpaceErrorSlider) maxScreenSpaceErrorSlider.value = 16;
      if (maxMemoryUsageSlider) maxMemoryUsageSlider.value = 512;
      if (dynamicSseDensitySlider) dynamicSseDensitySlider.value = 0.00004;
      if (dynamicSseFactorSlider) dynamicSseFactorSlider.value = 4;
      
      // Reset optimization checkboxes
      if (frustumCullingCheckbox) frustumCullingCheckbox.checked = true;
      if (hardwareAccelerationCheckbox) hardwareAccelerationCheckbox.checked = true;
      if (textureCompressionCheckbox) textureCompressionCheckbox.checked = true;
      if (shaderCachingCheckbox) shaderCachingCheckbox.checked = true;
      if (foveatedRenderingCheckbox) foveatedRenderingCheckbox.checked = true;
      
      // Update displays
      updateSliderDisplays();
      
      // Apply default settings
      applyPerformanceSettings();
      
      showNotification('Performance settings reset to defaults');
    });
  }
}

/**
 * Show a notification message
 * @param {string} message - The message to show
 */
function showNotification(message) {
  // Create notification element
  const notificationElement = document.createElement('div');
  notificationElement.className = 'sidebar-notification';
  notificationElement.textContent = message;
  
  // Add to body
  document.body.appendChild(notificationElement);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notificationElement.classList.add('fade-out');
    setTimeout(() => {
      if (notificationElement.parentNode) {
        notificationElement.parentNode.removeChild(notificationElement);
      }
    }, 500);
  }, 3000);
} 