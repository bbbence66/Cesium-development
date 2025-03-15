/**
 * Logo.js
 * Component for displaying the ScanAudit logo in the top left corner
 */

/**
 * Creates and adds the ScanAudit logo to the page
 * @returns {HTMLElement} The created logo container element
 */
export const createLogo = () => {
  // Create the container
  const container = document.createElement('div');
  container.className = 'logo-container';
  
  // Create the image element
  const logoImage = document.createElement('img');
  logoImage.src = 'assets/images/ScanAudit Logo.png'; // Updated to use the correct filename with space
  logoImage.alt = 'ScanAudit Logo';
  
  // Assemble and add to DOM
  container.appendChild(logoImage);
  document.body.appendChild(container);
  
  return container;
};

export default createLogo; 