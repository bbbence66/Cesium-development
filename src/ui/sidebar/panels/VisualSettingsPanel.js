/**
 * VisualSettingsPanel.js
 * Panel for controlling visual settings of the scene.
 */

import { initializeVisualSettings } from './VisualSettingsHandler';

/**
 * Generates the HTML content for the Visual Settings panel
 * @returns {string} HTML content
 */
export const getVisualSettingsPanelContent = () => {
  return `
    <div class="settings-section">
      <h4>Lighting</h4>
      <div class="settings-row">
        <label for="ambient-light">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
          Ambient Light
        </label>
        <input type="range" id="ambient-light" min="0" max="100" value="50">
      </div>
      <div class="settings-row">
        <label for="shadow-darkness">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v8M4.93 10.93l6.36 6.36M2 18h8"></path>
              <circle cx="16" cy="16" r="6"></circle>
            </svg>
          </div>
          Shadow Darkness
        </label>
        <input type="range" id="shadow-darkness" min="0" max="100" value="30">
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Point Cloud</h4>
      <div class="settings-row">
        <label for="point-size">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="6" cy="6" r="3"></circle>
              <circle cx="18" cy="18" r="3"></circle>
              <line x1="10" y1="10" x2="14" y2="14"></line>
            </svg>
          </div>
          Point Size
        </label>
        <input type="range" id="point-size" min="1" max="10" value="3">
      </div>
      <div class="settings-row">
        <label for="point-brightness">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          Brightness
        </label>
        <input type="range" id="point-brightness" min="0" max="100" value="70">
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="point-classification-colors" checked>
        <label for="point-classification-colors">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 3H3v18h18V3z"></path>
              <path d="M3 9h18"></path>
              <path d="M3 15h18"></path>
              <path d="M9 3v18"></path>
              <path d="M15 3v18"></path>
            </svg>
          </div>
          Use Classification Colors
        </label>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Background</h4>
      <div class="radio-group">
        <div class="radio-row">
          <input type="radio" id="bg-sky" name="background" checked>
          <label for="bg-sky">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 18a5 5 0 0 0-10 0"></path>
                <line x1="12" y1="9" x2="12" y2="2"></line>
                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                <line x1="1" y1="18" x2="3" y2="18"></line>
                <line x1="21" y1="18" x2="23" y2="18"></line>
                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                <line x1="23" y1="22" x2="1" y2="22"></line>
                <polyline points="8 6 12 2 16 6"></polyline>
              </svg>
            </div>
            Sky
          </label>
        </div>
        <div class="radio-row">
          <input type="radio" id="bg-gradient" name="background">
          <label for="bg-gradient">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
            </div>
            Gradient
          </label>
        </div>
        <div class="radio-row">
          <input type="radio" id="bg-solid" name="background">
          <label for="bg-solid">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </div>
            Solid Color
          </label>
        </div>
      </div>
      <div class="color-picker-row settings-row">
        <label for="bg-color">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="13.5" cy="6.5" r="2.5"></circle>
              <circle cx="17.5" cy="10.5" r="2.5"></circle>
              <circle cx="8.5" cy="7.5" r="2.5"></circle>
              <circle cx="6.5" cy="12.5" r="2.5"></circle>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
            </svg>
          </div>
          Color
        </label>
        <input type="color" id="bg-color" value="#87CEEB">
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Camera</h4>
      <div class="settings-row">
        <label for="fov">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          Field of View
        </label>
        <input type="range" id="fov" min="30" max="120" value="60">
        <span class="value-display">60°</span>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="camera-inertia" checked>
        <label for="camera-inertia">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          Enable Camera Inertia
        </label>
      </div>
    </div>
    
    <div class="settings-buttons">
      <button class="settings-button primary">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Apply Settings
      </button>
      <button class="settings-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
          <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z"></path>
        </svg>
        Reset to Default
      </button>
    </div>
  `;
};

/**
 * Initialize the visual settings panel functionality
 * @param {Object} viewer - The Cesium viewer instance
 */
export const initializeVisualSettingsPanel = (viewer) => {
  // Initialize the settings functionality after the panel content is loaded
  setTimeout(() => {
    initializeVisualSettings(viewer);
  }, 100);
};

export default {
  getVisualSettingsPanelContent,
  initializeVisualSettingsPanel
}; 