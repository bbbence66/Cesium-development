/**
 * NavigationPanel.js
 * Panel for navigation controls and bookmarks.
 */

/**
 * Generates the HTML content for the Navigation panel
 * @returns {string} HTML content
 */
export const getNavigationPanelContent = () => {
  return `
    <div class="settings-section">
      <h4>Camera Presets</h4>
      <div class="camera-presets">
        <button class="preset-button" data-view="top">Top View</button>
        <button class="preset-button" data-view="front">Front View</button>
        <button class="preset-button" data-view="side">Side View</button>
        <button class="preset-button" data-view="perspective">Perspective</button>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Navigation Mode</h4>
      <div class="radio-group">
        <div class="radio-row">
          <input type="radio" id="nav-orbit" name="navigation-mode" checked>
          <label for="nav-orbit">Orbit Mode</label>
        </div>
        <div class="radio-row">
          <input type="radio" id="nav-free" name="navigation-mode">
          <label for="nav-free">Free Navigation</label>
        </div>
        <div class="radio-row">
          <input type="radio" id="nav-first-person" name="navigation-mode">
          <label for="nav-first-person">First Person</label>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Bookmarks</h4>
      <div class="bookmarks-list">
        <div class="bookmark-item">
          <span class="bookmark-name">Main Entrance</span>
          <div class="bookmark-actions">
            <button class="bookmark-button" title="Go to this view">
              <span class="icon">➔</span>
            </button>
            <button class="bookmark-button" title="Delete bookmark">
              <span class="icon">×</span>
            </button>
          </div>
        </div>
        <div class="bookmark-item">
          <span class="bookmark-name">Building Roof</span>
          <div class="bookmark-actions">
            <button class="bookmark-button" title="Go to this view">
              <span class="icon">➔</span>
            </button>
            <button class="bookmark-button" title="Delete bookmark">
              <span class="icon">×</span>
            </button>
          </div>
        </div>
        <div class="bookmark-item">
          <span class="bookmark-name">Interior Section</span>
          <div class="bookmark-actions">
            <button class="bookmark-button" title="Go to this view">
              <span class="icon">➔</span>
            </button>
            <button class="bookmark-button" title="Delete bookmark">
              <span class="icon">×</span>
            </button>
          </div>
        </div>
      </div>
      <div class="bookmark-actions-row">
        <button class="navigation-button">
          <span class="icon">+</span> Save Current View
        </button>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Coordinates</h4>
      <div class="coordinates-display">
        <div class="coordinate-row">
          <label>X:</label>
          <input type="text" class="coordinate-input" id="coord-x" value="0.00">
        </div>
        <div class="coordinate-row">
          <label>Y:</label>
          <input type="text" class="coordinate-input" id="coord-y" value="0.00">
        </div>
        <div class="coordinate-row">
          <label>Z:</label>
          <input type="text" class="coordinate-input" id="coord-z" value="0.00">
        </div>
        <button class="navigation-button small">Go to Coordinates</button>
      </div>
    </div>
  `;
};

export default getNavigationPanelContent; 