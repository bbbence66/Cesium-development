/**
 * PerformancePanel.js
 * Panel for controlling performance settings of the scene.
 */

/**
 * Generates the HTML content for the Performance panel
 * @returns {string} HTML content
 */
export const getPerformancePanelContent = () => {
  return `
    <div class="performance-stats">
      <div class="stat-row">
        <div class="stat-label">FPS:</div>
        <div class="stat-value" id="fps-value">60</div>
      </div>
      <div class="stat-row">
        <div class="stat-label">Memory:</div>
        <div class="stat-value" id="memory-value">240 MB</div>
      </div>
      <div class="stat-row">
        <div class="stat-label">Points Loaded:</div>
        <div class="stat-value" id="points-value">2.4M</div>
      </div>
      <div class="stat-row">
        <div class="stat-label">Triangles:</div>
        <div class="stat-value" id="triangles-value">158K</div>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Performance Settings</h4>
      <div class="settings-row">
        <label for="quality-preset">Quality Preset</label>
        <select id="quality-preset">
          <option value="ultra">Ultra</option>
          <option value="high" selected>High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      
      <div class="settings-row">
        <label for="point-budget">Point Budget</label>
        <input type="range" id="point-budget" min="100000" max="5000000" step="100000" value="2000000">
        <span class="value-display">2M</span>
      </div>
      
      <div class="settings-row">
        <label for="lod-factor">LOD Factor</label>
        <input type="range" id="lod-factor" min="0.5" max="2" step="0.1" value="1">
        <span class="value-display">1.0</span>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Advanced Performance Settings</h4>
      <div class="settings-row">
        <label for="max-screen-space-error">Max Screen Space Error</label>
        <input type="range" id="max-screen-space-error" min="8" max="64" step="4" value="32">
        <span class="value-display">32</span>
      </div>
      
      <div class="settings-row">
        <label for="max-memory-usage">Memory Usage Limit (MB)</label>
        <input type="range" id="max-memory-usage" min="64" max="1024" step="64" value="256">
        <span class="value-display">256 MB</span>
      </div>
      
      <div class="settings-row">
        <label for="dynamic-sse-density">Dynamic SSE Density</label>
        <input type="range" id="dynamic-sse-density" min="0.00002" max="0.0001" step="0.00001" value="0.00006">
        <span class="value-display">0.00006</span>
      </div>
      
      <div class="settings-row">
        <label for="dynamic-sse-factor">Dynamic SSE Factor</label>
        <input type="range" id="dynamic-sse-factor" min="1" max="10" step="1" value="6">
        <span class="value-display">6</span>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Optimizations</h4>
      <div class="checkbox-row">
        <input type="checkbox" id="opt-frustum-culling" checked>
        <label for="opt-frustum-culling">Frustum Culling</label>
      </div>
      
      <div class="checkbox-row">
        <input type="checkbox" id="opt-hardware-acceleration" checked>
        <label for="opt-hardware-acceleration">Hardware Acceleration</label>
      </div>
      
      <div class="checkbox-row">
        <input type="checkbox" id="opt-texture-compression" checked>
        <label for="opt-texture-compression">Texture Compression</label>
      </div>
      
      <div class="checkbox-row">
        <input type="checkbox" id="opt-shader-caching" checked>
        <label for="opt-shader-caching">Shader Caching</label>
      </div>
      
      <div class="checkbox-row">
        <input type="checkbox" id="opt-foveated-rendering" checked>
        <label for="opt-foveated-rendering">Foveated Rendering</label>
      </div>
    </div>
    
    <div class="performance-actions">
      <button class="performance-button">Apply Settings</button>
      <button class="performance-button secondary">Reset to Default</button>
    </div>
  `;
}; 