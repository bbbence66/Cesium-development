/**
 * DatasetSelector.js
 * Component for selecting which datasets and features to display
 */

/**
 * Creates and initializes the dataset selector UI
 * @param {Object} tilesetManager - The tileset manager instance
 * @param {Object} viewer - The Cesium viewer instance
 * @returns {HTMLElement} The created dataset selector element
 */
export const createDatasetSelector = (tilesetManager, viewer) => {
  // Create the main container
  const container = document.createElement('div');
  container.className = 'dataset-selector-container';
  
  // Create header (always visible)
  const header = document.createElement('div');
  header.className = 'dataset-selector-header';
  
  // Create title
  const title = document.createElement('div');
  title.className = 'dataset-selector-title';
  title.innerHTML = `
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    </div>
    <span>Dataset Selector</span>
  `;
  
  // Create toggle icon
  const toggleIcon = document.createElement('div');
  toggleIcon.className = 'dataset-selector-toggle';
  toggleIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `;
  
  // Assemble header
  header.appendChild(title);
  header.appendChild(toggleIcon);
  container.appendChild(header);
  
  // Create dropdown panel
  const dropdown = document.createElement('div');
  dropdown.className = 'dataset-selector-dropdown';
  
  // Create dataset list
  const datasetList = document.createElement('div');
  datasetList.className = 'dataset-list';
  
  // Define datasets
  const datasets = [
    { id: 'castle', name: 'Castle' },
    { id: 'barn', name: 'Barn' },
    { id: 'guesthouse', name: 'Guesthouse' }
  ];
  
  // If there's a tileset manager, map to actual tilesets
  if (tilesetManager && tilesetManager.tilesets) {
    // Map dataset IDs to actual tileset IDs if they exist
    const tilesetIds = Object.keys(tilesetManager.tilesets);
    
    datasets.forEach(dataset => {
      // Find a matching tileset ID (case insensitive)
      const matchingTilesetId = tilesetIds.find(id => 
        id.toLowerCase().includes(dataset.id.toLowerCase()));
      
      if (matchingTilesetId) {
        const tileset = tilesetManager.tilesets[matchingTilesetId];
        const isActive = tileset.show !== false; // Default to true if not explicitly set to false
        
        const item = createDatasetItem(
          matchingTilesetId, 
          dataset.name, 
          isActive,
          () => toggleDataset(tilesetManager, matchingTilesetId),
          () => navigateToDataset(tilesetManager, matchingTilesetId)
        );
        
        datasetList.appendChild(item);
      } else {
        // Fallback if tileset not found
        const item = createDatasetItem(
          dataset.id, 
          dataset.name, 
          true,
          () => console.log(`Tileset for ${dataset.name} not found`),
          () => console.log(`Cannot navigate to ${dataset.name}: Not found`)
        );
        datasetList.appendChild(item);
      }
    });
  } else {
    // If no tilesets, add items with the defined names
    datasets.forEach(dataset => {
      const item = createDatasetItem(
        dataset.id, 
        dataset.name, 
        true,
        () => console.log('No tileset manager available'),
        () => console.log('No tileset manager available for navigation')
      );
      datasetList.appendChild(item);
    });
  }
  
  // Add separator
  const separator = document.createElement('div');
  separator.className = 'dataset-separator';
  datasetList.appendChild(separator);
  
  // Add buildings toggle
  const buildingsItem = createDatasetItem(
    'buildings', 
    'OSM Buildings', 
    true,
    () => toggleBuildings(viewer),
    null // No navigation for buildings
  );
  
  // Add custom icon for buildings
  const buildingNameSpan = buildingsItem.querySelector('.dataset-name');
  if (buildingNameSpan) {
    buildingNameSpan.innerHTML = `
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <line x1="9" y1="22" x2="9" y2="2"></line>
          <line x1="15" y1="22" x2="15" y2="2"></line>
        </svg>
      </div>
      <span>OSM Buildings</span>
    `;
  }
  
  datasetList.appendChild(buildingsItem);
  
  // Add toggle all button
  const toggleAllBtn = document.createElement('button');
  toggleAllBtn.className = 'toggle-all-button';
  toggleAllBtn.innerHTML = `
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="7 13 10 16 17 9"></polyline>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    </div>
    <span>Toggle All</span>
  `;
  toggleAllBtn.addEventListener('click', () => toggleAllDatasets(tilesetManager, viewer));
  
  // Add elements to dropdown
  dropdown.appendChild(datasetList);
  dropdown.appendChild(toggleAllBtn);
  container.appendChild(dropdown);
  
  // Add toggle functionality for dropdown
  header.addEventListener('click', () => {
    dropdown.classList.toggle('open');
    toggleIcon.classList.toggle('open');
  });
  
  // Add to DOM
  document.body.appendChild(container);
  
  return container;
};

/**
 * Creates an individual dataset item
 * @param {string} id - Unique ID for the dataset
 * @param {string} name - Display name
 * @param {boolean} isActive - Whether the dataset is active
 * @param {Function} toggleFn - Function to call when toggled
 * @param {Function} navigateFn - Function to call when clicking the item for navigation
 * @returns {HTMLElement} The created item element
 */
function createDatasetItem(id, name, isActive, toggleFn, navigateFn) {
  const item = document.createElement('div');
  item.className = 'dataset-item';
  item.dataset.id = id;
  if (!isActive) {
    item.classList.add('disabled');
  }
  
  // Make the entire item navigable (if a navigation function is provided)
  if (navigateFn) {
    item.classList.add('navigable');
    item.addEventListener('click', (e) => {
      // Only navigate if we didn't click on the toggle switch
      if (!e.target.closest('.dataset-toggle')) {
        navigateFn();
      }
    });
  }
  
  // Create dataset name with point cloud icon
  const nameElement = document.createElement('div');
  nameElement.className = 'dataset-name';
  
  // Add icon
  const iconElement = document.createElement('div');
  iconElement.className = 'icon';
  iconElement.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  `;
  nameElement.appendChild(iconElement);
  
  // Add name span (no longer needs to be individually clickable)
  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;
  nameElement.appendChild(nameSpan);
  item.appendChild(nameElement);
  
  // Add toggle
  const toggleElement = document.createElement('label');
  toggleElement.className = 'dataset-toggle';
  toggleElement.innerHTML = `
    <input type="checkbox" ${isActive ? 'checked' : ''}>
    <span class="toggle-slider"></span>
  `;
  item.appendChild(toggleElement);
  
  // Add event listener for toggle
  const toggle = toggleElement.querySelector('input[type="checkbox"]');
  toggle.addEventListener('change', (e) => {
    // Prevent the click event from bubbling up to the item
    e.stopPropagation();
    
    if (e.target.checked) {
      item.classList.remove('disabled');
    } else {
      item.classList.add('disabled');
    }
    if (toggleFn) toggleFn(e.target.checked);
  });
  
  return item;
}

