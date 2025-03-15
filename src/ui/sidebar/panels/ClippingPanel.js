/**
 * ClippingPanel.js
 * Panel for clipping plane tools in the 3D scene.
 */

/**
 * Generates the HTML content for the Clipping panel
 * @returns {string} HTML content
 */
export const getClippingPanelContent = () => {
  return `
    <div class="tools-section">
      <h4>Clipping Tools</h4>
      <div class="tools-buttons">
        <button class="tool-button" data-tool="plane">
          <span class="tool-icon">▦</span>
          <span class="tool-label">Single Plane</span>
        </button>
        <button class="tool-button" data-tool="box">
          <span class="tool-icon">☐</span>
          <span class="tool-label">Box</span>
        </button>
        <button class="tool-button" data-tool="sphere">
          <span class="tool-icon">○</span>
          <span class="tool-label">Sphere</span>
        </button>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Active Clipping Planes</h4>
      <div class="clipping-planes-list">
        <div class="clipping-plane-item">
          <div class="clipping-plane-info">
            <span class="clipping-plane-type">Plane 1</span>
            <span class="clipping-plane-position">X: 10.5, Y: 0, Z: 5.2</span>
          </div>
          <div class="clipping-plane-actions">
            <button class="clipping-button" title="Toggle visibility">
              <span class="icon">👁️</span>
            </button>
            <button class="clipping-button" title="Delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
        <div class="clipping-plane-item">
          <div class="clipping-plane-info">
            <span class="clipping-plane-type">Box</span>
            <span class="clipping-plane-position">Center: X: 0, Y: 0, Z: 0</span>
          </div>
          <div class="clipping-plane-actions">
            <button class="clipping-button" title="Toggle visibility">
              <span class="icon">👁️</span>
            </button>
            <button class="clipping-button" title="Delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Plane Settings</h4>
      <div class="settings-row">
        <label>Position</label>
        <div class="coordinates-inputs">
          <input type="number" placeholder="X" value="0" step="0.1">
          <input type="number" placeholder="Y" value="0" step="0.1">
          <input type="number" placeholder="Z" value="0" step="0.1">
        </div>
      </div>
      <div class="settings-row">
        <label>Rotation</label>
        <div class="coordinates-inputs">
          <input type="number" placeholder="X" value="0" step="1">
          <input type="number" placeholder="Y" value="0" step="1">
          <input type="number" placeholder="Z" value="0" step="1">
        </div>
      </div>
      <div class="settings-row">
        <label for="clipping-color">Plane Color</label>
        <input type="color" id="clipping-color" value="#00AAFF">
      </div>
      <div class="settings-row">
        <label for="plane-opacity">Plane Opacity</label>
        <input type="range" id="plane-opacity" min="0" max="1" step="0.1" value="0.2">
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Display Options</h4>
      <div class="checkbox-row">
        <input type="checkbox" id="show-planes" checked>
        <label for="show-planes">Show Clipping Objects</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="cap-edges" checked>
        <label for="cap-edges">Show Cap Edges</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="cap-fill">
        <label for="cap-fill">Fill Cap</label>
      </div>
    </div>
    
    <div class="clipping-actions">
      <button class="clipping-action-button">Apply Changes</button>
      <button class="clipping-action-button">Clear All</button>
    </div>
  `;
};

export default getClippingPanelContent; 