/**
 * FrameRateMonitor.js
 * 
 * A utility class to monitor the frame rate of the Cesium viewer and
 * automatically adjust performance settings based on the frame rate.
 */

import { AVAILABLE_PRESETS, applyPreset } from './FixedPerformanceSettings';

export class FrameRateMonitor {
  /**
   * Create a new frame rate monitor
   * @param {Object} viewer - The Cesium viewer instance
   * @param {Object} options - Configuration options
   * @param {number} options.targetFPS - Target frame rate (default: 30)
   * @param {number} options.samplePeriod - How often to sample FPS in milliseconds (default: 2000)
   * @param {number} options.adjustThreshold - Number of consecutive samples below target before adjusting (default: 3)
   * @param {Function} options.onPresetChange - Callback when preset changes (default: null)
   */
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.targetFPS = options.targetFPS || 30;
    this.samplePeriod = options.samplePeriod || 2000;
    this.adjustThreshold = options.adjustThreshold || 3;
    this.onPresetChange = options.onPresetChange || null;
    
    this.enabled = false;
    this.currentPresetIndex = 2; // Default to 'medium'
    this.lowFPSCounter = 0;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.currentFPS = 0;
    this.monitorInterval = null;
    
    // Bind methods
    this.tick = this.tick.bind(this);
    this.checkFPS = this.checkFPS.bind(this);
  }
  
  /**
   * Start monitoring frame rate
   */
  start() {
    if (this.enabled) return;
    
    this.enabled = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    
    // Set up the post-render callback to count frames
    this.viewer.scene.postRender.addEventListener(this.tick);
    
    // Set up interval to check FPS periodically
    this.monitorInterval = setInterval(this.checkFPS, this.samplePeriod);
    
    console.log('Frame rate monitoring started');
  }
  
  /**
   * Stop monitoring frame rate
   */
  stop() {
    if (!this.enabled) return;
    
    this.enabled = false;
    this.viewer.scene.postRender.removeEventListener(this.tick);
    
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    
    console.log('Frame rate monitoring stopped');
  }
  
  /**
   * Post-render callback to count frames
   */
  tick() {
    if (!this.enabled) return;
    this.frameCount++;
  }
  
  /**
   * Check the current FPS and adjust settings if needed
   */
  checkFPS() {
    if (!this.enabled) return;
    
    const now = performance.now();
    const elapsed = now - this.lastFrameTime;
    this.currentFPS = (this.frameCount / elapsed) * 1000;
    
    console.log(`Current FPS: ${this.currentFPS.toFixed(1)}`);
    
    // Reset for next sample
    this.frameCount = 0;
    this.lastFrameTime = now;
    
    // Check if we need to adjust settings
    if (this.currentFPS < this.targetFPS) {
      this.lowFPSCounter++;
      
      if (this.lowFPSCounter >= this.adjustThreshold) {
        this.decreaseQuality();
        this.lowFPSCounter = 0;
      }
    } else {
      // Reset counter if FPS is good
      this.lowFPSCounter = 0;
    }
  }
  
  /**
   * Decrease the quality preset
   */
  decreaseQuality() {
    if (this.currentPresetIndex < AVAILABLE_PRESETS.length - 1) {
      this.currentPresetIndex++;
      const newPreset = AVAILABLE_PRESETS[this.currentPresetIndex];
      
      console.log(`Automatically decreasing quality to '${newPreset}' preset due to low frame rate`);
      applyPreset(newPreset, this.viewer);
      
      if (this.onPresetChange) {
        this.onPresetChange(newPreset);
      }
    }
  }
  
  /**
   * Manually set a specific preset
   * @param {string} preset - The preset name to apply
   */
  setPreset(preset) {
    const presetIndex = AVAILABLE_PRESETS.indexOf(preset);
    if (presetIndex !== -1) {
      this.currentPresetIndex = presetIndex;
      applyPreset(preset, this.viewer);
      
      if (this.onPresetChange) {
        this.onPresetChange(preset);
      }
    }
  }
  
  /**
   * Get the current FPS
   * @returns {number} Current frames per second
   */
  getFPS() {
    return this.currentFPS;
  }
  
  /**
   * Get the current preset
   * @returns {string} Current preset name
   */
  getCurrentPreset() {
    return AVAILABLE_PRESETS[this.currentPresetIndex];
  }
}

export default FrameRateMonitor; 