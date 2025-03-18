/**
 * SidebarSetup.js
 * Initializes the sidebar with all the predefined tools.
 */

import { sidebarManager } from './SidebarManager';
import icons from './icons/SidebarIcons';

// Import panel contents
import visualSettingsModule from './panels/VisualSettingsPanel';
import getNavigationPanelContent from './panels/NavigationPanel';
import getNotesPanelContent from './panels/NotesPanel';
import getMeasurementPanelContent from './panels/MeasurementPanel';
import getClippingPanelContent from './panels/ClippingPanel';

// Import panel handlers
import { initializeVisualSettings } from './panels/VisualSettingsHandler';

// Import CSS for visual settings
import '../../css/visual-settings.css';

/**
 * Initialize the sidebar with all tools
 * @param {Object} viewer - The Cesium viewer instance
 * @returns {Object} The sidebar manager instance
 */
export default function initializeSidebar(viewer) {
  // Initialize the sidebar
  sidebarManager.init();
  
  // Register all the tools

  // Visual Settings Tool
  sidebarManager.registerTool({
    id: 'visual-settings',
    icon: icons.visualSettings,
    tooltip: 'Visual Settings',
    title: 'Visual Settings',
    content: visualSettingsModule.getVisualSettingsPanelContent(),
    group: 'settings',
    onOpen: () => {
      // Initialize the visual settings functionality when the panel is opened
      initializeVisualSettings(viewer);
    }
  });

  // Navigation Tool
  sidebarManager.registerTool({
    id: 'navigation',
    icon: icons.navigation,
    tooltip: 'Navigation',
    title: 'Navigation Controls',
    content: getNavigationPanelContent(),
    group: 'navigation'
  });

  // Notes Tool
  sidebarManager.registerTool({
    id: 'notes',
    icon: icons.notes,
    tooltip: 'Notes',
    title: 'Notes Manager',
    content: getNotesPanelContent(),
    group: 'annotation'
  });

  // Measurement Tool
  sidebarManager.registerTool({
    id: 'measurement',
    icon: icons.measurement,
    tooltip: 'Measurement Tools',
    title: 'Measurement Tools',
    content: getMeasurementPanelContent(),
    group: 'analysis'
  });

  // Clipping Tool
  sidebarManager.registerTool({
    id: 'clipping',
    icon: icons.clipping,
    tooltip: 'Clipping Tools',
    title: 'Clipping Planes',
    content: getClippingPanelContent(),
    group: 'analysis'
  });

  // Info Tool - Always present at the bottom of the sidebar
  sidebarManager.registerTool({
    id: 'info',
    icon: icons.info,
    tooltip: 'Info',
    title: 'About Point Cloud Viewer',
    content: `
      <div class="info-panel">
        <h3>About Point Cloud Viewer</h3>
        <p>Version 1.0.0</p>
        <p>A web-based viewer for 3D point clouds built with Cesium.</p>
        
        <h4>Keyboard Shortcuts</h4>
        <div class="shortcuts">
          <div class="shortcut-row">
            <div class="shortcut-key">W, A, S, D</div>
            <div class="shortcut-action">Pan camera</div>
          </div>
          <div class="shortcut-row">
            <div class="shortcut-key">Q, E</div>
            <div class="shortcut-action">Rise/lower camera</div>
          </div>
          <div class="shortcut-row">
            <div class="shortcut-key">Shift</div>
            <div class="shortcut-action">Accelerate movement</div>
          </div>
          <div class="shortcut-row">
            <div class="shortcut-key">Esc</div>
            <div class="shortcut-action">Close sidebar panel</div>
          </div>
        </div>
        
        <h4>Mouse Controls</h4>
        <div class="shortcuts">
          <div class="shortcut-row">
            <div class="shortcut-key">Left Click + Drag</div>
            <div class="shortcut-action">Rotate view</div>
          </div>
          <div class="shortcut-row">
            <div class="shortcut-key">Right Click + Drag</div>
            <div class="shortcut-action">Pan view</div>
          </div>
          <div class="shortcut-row">
            <div class="shortcut-key">Middle Click + Drag</div>
            <div class="shortcut-action">Zoom view</div>
          </div>
          <div class="shortcut-row">
            <div class="shortcut-key">Mouse Wheel</div>
            <div class="shortcut-action">Zoom in/out</div>
          </div>
        </div>
      </div>
    `,
    group: 'help',
    position: 'bottom'
  });

  return sidebarManager;
} 