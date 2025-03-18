/**
 * PerformanceInfoDisplay.js
 * Creates a simple UI element to display current performance settings
 */

import { PERFORMANCE_PRESET, ENABLE_FRUSTUM_CULLING, onSettingsChange, offSettingsChange } from '../utils/FixedPerformanceSettings';

// Style for the performance info display
const DISPLAY_STYLE = `
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-family: 'Arial', sans-serif;
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  z-index: 1000;
  user-select: none;
  pointer-events: none;
`;

// Style for keyboard shortcuts display
const SHORTCUTS_STYLE = `
  font-size: 11px;
  opacity: 0.8;
  margin-top: 5px;
`;

/**
 * Creates and adds a performance info display to the DOM
 * @param {Cesium.Viewer} viewer - The Cesium viewer instance
 * @returns {HTMLElement} The created display element
 */
export function createPerformanceInfoDisplay(viewer) {
  // Create performance info element
  const infoDisplay = document.createElement('div');
  infoDisplay.id = 'performance-info-display';
  infoDisplay.style.cssText = DISPLAY_STYLE;
  
  // Add to body
  document.body.appendChild(infoDisplay);
  
  // Update the display contents initially
  updatePerformanceInfoDisplay(infoDisplay);
  
  // Create a settings change handler
  const handleSettingsChange = () => {
    updatePerformanceInfoDisplay(infoDisplay);
  };
  
  // Register for settings change notifications
  onSettingsChange(handleSettingsChange);
  
  // Also set up a polling update as a fallback
  const intervalId = setInterval(handleSettingsChange, 2000);
  
  // Clean up when viewer is destroyed
  viewer.scene.postRender.addEventListener(() => {
    if (!viewer.isDestroyed()) return;
    
    // Clean up when viewer is destroyed
    clearInterval(intervalId);
    offSettingsChange(handleSettingsChange);
    
    if (infoDisplay.parentNode) {
      infoDisplay.parentNode.removeChild(infoDisplay);
    }
  });
  
  return infoDisplay;
}

/**
 * Updates the performance info display contents
 * @param {HTMLElement} infoDisplay - The display element to update
 */
function updatePerformanceInfoDisplay(infoDisplay) {
  // Create content with the current preset and settings
  const presetContent = `
    <div>
      <strong>Performance:</strong> ${PERFORMANCE_PRESET.toUpperCase()}
      <span style="opacity: 0.8; margin-left: 8px;">
        Frustum Culling: ${ENABLE_FRUSTUM_CULLING ? 'ON' : 'OFF'}
      </span>
    </div>
    <div style="${SHORTCUTS_STYLE}">
      [1-4]: Presets | [+/-]: Cycle | [F]: Culling | [C]: Clear Cache
    </div>
  `;
  
  // Update the display
  infoDisplay.innerHTML = presetContent;
} 