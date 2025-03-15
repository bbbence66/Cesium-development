/**
 * SidebarManager.js
 * Main controller for the sidebar menu system.
 * Manages the state of the sidebar, tools registration, and panel visibility.
 */

class SidebarManager {
  constructor() {
    this.tools = [];
    this.activeToolId = null;
    this.container = null;
    this.menuElement = null;
    this.panelsContainer = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the sidebar system
   * @param {string} containerId - ID of the container element to attach the sidebar to
   * @returns {SidebarManager} this instance for chaining
   */
  init(containerId = 'cesiumContainer') {
    if (this.isInitialized) {
      console.warn('SidebarManager already initialized');
      return this;
    }

    // Create the sidebar container
    const container = document.createElement('div');
    container.className = 'sidebar-container';
    
    // Create the menu element
    const menu = document.createElement('div');
    menu.className = 'sidebar-menu';
    container.appendChild(menu);
    
    // Create the panels container
    const panelsContainer = document.createElement('div');
    panelsContainer.className = 'sidebar-panels-container';
    container.appendChild(panelsContainer);
    
    // Store references
    this.container = container;
    this.menuElement = menu;
    this.panelsContainer = panelsContainer;
    
    // Add to the DOM
    const parentElement = document.getElementById(containerId);
    if (parentElement) {
      parentElement.appendChild(container);
    } else {
      document.body.appendChild(container);
      console.warn(`Container with ID "${containerId}" not found, appending to body instead.`);
    }
    
    this.isInitialized = true;
    
    // Render initial state
    this.render();
    
    return this;
  }

  /**
   * Register a new tool in the sidebar
   * @param {Object} toolConfig - Configuration for the tool
   * @param {string} toolConfig.id - Unique identifier for the tool
   * @param {string} toolConfig.icon - HTML/SVG for the tool's icon
   * @param {string} toolConfig.tooltip - Text to show on hover
   * @param {string} toolConfig.title - Title for the panel
   * @param {string|Function} toolConfig.content - HTML content or render function for the panel
   * @param {string} [toolConfig.group] - Optional group name to organize tools
   * @returns {SidebarManager} this instance for chaining
   */
  registerTool(toolConfig) {
    if (!toolConfig.id) {
      console.error('Tool must have an ID');
      return this;
    }
    
    // Check for duplicate IDs
    if (this.tools.some(tool => tool.id === toolConfig.id)) {
      console.error(`Tool with ID "${toolConfig.id}" already exists`);
      return this;
    }
    
    this.tools.push(toolConfig);
    
    // If already initialized, update the render
    if (this.isInitialized) {
      this.render();
    }
    
    return this;
  }

  /**
   * Open a tool panel by ID
   * @param {string} toolId - ID of the tool to open
   * @returns {SidebarManager} this instance for chaining
   */
  openTool(toolId) {
    // If the tool is already active, close it
    if (this.activeToolId === toolId) {
      this.closeActivePanel();
      return this;
    }
    
    // Set the active tool
    this.activeToolId = toolId;
    
    // Update UI
    this.updateActiveStates();
    
    return this;
  }

  /**
   * Close the currently active panel
   * @returns {SidebarManager} this instance for chaining
   */
  closeActivePanel() {
    this.activeToolId = null;
    this.updateActiveStates();
    return this;
  }

  /**
   * Update the active states of all menu items and panels
   * @private
   */
  updateActiveStates() {
    // Update menu icons
    const iconContainers = this.menuElement.querySelectorAll('.sidebar-icon-container');
    iconContainers.forEach(container => {
      const toolId = container.dataset.toolId;
      if (toolId === this.activeToolId) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    });
    
    // Update panel visibility
    const panels = this.panelsContainer.querySelectorAll('.sidebar-panel');
    panels.forEach(panel => {
      const toolId = panel.dataset.toolId;
      if (toolId === this.activeToolId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  /**
   * Render the sidebar UI
   * @private
   */
  render() {
    if (!this.isInitialized) {
      console.warn('Cannot render sidebar before initialization');
      return;
    }
    
    // Clear existing content
    this.menuElement.innerHTML = '';
    this.panelsContainer.innerHTML = '';
    
    // Group tools by their group property
    const groups = {};
    
    this.tools.forEach(tool => {
      const groupName = tool.group || 'default';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(tool);
    });
    
    // Render each group
    const groupNames = Object.keys(groups);
    
    groupNames.forEach((groupName, groupIndex) => {
      const groupTools = groups[groupName];
      
      // Add a separator between groups (except before the first group)
      if (groupIndex > 0) {
        const separator = document.createElement('div');
        separator.className = 'sidebar-separator';
        this.menuElement.appendChild(separator);
      }
      
      // Render tools in this group
      groupTools.forEach(tool => {
        this.renderTool(tool);
      });
    });
  }

  /**
   * Render a single tool
   * @param {Object} tool - Tool configuration
   * @private
   */
  renderTool(tool) {
    // Create the icon element
    const iconContainer = document.createElement('div');
    iconContainer.className = 'sidebar-icon-container';
    iconContainer.dataset.toolId = tool.id;
    
    // Add click handler
    iconContainer.addEventListener('click', () => {
      this.openTool(tool.id);
    });
    
    // Create icon
    const iconElement = document.createElement('div');
    iconElement.className = 'sidebar-icon';
    iconElement.innerHTML = tool.icon;
    iconContainer.appendChild(iconElement);
    
    // Create tooltip
    if (tool.tooltip) {
      const tooltip = document.createElement('div');
      tooltip.className = 'sidebar-tooltip';
      tooltip.textContent = tool.tooltip;
      iconContainer.appendChild(tooltip);
    }
    
    // Add to the menu
    this.menuElement.appendChild(iconContainer);
    
    // Create the panel
    const panel = document.createElement('div');
    panel.className = 'sidebar-panel';
    panel.dataset.toolId = tool.id;
    
    // Panel header
    const header = document.createElement('div');
    header.className = 'sidebar-panel-header';
    
    const title = document.createElement('h3');
    title.className = 'sidebar-panel-title';
    title.textContent = tool.title || tool.tooltip;
    header.appendChild(title);
    
    const closeButton = document.createElement('button');
    closeButton.className = 'sidebar-panel-close';
    closeButton.innerHTML = '×';
    closeButton.addEventListener('click', () => {
      this.closeActivePanel();
    });
    header.appendChild(closeButton);
    
    panel.appendChild(header);
    
    // Panel content
    const content = document.createElement('div');
    content.className = 'sidebar-panel-content';
    
    // Handle content as string or function
    if (typeof tool.content === 'function') {
      tool.content(content);
    } else {
      content.innerHTML = tool.content || '';
    }
    
    panel.appendChild(content);
    
    // Add to the panels container
    this.panelsContainer.appendChild(panel);
  }

  /**
   * Get a tool by ID
   * @param {string} toolId - ID of the tool to get
   * @returns {Object|null} The tool configuration or null if not found
   */
  getTool(toolId) {
    return this.tools.find(tool => tool.id === toolId) || null;
  }
}

// Export a singleton instance
export const sidebarManager = new SidebarManager();

// Also export the class for testing or custom instances
export default SidebarManager; 