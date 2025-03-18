/**
 * PerformancePanel.js
 * Panel for controlling performance settings of the scene.
 */

import { AVAILABLE_PRESETS } from '../../../utils/FixedPerformanceSettings';
import { FrameRateMonitor } from '../../../utils/FrameRateMonitor';

// Global frame rate monitor instance
let frameRateMonitor = null;

/**
 * Generates the HTML content for the Performance panel
 * @returns {string} HTML content
 */
export function getPerformancePanelContent(viewer) {
  // Create frame rate monitor if it doesn't exist
  if (!frameRateMonitor && viewer) {
    frameRateMonitor = new FrameRateMonitor(viewer, {
      targetFPS: 30,
      onPresetChange: (preset) => {
        // Update UI when preset changes automatically
        const presetButtons = document.querySelectorAll('.preset-button');
        presetButtons.forEach(button => {
          button.classList.toggle('active', button.dataset.preset === preset);
        });
        
        // Show notification
        showNotification(`Preset automatically changed to: ${preset}`);
      }
    });
  }

  return `
    <div class="performance-panel">
      <div class="performance-stats">
        <div class="stat-item">
          <span class="stat-label">FPS:</span>
          <span class="stat-value" id="fps-value">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Memory:</span>
          <span class="stat-value" id="memory-value">0 MB</span>
        </div>
      </div>
      
      <div class="sidebar-separator"></div>
      
      <h3>Quality Presets</h3>
      <div class="preset-buttons">
        ${AVAILABLE_PRESETS.map(preset => `
          <button class="preset-button" data-preset="${preset}">${preset}</button>
        `).join('')}
      </div>
      
      <div class="sidebar-separator"></div>
      
      <h3>Auto Performance</h3>
      <div class="auto-performance-controls">
        <div class="control-row">
          <span>Auto-adjust quality:</span>
          <label class="toggle-switch">
            <input type="checkbox" id="auto-performance-toggle">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="control-row">
          <span>Target FPS:</span>
          <input type="range" id="target-fps-slider" min="15" max="60" value="30" step="5">
          <span id="target-fps-value">30</span>
        </div>
      </div>
      
      <div class="sidebar-separator"></div>
      
      <h3>Advanced Settings</h3>
      <div class="advanced-settings">
        <div class="setting-row">
          <label for="max-sse-slider">Max Screen Space Error:</label>
          <div class="slider-container">
            <input type="range" id="max-sse-slider" min="1" max="128" value="16" step="1">
            <span id="max-sse-value">16</span>
          </div>
        </div>
        
        <div class="setting-row">
          <label for="max-memory-slider">Max Memory Usage (MB):</label>
          <div class="slider-container">
            <input type="range" id="max-memory-slider" min="32" max="2048" value="512" step="32">
            <span id="max-memory-value">512</span>
          </div>
        </div>
        
        <div class="setting-row">
          <label for="dynamic-sse-density-slider">Dynamic SSE Density:</label>
          <div class="slider-container">
            <input type="range" id="dynamic-sse-density-slider" min="0.00001" max="0.01" value="0.00278" step="0.00001">
            <span id="dynamic-sse-density-value">0.00278</span>
          </div>
        </div>
        
        <div class="setting-row">
          <label for="dynamic-sse-factor-slider">Dynamic SSE Factor:</label>
          <div class="slider-container">
            <input type="range" id="dynamic-sse-factor-slider" min="1" max="10" value="4" step="0.1">
            <span id="dynamic-sse-factor-value">4</span>
          </div>
        </div>
        
        <div class="setting-row">
          <label for="point-budget-slider">Point Budget:</label>
          <div class="slider-container">
            <input type="range" id="point-budget-slider" min="100000" max="10000000" value="1000000" step="100000">
            <span id="point-budget-value">1,000,000</span>
          </div>
        </div>
        
        <button id="apply-advanced-settings">Apply Settings</button>
        <button id="reset-advanced-settings">Reset to Preset</button>
      </div>
      
      <div class="sidebar-separator"></div>
      
      <div class="performance-actions">
        <button id="clear-cache-button">Clear Tile Cache</button>
        <button id="reload-tilesets-button">Reload Tilesets</button>
      </div>
    </div>
  `;
}

