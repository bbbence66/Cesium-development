/**
 * NotesPanel.js
 * Panel for creating and managing notes in the 3D scene.
 */

/**
 * Generates the HTML content for the Notes panel
 * @returns {string} HTML content
 */
export const getNotesPanelContent = () => {
  return `
    <div class="tools-section">
      <h4>Add Note</h4>
      <div class="note-creation">
        <div class="note-input-group">
          <label for="note-title">Title</label>
          <input type="text" id="note-title" placeholder="Note title">
        </div>
        
        <div class="note-input-group">
          <label for="note-content">Content</label>
          <textarea id="note-content" placeholder="Enter your note here..." rows="3"></textarea>
        </div>
        
        <div class="note-type-selection">
          <label>Type</label>
          <div class="note-type-buttons">
            <button class="note-type-button active" data-type="point">
              <span class="note-type-icon">📍</span>
              <span>Point</span>
            </button>
            <button class="note-type-button" data-type="area">
              <span class="note-type-icon">🔳</span>
              <span>Area</span>
            </button>
            <button class="note-type-button" data-type="freeform">
              <span class="note-type-icon">✏️</span>
              <span>Freeform</span>
            </button>
          </div>
        </div>
        
        <div class="note-actions">
          <button class="note-button primary">Place Note in Scene</button>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Notes List</h4>
      <div class="notes-filter">
        <input type="text" placeholder="Search notes..." class="notes-search">
        <select class="notes-filter-select">
          <option value="all">All Types</option>
          <option value="point">Point</option>
          <option value="area">Area</option>
          <option value="freeform">Freeform</option>
        </select>
      </div>
      <div class="notes-list">
        <div class="note-item">
          <div class="note-header">
            <span class="note-title">Damaged Area</span>
            <span class="note-type">Point</span>
          </div>
          <div class="note-body">
            Significant water damage observed in this corner of the structure.
          </div>
          <div class="note-actions">
            <button class="note-action-button" title="Go to note">👁️</button>
            <button class="note-action-button" title="Edit note">✏️</button>
            <button class="note-action-button" title="Delete note">🗑️</button>
          </div>
        </div>
        
        <div class="note-item">
          <div class="note-header">
            <span class="note-title">Inspection Area</span>
            <span class="note-type">Area</span>
          </div>
          <div class="note-body">
            This area requires further inspection due to potential structural issues.
          </div>
          <div class="note-actions">
            <button class="note-action-button" title="Go to note">👁️</button>
            <button class="note-action-button" title="Edit note">✏️</button>
            <button class="note-action-button" title="Delete note">🗑️</button>
          </div>
        </div>
        
        <div class="note-item">
          <div class="note-header">
            <span class="note-title">Roof Details</span>
            <span class="note-type">Freeform</span>
          </div>
          <div class="note-body">
            The roof shows signs of weathering and will need maintenance in the next 6-12 months.
          </div>
          <div class="note-actions">
            <button class="note-action-button" title="Go to note">👁️</button>
            <button class="note-action-button" title="Edit note">✏️</button>
            <button class="note-action-button" title="Delete note">🗑️</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Display Settings</h4>
      <div class="checkbox-row">
        <input type="checkbox" id="show-notes" checked>
        <label for="show-notes">Show Notes in Scene</label>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="show-labels" checked>
        <label for="show-labels">Show Note Labels</label>
      </div>
      <div class="settings-row">
        <label for="note-scale">Note Size</label>
        <input type="range" id="note-scale" min="0.5" max="2" step="0.1" value="1">
      </div>
    </div>
    
    <div class="notes-actions">
      <button class="notes-action-button">Export Notes</button>
      <button class="notes-action-button secondary">Import Notes</button>
    </div>
  `;
};

export default getNotesPanelContent; 