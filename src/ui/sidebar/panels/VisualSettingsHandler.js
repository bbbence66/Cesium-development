/**
 * VisualSettingsHandler.js
 * 
 * Implements functionality for the Visual Settings panel, connecting
 * UI controls to Cesium APIs for visual customization.
 */

import {
  Color,
  Math as CesiumMath,
  PointCloudShading
} from "cesium";

/**
 * Initialize Visual Settings Panel functionality
 * @param {Object} viewer - The Cesium viewer instance
 */
export function initializeVisualSettings(viewer) {
  // Get all the UI elements
  const ambientLightSlider = document.getElementById('ambient-light');
  const shadowDarknessSlider = document.getElementById('shadow-darkness');
  const pointSizeSlider = document.getElementById('point-size');
  const pointBrightnessSlider = document.getElementById('point-brightness');
  const pointClassificationCheckbox = document.getElementById('point-classification-colors');
  
  const bgSkyRadio = document.getElementById('bg-sky');
  const bgGradientRadio = document.getElementById('bg-gradient');
  const bgSolidRadio = document.getElementById('bg-solid');
  const bgColorPicker = document.getElementById('bg-color');
  
  const fovSlider = document.getElementById('fov');
  const cameraInertiaCheckbox = document.getElementById('camera-inertia');
  
  const applyButton = document.querySelector('.settings-button.primary');
  const resetButton = document.querySelector('.settings-button:not(.primary)');
  
  // Update FOV display value when slider changes
  if (fovSlider) {
    fovSlider.addEventListener('input', () => {
      const valueDisplay = document.querySelector('#fov + .value-display');
      if (valueDisplay) {
        valueDisplay.textContent = `${fovSlider.value}°`;
      }
    });
  }
  
  // Apply settings when button is clicked
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      // Apply point cloud settings
      applyPointCloudSettings(
        viewer,
        parseInt(pointSizeSlider?.value || 3),
        parseInt(pointBrightnessSlider?.value || 70),
        pointClassificationCheckbox?.checked || true
      );
      
      // Apply lighting settings
      applyLightingSettings(
        viewer,
        parseInt(ambientLightSlider?.value || 50),
        parseInt(shadowDarknessSlider?.value || 30)
      );
      
      // Apply background settings
      let bgMode = 'sky';
      if (bgGradientRadio?.checked) bgMode = 'gradient';
      if (bgSolidRadio?.checked) bgMode = 'solid';
      
      applyBackgroundSettings(
        viewer,
        bgMode,
        bgColorPicker?.value || '#87CEEB'
      );
      
      // Apply camera settings
      applyCameraSettings(
        viewer,
        parseInt(fovSlider?.value || 60),
        cameraInertiaCheckbox?.checked || true
      );
      
      // Show confirmation message
      showNotification('Settings applied successfully');
    });
  }
  
  // Reset to defaults
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      // Reset all UI controls to defaults
      if (ambientLightSlider) ambientLightSlider.value = 50;
      if (shadowDarknessSlider) shadowDarknessSlider.value = 30;
      if (pointSizeSlider) pointSizeSlider.value = 3;
      if (pointBrightnessSlider) pointBrightnessSlider.value = 70;
      if (pointClassificationCheckbox) pointClassificationCheckbox.checked = true;
      
      if (bgSkyRadio) bgSkyRadio.checked = true;
      if (bgGradientRadio) bgGradientRadio.checked = false;
      if (bgSolidRadio) bgSolidRadio.checked = false;
      if (bgColorPicker) bgColorPicker.value = '#87CEEB';
      
      if (fovSlider) {
        fovSlider.value = 60;
        const valueDisplay = document.querySelector('#fov + .value-display');
        if (valueDisplay) valueDisplay.textContent = '60°';
      }
      if (cameraInertiaCheckbox) cameraInertiaCheckbox.checked = true;
      
      // Apply the default settings
      if (applyButton) applyButton.click();
      else {
        // Apply defaults directly if button not found
        applyDefaultSettings(viewer);
      }
      
      showNotification('Settings reset to defaults');
    });
  }
}

/**
 * Apply default settings directly to the viewer
 * @param {Object} viewer - The Cesium viewer instance
 */
function applyDefaultSettings(viewer) {
  applyPointCloudSettings(viewer, 3, 70, true);
  applyLightingSettings(viewer, 50, 30);
  applyBackgroundSettings(viewer, 'sky', '#87CEEB');
  applyCameraSettings(viewer, 60, true);
}

/**
 * Apply point cloud settings to all point cloud tilesets
 * @param {Object} viewer - The Cesium viewer instance
 * @param {number} pointSize - Size of points (1-10)
 * @param {number} brightness - Brightness of points (0-100)
 * @param {boolean} useClassificationColors - Whether to use classification colors
 */