// Initialize performance panel functionality
export function initializePerformancePanel(viewer) {
  const fpsValueEl = document.getElementById('fps-value');
  const memoryValueEl = document.getElementById('memory-value');
  const presetButtons = document.querySelectorAll('.preset-button');
  const autoPerformanceToggle = document.getElementById('auto-performance-toggle');
  const targetFpsSlider = document.getElementById('target-fps-slider');
  const targetFpsValue = document.getElementById('target-fps-value');
  
  // Initialize frame rate monitor
  if (!frameRateMonitor && viewer) {
    frameRateMonitor = new FrameRateMonitor(viewer, {
      targetFPS: parseInt(targetFpsSlider.value, 10),
      onPresetChange: (preset) => {
        presetButtons.forEach(button => {
          button.classList.toggle('active', button.dataset.preset === preset);
        });
        showNotification(`Preset automatically changed to: ${preset}`);
      }
    });
  }
  
  // Update performance stats periodically
  const updateStats = () => {
    if (frameRateMonitor) {
      fpsValueEl.textContent = frameRateMonitor.getFPS().toFixed(1);
    }
    
    // Get memory usage if available
    if (window.performance && window.performance.memory) {
      const memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
      memoryValueEl.textContent = `${memoryUsage} MB`;
    }
    
    requestAnimationFrame(updateStats);
  };
  
  updateStats();
  
  // Initialize preset buttons
  presetButtons.forEach(button => {
    button.addEventListener('click', () => {
      const preset = button.dataset.preset;
      
      // Update UI
      presetButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Apply preset
      import('../../../utils/FixedPerformanceSettings')
        .then(module => {
          module.applyPreset(preset, viewer);
          showNotification(`Applied ${preset} preset`);
          
          // Update frame rate monitor
          if (frameRateMonitor) {
            frameRateMonitor.setPreset(preset);
          }
        });
    });
  });
  
  // Auto-performance toggle
  if (autoPerformanceToggle) {
    autoPerformanceToggle.addEventListener('change', () => {
      if (frameRateMonitor) {
        if (autoPerformanceToggle.checked) {
          frameRateMonitor.start();
          showNotification('Auto-performance enabled');
        } else {
          frameRateMonitor.stop();
          showNotification('Auto-performance disabled');
        }
      }
    });
  }
  
  // Target FPS slider
  if (targetFpsSlider && targetFpsValue) {
    targetFpsSlider.addEventListener('input', () => {
      const fps = parseInt(targetFpsSlider.value, 10);
      targetFpsValue.textContent = fps;
      
      if (frameRateMonitor) {
        frameRateMonitor.targetFPS = fps;
      }
    });
  }
  
  // Advanced settings sliders
  initializeSliderDisplay('max-sse-slider', 'max-sse-value');
  initializeSliderDisplay('max-memory-slider', 'max-memory-value');
  initializeSliderDisplay('dynamic-sse-density-slider', 'dynamic-sse-density-value', value => value.toFixed(5));
  initializeSliderDisplay('dynamic-sse-factor-slider', 'dynamic-sse-factor-value', value => value.toFixed(1));
  initializeSliderDisplay('point-budget-slider', 'point-budget-value', value => parseInt(value).toLocaleString());
  
  // Apply advanced settings button
  const applyAdvancedSettingsBtn = document.getElementById('apply-advanced-settings');
  if (applyAdvancedSettingsBtn) {
    applyAdvancedSettingsBtn.addEventListener('click', () => {
      applyAdvancedSettings(viewer);
    });
  }
  
  // Reset advanced settings button
  const resetAdvancedSettingsBtn = document.getElementById('reset-advanced-settings');
  if (resetAdvancedSettingsBtn) {
    resetAdvancedSettingsBtn.addEventListener('click', () => {
      resetAdvancedSettings(viewer);
    });
  }
  
  // Clear cache button
  const clearCacheButton = document.getElementById('clear-cache-button');
  if (clearCacheButton) {
    clearCacheButton.addEventListener('click', () => {
      if (viewer && viewer.scene && viewer.scene.primitives) {
        const primitives = viewer.scene.primitives;
        for (let i = 0; i < primitives.length; i++) {
          const primitive = primitives.get(i);
          if (primitive && primitive.readyPromise && primitive.trimLoadedTiles) {
            primitive.trimLoadedTiles();
          }
        }
        showNotification('Tile cache cleared');
      }
    });
  }
  
  // Reload tilesets button
  const reloadTilesetsButton = document.getElementById('reload-tilesets-button');
  if (reloadTilesetsButton) {
    reloadTilesetsButton.addEventListener('click', () => {
      // Import TilesetManager and reload all tilesets
      import('../../../utils/TilesetManager')
        .then(module => {
          if (module.default && module.default.reloadAllTilesets) {
            module.default.reloadAllTilesets();
            showNotification('Reloading all tilesets');
          }
        });
    });
  }
}

