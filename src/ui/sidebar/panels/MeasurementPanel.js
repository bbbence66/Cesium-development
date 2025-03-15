/**
 * MeasurementPanel.js
 * Panel for measurement tools in the 3D scene.
 */

/**
 * Generates the HTML content for the Measurement panel
 * @returns {string} HTML content
 */
export const getMeasurementPanelContent = () => {
  return `
    <div class="tools-section">
      <h4>Measurement Tools</h4>
      <div class="tools-buttons">
        <button class="tool-button" data-tool="distance">
          <span class="tool-icon">📏</span>
          <span class="tool-label">Distance</span>
        </button>
        <button class="tool-button" data-tool="area">
          <span class="tool-icon">⬛</span>
          <span class="tool-label">Area</span>
        </button>
        <button class="tool-button" data-tool="angle">
          <span class="tool-icon">📐</span>
          <span class="tool-label">Angle</span>
        </button>
        <button class="tool-button" data-tool="volume">
          <span class="tool-icon">📦</span>
          <span class="tool-label">Volume</span>
        </button>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Units</h4>
      <div class="radio-group">
        <div class="radio-row">
          <input type="radio" id="units-metric" name="units" checked>
          <label for="units-metric">Metric (m, m², m³)</label>
        </div>
        <div class="radio-row">
          <input type="radio" id="units-imperial" name="units">
          <label for="units-imperial">Imperial (ft, ft², ft³)</label>
        </div>
      </div>
      
      <div class="checkbox-row">
        <input type="checkbox" id="show-decimals" checked>
        <label for="show-decimals">Show 2 Decimal Places</label>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Active Measurements</h4>
      <div class="measurements-list">
        <div class="measurement-item">
          <div class="measurement-info">
            <span class="measurement-type">Distance</span>
            <span class="measurement-value">14.35 m</span>
          </div>
          <div class="measurement-actions">
            <button class="measurement-button" title="Edit label">
              <span class="icon">✏️</span>
            </button>
            <button class="measurement-button" title="Delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
        <div class="measurement-item">
          <div class="measurement-info">
            <span class="measurement-type">Area</span>
            <span class="measurement-value">25.48 m²</span>
          </div>
          <div class="measurement-actions">
            <button class="measurement-button" title="Edit label">
              <span class="icon">✏️</span>
            </button>
            <button class="measurement-button" title="Delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
        <div class="measurement-item">
          <div class="measurement-info">
            <span class="measurement-type">Angle</span>
            <span class="measurement-value">45.2°</span>
          </div>
          <div class="measurement-actions">
            <button class="measurement-button" title="Edit label">
              <span class="icon">✏️</span>
            </button>
            <button class="measurement-button" title="Delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="measurement-actions-row">
        <button class="measurement-action-button">Clear All</button>
        <button class="measurement-action-button">Export</button>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Appearance</h4>
      <div class="settings-row">
        <label for="measurement-color">Line Color</label>
        <input type="color" id="measurement-color" value="#FF4500">
      </div>
      <div class="settings-row">
        <label for="line-thickness">Line Thickness</label>
        <input type="range" id="line-thickness" min="1" max="10" value="3">
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show-labels" checked>
        <label for="show-labels">Show Measurement Labels</label>
      </div>
    </div>
  `;
};

export default getMeasurementPanelContent; 