function applyPointCloudSettings(viewer, pointSize, brightness, useClassificationColors) {
  if (!viewer || !viewer.scene) return;
  
  console.log(`Applying point cloud settings: size=${pointSize}, brightness=${brightness}, useClassification=${useClassificationColors}`);
  
  // Get all point cloud tilesets
  viewer.scene.primitives._primitives.forEach(primitive => {
    if (primitive && primitive.constructor.name === 'Cesium3DTileset') {
      // Create or update point cloud shading
      primitive.pointCloudShading = new PointCloudShading({
        // Point size control (attenuation affects how points are sized based on distance)
        attenuation: true,
        // This affects the apparent size of points
        geometricErrorScale: pointSize * 0.5, 
        
        // Brightness/visual quality controls
        eyeDomeLighting: true,
        eyeDomeLightingStrength: brightness / 100.0, // Convert slider 0-100 to 0-1
        eyeDomeLightingRadius: 1.0 + (brightness / 50.0), // Adjust radius based on brightness
        
        // Classification colors (you'd need custom styling here)
        normalShading: useClassificationColors,
      });
    }
  });
}

/**
 * Apply lighting settings to the scene
 * @param {Object} viewer - The Cesium viewer instance 
 * @param {number} ambientLightIntensity - Ambient light intensity (0-100)
 * @param {number} shadowDarkness - Shadow darkness (0-100)
 */
function applyLightingSettings(viewer, ambientLightIntensity, shadowDarkness) {
  if (!viewer || !viewer.scene) return;
  
  console.log(`Applying lighting settings: ambient=${ambientLightIntensity}, shadows=${shadowDarkness}`);
  
  // Adjust scene brightness (affects ambient light)
  viewer.scene.brightness = ambientLightIntensity / 100.0;
  
  // Adjust shadows (if enabled)
  if (viewer.shadowMap) {
    viewer.shadowMap.darkness = 1.0 - (shadowDarkness / 100.0);
    viewer.shadowMap.enabled = shadowDarkness > 10; // Disable if too low
  }
  
  // You might also adjust the directional light intensity
  if (viewer.scene.light) {
    viewer.scene.light.intensity = 2.0 * (ambientLightIntensity / 100.0);
  }
}

/**
 * Apply background settings to the scene
 * @param {Object} viewer - The Cesium viewer instance
 * @param {string} mode - 'sky', 'gradient', or 'solid'
 * @param {string} bgColor - CSS color string
 */
function applyBackgroundSettings(viewer, mode, bgColor) {
  if (!viewer || !viewer.scene) return;
  
  console.log(`Applying background settings: mode=${mode}, color=${bgColor}`);
  
  // Convert hex color to Cesium Color
  const cesiumColor = Color.fromCssColorString(bgColor);
  
  switch(mode) {
    case 'sky':
      // Enable sky atmosphere
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = true;
      }
      viewer.scene.backgroundColor = undefined; // Use default
      if (viewer.scene.globe) {
        viewer.scene.globe.showGroundAtmosphere = true;
      }
      if (viewer.scene.skyBox) {
        viewer.scene.skyBox.show = true;
      }
      break;
      
    case 'gradient':
      // Disable sky atmosphere but keep a gradient
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = false;
      }
      viewer.scene.backgroundColor = cesiumColor;
      if (viewer.scene.skyBox) {
        viewer.scene.skyBox.show = false;
      }
      // Create a gradient with fog at the horizon
      if (viewer.scene.fog) {
        viewer.scene.fog.enabled = true;
        viewer.scene.fog.density = 0.0002;
        viewer.scene.fog.screenSpaceErrorFactor = 4.0;
      }
      break;
      
    case 'solid':
      // Just a solid color
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = false;
      }
      viewer.scene.backgroundColor = cesiumColor;
      if (viewer.scene.skyBox) {
        viewer.scene.skyBox.show = false;
      }
      if (viewer.scene.fog) {
        viewer.scene.fog.enabled = false;
      }
      break;
  }
}

/**
 * Apply camera settings
 * @param {Object} viewer - The Cesium viewer instance
 * @param {number} fov - Field of view in degrees
 * @param {boolean} enableInertia - Whether to enable camera inertia
 */
function applyCameraSettings(viewer, fov, enableInertia) {
  if (!viewer || !viewer.camera || !viewer.scene) return;
  
  console.log(`Applying camera settings: fov=${fov}°, inertia=${enableInertia}`);
  
  // Set field of view (in radians)
  if (viewer.camera.frustum && typeof viewer.camera.frustum.fov !== 'undefined') {
    viewer.camera.frustum.fov = CesiumMath.toRadians(fov);
  }
  
  // Set camera inertia
  if (viewer.scene.screenSpaceCameraController) {
    const controller = viewer.scene.screenSpaceCameraController;
    const inertiaValue = enableInertia ? 0.9 : 0.0; // 0 = no inertia, higher = more inertia
    
    if (typeof controller.inertiaFactor !== 'undefined') {
      controller.inertiaFactor = inertiaValue;
    }
    if (typeof controller.inertiaSpin !== 'undefined') {
      controller.inertiaSpin = inertiaValue;
    }
    if (typeof controller.inertiaTranslate !== 'undefined') {
      controller.inertiaTranslate = inertiaValue;
    }
  }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.settings-notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'settings-notification';
  notification.textContent = message;
  
  // Add styles if not defined in CSS
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 15px';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  notification.style.color = 'white';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '9999';
  notification.style.transition = 'opacity 0.5s';
  
  document.body.appendChild(notification);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 2000);
}

export default initializeVisualSettings; 