// Helper function to initialize slider display
function initializeSliderDisplay(sliderId, valueId, formatter = value => value) {
  const slider = document.getElementById(sliderId);
  const valueDisplay = document.getElementById(valueId);
  
  if (slider && valueDisplay) {
    valueDisplay.textContent = formatter(slider.value);
    
    slider.addEventListener('input', () => {
      valueDisplay.textContent = formatter(slider.value);
    });
  }
}

// Apply advanced settings from UI
function applyAdvancedSettings(viewer) {
  const settings = {
    maximumScreenSpaceError: parseFloat(document.getElementById('max-sse-slider').value),
    maximumMemoryUsage: parseFloat(document.getElementById('max-memory-slider').value),
    dynamicScreenSpaceErrorDensity: parseFloat(document.getElementById('dynamic-sse-density-slider').value),
    dynamicScreenSpaceErrorFactor: parseFloat(document.getElementById('dynamic-sse-factor-slider').value),
    pointBudget: parseInt(document.getElementById('point-budget-slider').value)
  };
  
  // Import the settings module and apply custom settings
  import('../../../utils/FixedPerformanceSettings')
    .then(module => {
      module.applyFixedSettings(settings, viewer);
      showNotification('Applied custom settings');
    });
}

// Reset advanced settings to match current preset
function resetAdvancedSettings(viewer) {
  // Find active preset
  const activePresetButton = document.querySelector('.preset-button.active');
  if (!activePresetButton) return;
  
  const preset = activePresetButton.dataset.preset;
  
  // Import settings module and get preset values
  import('../../../utils/FixedPerformanceSettings')
    .then(module => {
      const presetSettings = module.PERFORMANCE_SETTINGS[preset];
      
      // Update UI sliders
      updateSliderToValue('max-sse-slider', presetSettings.maximumScreenSpaceError);
      updateSliderToValue('max-memory-slider', presetSettings.maximumMemoryUsage);
      updateSliderToValue('dynamic-sse-density-slider', presetSettings.dynamicScreenSpaceErrorDensity);
      updateSliderToValue('dynamic-sse-factor-slider', presetSettings.dynamicScreenSpaceErrorFactor);
      updateSliderToValue('point-budget-slider', presetSettings.pointBudget);
      
      showNotification(`Reset to ${preset} preset values`);
    });
}

// Helper to update a slider value
function updateSliderToValue(sliderId, value) {
  const slider = document.getElementById(sliderId);
  if (slider) {
    slider.value = value;
    
    // Trigger input event to update display
    const event = new Event('input');
    slider.dispatchEvent(event);
  }
}

// Show notification
function showNotification(message) {
  // Check if notification container already exists
  let notification = document.querySelector('.sidebar-notification');
  
  if (!notification) {
    // Create notification container
    notification = document.createElement('div');
    notification.className = 'sidebar-notification';
    document.body.appendChild(notification);
  }
  
  // Update message and show
  notification.textContent = message;
  notification.classList.add('show');
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
} 