/**
 * Toggle a dataset's visibility
 * @param {Object} tilesetManager - The tileset manager instance
 * @param {string} tilesetId - ID of the tileset to toggle
 * @param {boolean} [force] - Force a specific state (if not provided, will toggle)
 */
function toggleDataset(tilesetManager, tilesetId, force) {
  if (!tilesetManager || !tilesetManager.tilesets || !tilesetManager.tilesets[tilesetId]) {
    console.warn(`Tileset ${tilesetId} not found`);
    return;
  }
  
  const tileset = tilesetManager.tilesets[tilesetId];
  const newState = force !== undefined ? force : !tileset.show;
  
  // Update the tileset visibility
  tileset.show = newState;
  
  // If the tileset has a cesium tileset property, update that too
  if (tileset.cesiumTileset) {
    tileset.cesiumTileset.show = newState;
  }
  
  console.log(`Toggled dataset ${tilesetId}: ${newState ? 'ON' : 'OFF'}`);
}

/**
 * Navigate to a specific dataset
 * @param {Object} tilesetManager - The tileset manager instance
 * @param {string} tilesetId - ID of the tileset to navigate to
 */
function navigateToDataset(tilesetManager, tilesetId) {
  if (!tilesetManager) {
    console.warn('Cannot navigate: Tileset manager not available');
    return;
  }
  
  console.log(`Navigating to dataset: ${tilesetId}`);
  tilesetManager.navigateToTileset(tilesetId);
}

/**
 * Toggle building visibility
 * @param {Object} viewer - The Cesium viewer instance
 * @param {boolean} [force] - Force a specific state (if not provided, will toggle)
 */
function toggleBuildings(viewer, force) {
  if (!viewer || !viewer.tilesetManager) {
    console.warn('Viewer or TilesetManager not available');
    
    // Fallback to old method if tilesetManager is not attached to viewer
    if (viewer && viewer.scene && viewer.scene.primitives) {
      const primitives = viewer.scene.primitives;
      for (let i = 0; i < primitives.length; i++) {
        const primitive = primitives.get(i);
        if (primitive && primitive.hasOwnProperty('tileVisible') && 
            primitive.hasOwnProperty('maximumScreenSpaceError')) {
            
          const newState = force !== undefined ? force : !primitive.show;
          primitive.show = newState;
          console.log(`Toggled buildings using fallback method: ${newState ? 'ON' : 'OFF'}`);
          break;
        }
      }
    }
    return;
  }
  
  // Use the new method from TilesetManager
  viewer.tilesetManager.toggleOsmBuildings(force);
}

/**
 * Toggle all datasets and buildings
 * @param {Object} tilesetManager - The tileset manager instance
 * @param {Object} viewer - The Cesium viewer instance
 */
function toggleAllDatasets(tilesetManager, viewer) {
  // Determine if we should turn everything on or off
  // Check if any dataset is currently off - if so, we'll turn them all on
  let anyOff = false;
  
  if (tilesetManager && tilesetManager.tilesets) {
    Object.values(tilesetManager.tilesets).forEach(tileset => {
      if (!tileset.show) anyOff = true;
    });
  }
  
  // Also check buildings
  if (viewer && viewer.scene && viewer.scene.primitives) {
    const primitives = viewer.scene.primitives;
    for (let i = 0; i < primitives.length; i++) {
      const primitive = primitives.get(i);
      if (primitive && primitive.hasOwnProperty('tileVisible') && 
          primitive.hasOwnProperty('maximumScreenSpaceError') && !primitive.show) {
        anyOff = true;
        break;
      }
    }
  }
  
  // Toggle all datasets
  if (tilesetManager && tilesetManager.tilesets) {
    Object.keys(tilesetManager.tilesets).forEach(tilesetId => {
      toggleDataset(tilesetManager, tilesetId, anyOff);
    });
  }
  
  // Toggle buildings
  toggleBuildings(viewer, anyOff);
  
  // Update UI checkboxes
  document.querySelectorAll('.dataset-item').forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = anyOff;
      if (anyOff) {
        item.classList.remove('disabled');
      } else {
        item.classList.add('disabled');
      }
    }
  });
}

export default createDatasetSelector; 