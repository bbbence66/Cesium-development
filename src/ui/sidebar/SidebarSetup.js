/**
 * SidebarSetup.js
 * Initializes the sidebar with all the predefined tools.
 */

import { sidebarManager } from './SidebarManager';
import icons from './icons/SidebarIcons';

// Import panel contents
import visualSettingsModule from './panels/VisualSettingsPanel';
import getPerformancePanelContent from './panels/PerformancePanel';
import getNavigationPanelContent from './panels/NavigationPanel';
import getNotesPanelContent from './panels/NotesPanel';
import getMeasurementPanelContent from './panels/MeasurementPanel';
import getClippingPanelContent from './panels/ClippingPanel';

// Import CSS for visual settings
import '../../css/visual-settings.css';

/**
 * Initialize the sidebar with all tools
 * @param {Object} viewer - The Cesium viewer instance
 * @returns {Object} The sidebar manager instance
 */
export const initializeSidebar = (viewer) => {
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
      visualSettingsModule.initializeVisualSettingsPanel(viewer);
    }
  });

  // Performance Tool
  sidebarManager.registerTool({
    id: 'performance',
    icon: icons.performance,
    tooltip: 'Performance',
    title: 'Performance Settings',
    content: getPerformancePanelContent(),
    group: 'settings'
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
  
  // Info Tool
  sidebarManager.registerTool({
    id: 'info',
    icon: icons.info,
    tooltip: 'Information',
    title: 'Information',
    content: `
      <div class="info-content">
        <h4>Point Cloud Viewer</h4>
        <p>Version 1.0.0</p>
        <p>A tool for viewing and analyzing point cloud data.</p>
        
        <h4>Keyboard Shortcuts</h4>
        <ul class="shortcut-list">
          <li><span class="key">Space</span> Reset view</li>
          <li><span class="key">Ctrl+Z</span> Undo</li>
          <li><span class="key">Ctrl+Y</span> Redo</li>
          <li><span class="key">Esc</span> Cancel current operation</li>
        </ul>
        
        <h4>Mouse Controls</h4>
        <ul class="shortcut-list">
          <li><span class="action">Left click + drag</span> Rotate view</li>
          <li><span class="action">Right click + drag</span> Pan view</li>
          <li><span class="action">Scroll wheel</span> Zoom in/out</li>
        </ul>
      </div>
    `,
    group: 'help'
  });
  
  return sidebarManager;
};

export default initializeSidebar; 