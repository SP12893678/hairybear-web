/**
 * Component Interface Contracts
 *
 * Defines the public APIs for all components in the 3D Bear web application.
 * These contracts serve as the implementation guide and ensure consistent
 * component communication patterns.
 *
 * Feature: 001-3d-bear-web-app
 * Last Updated: 2026-02-16
 */

import { ReactNode } from 'react';
import * as THREE from 'three';

// ============================================================================
// Type Definitions (from data-model.md)
// ============================================================================

export type ActionName =
  | 'hip-hop-dancing'
  | 'jumping'
  | 'punching'
  | 'running'
  | 'sitting-clap'
  | 'sitting-pose'
  | 'walking'
  | 'weaving'
  | 'cheering'
  | 'crying'
  | 'bowing'
  | 'noding'
  | 'head-spinning'
  | 'welcome'
  | 'clapping'
  | 'climbing'
  | 'run-away'
  | 'praying'
  | 'fall-down'
  | 'looking-right'
  | 'laying'
  | 'lying-down'
  | 'salute'
  | 'melee-attack'
  | 'heavy-hit'
  | 'look-around'
  | 'situp'
  | 'soul-spin'
  | 'break-dance'
  | 'swing-dance'
  | 'jogging-box'
  | 'clown-walk'
  | 'jumping-jack'
  | 'strong-gesture'
  | 'dancing'
  | 'praying-down'
  | 'silly-dancing'
  | 'standing-clap'
  | 'sneaking-right'
  | 'standing-torch-run-forward';

export type AnimationCategory = 'dance' | 'action' | 'gesture' | 'movement' | 'emotion';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type PerformanceTier = 'high' | 'medium' | 'low';
export type Orientation = 'portrait' | 'landscape';
export type LoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface ColorScheme {
  hueShift: number;
  colorFrequency: number;
  bloom: number;
  saturation: number;
}

export interface Animation {
  id: string;
  name: ActionName;
  displayName: string;
  thumbnail?: string;
  duration: number;
  colorScheme: ColorScheme;
  category: AnimationCategory;
}

// ============================================================================
// Component: BearModel
// ============================================================================

/**
 * BearModel Component
 *
 * Responsibility: Render and animate the 3D bear model using React Three Fiber
 *
 * Requirements:
 * - FR-003: Display 3D bear model centered on screen
 * - FR-004: Load bear model from hairybear-desktop assets
 * - FR-005: Auto-play default animation continuously
 * - FR-007: Switch animation when user selects different carousel item
 * - FR-009: Maintain continuous animation loop
 * - FR-011: Scale down bear model on mobile
 * - FR-014: Display error when model fails to load
 * - FR-015: Cancel in-progress transitions on rapid clicks
 * - FR-018: Reduce visual quality on low-end devices
 */
export interface BearModelProps {
  /**
   * Current animation to play
   * Triggers transition when changed
   */
  animation: ActionName;

  /**
   * Scale factor for the model
   * Desktop: 1.0, Mobile: 0.6-0.8
   */
  scale?: number;

  /**
   * Target frame rate based on device performance
   * High/Medium: 30, Low: 15-20
   */
  targetFPS?: number;

  /**
   * Performance tier for adaptive quality
   * Affects shadows, textures, post-processing
   */
  performanceTier?: PerformanceTier;

  /**
   * Callback when animation completes one loop
   * Useful for analytics or chaining animations
   */
  onAnimationComplete?: (animationName: ActionName) => void;

  /**
   * Callback when model loading fails
   * Triggers ErrorBoundary display
   */
  onLoadError?: (error: Error) => void;

  /**
   * Callback when model loads successfully
   * Can be used to hide loading spinner
   */
  onLoadComplete?: () => void;

  /**
   * Loading progress (0-100)
   * Updates during model fetch
   */
  onProgress?: (progress: number) => void;
}

/**
 * Expected behavior:
 * - Model loads from /assets/models/hairybear/hairybear.gltf
 * - Auto-plays first animation on mount
 * - Crossfades to new animation over 500ms when `animation` prop changes
 * - Cancels in-progress transition if new animation selected during transition
 * - Loops current animation continuously
 * - Scales down by `scale` factor (applies to entire Group)
 * - Reduces quality based on `performanceTier`:
 *   - Low: no shadows, half-res textures, no post-processing
 *   - Medium: simple shadows, full-res textures
 *   - High: full shadows, full-res textures, bloom
 * - Renders within React Three Fiber <Canvas> context
 */

// ============================================================================
// Component: AnimationCarousel
// ============================================================================

/**
 * AnimationCarousel Component
 *
 * Responsibility: Horizontal scrolling carousel for animation selection
 *
 * Requirements:
 * - FR-006: Display animation carousel at bottom of viewport
 * - FR-007: Switch animation when user selects item
 * - FR-013: Maintain functionality on mobile with touch
 * - FR-016: Support keyboard navigation (Tab, Enter/Space)
 */
export interface AnimationCarouselProps {
  /**
   * List of all available animations
   */
  animations: Animation[];

  /**
   * Currently selected animation index
   * Controlled component pattern
   */
  selectedIndex: number;

  /**
   * Callback when user selects different animation
   * @param index - Selected animation index (0-based)
   */
  onAnimationSelect: (index: number) => void;

  /**
   * Device type for responsive styling
   * Desktop: larger thumbnails, hover effects
   * Mobile: smaller thumbnails, touch-optimized spacing
   */
  deviceType?: DeviceType;

  /**
   * Optional CSS class for container
   */
  className?: string;
}

/**
 * Expected behavior:
 * - Renders horizontally scrolling list of animation items
 * - Each item shows thumbnail (if available) and displayName
 * - Highlights selected item with distinct visual style
 * - Click/tap on item calls onAnimationSelect with index
 * - Keyboard navigation:
 *   - Tab: Focus next/previous item
 *   - Enter/Space: Select focused item
 *   - Left/Right arrows: Navigate items
 * - Touch support:
 *   - Horizontal swipe to scroll
 *   - Tap to select
 * - Desktop hover effects on items
 * - Auto-scrolls selected item into view
 * - Positioned at bottom of viewport (position: fixed/absolute)
 * - Responsive sizing based on deviceType
 * - ARIA labels for accessibility (role="listbox", aria-label, aria-selected)
 */

// ============================================================================
// Component: ErrorBoundary
// ============================================================================

/**
 * ErrorBoundary Component
 *
 * Responsibility: Catch and display errors gracefully
 *
 * Requirements:
 * - FR-014: Display error when model fails, keep background and carousel functional
 */
export interface ErrorBoundaryProps {
  /**
   * Child components to wrap
   */
  children: ReactNode;

  /**
   * Fallback UI to display on error
   * If not provided, uses default error message
   */
  fallback?: ReactNode | ((error: Error) => ReactNode);

  /**
   * Callback when error is caught
   * For logging/analytics
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Expected behavior:
 * - Wraps BearModel component to catch loading/rendering errors
 * - On error:
 *   - Displays fallback UI in place of bear model
 *   - Keeps Prism background and AnimationCarousel functional
 *   - Calls onError callback if provided
 * - Error message should be user-friendly (avoid technical jargon)
 * - Does NOT crash entire app, only replaces bear model
 * - Allows retry mechanism (optional button to reload page)
 */

// ============================================================================
// Hook: useBearModel
// ============================================================================

/**
 * useBearModel Hook
 *
 * Responsibility: Manage bear model loading and animation state
 *
 * Provides centralized state management for model lifecycle
 */
export interface UseBearModelReturn {
  /**
   * Loaded GLTF scene (Three.js Group)
   * Null while loading or on error
   */
  model: THREE.Group | null;

  /**
   * Three.js AnimationMixer for controlling playback
   * Null until model loads
   */
  mixer: THREE.AnimationMixer | null;

  /**
   * Available animation clips from GLTF
   */
  animations: THREE.AnimationClip[];

  /**
   * Current loading status
   */
  status: LoadingStatus;

  /**
   * Error object if loading failed
   */
  error: Error | null;

  /**
   * Loading progress (0-100)
   */
  progress: number;

  /**
   * Play specific animation by name
   * Handles transition and looping
   */
  playAnimation: (name: ActionName) => void;

  /**
   * Stop all animations
   */
  stopAllAnimations: () => void;

  /**
   * Retry loading after error
   */
  retry: () => void;
}

/**
 * Usage:
 * ```tsx
 * const { model, mixer, status, playAnimation } = useBearModel({
 *   modelPath: '/assets/models/hairybear/hairybear.gltf',
 *   onLoadComplete: () => console.log('Model loaded'),
 *   onLoadError: (err) => console.error(err)
 * });
 *
 * useEffect(() => {
 *   if (status === 'loaded') {
 *     playAnimation('hip-hop-dancing');
 *   }
 * }, [status]);
 * ```
 */

export interface UseBearModelOptions {
  /**
   * Path to GLTF model file
   */
  modelPath: string;

  /**
   * Callback when model loads successfully
   */
  onLoadComplete?: () => void;

  /**
   * Callback when model loading fails
   */
  onLoadError?: (error: Error) => void;

  /**
   * Callback for progress updates
   */
  onProgress?: (progress: number) => void;
}

// ============================================================================
// Hook: useDevicePerformance
// ============================================================================

/**
 * useDevicePerformance Hook
 *
 * Responsibility: Detect device GPU capabilities and classify performance tier
 *
 * Requirements:
 * - FR-018: Automatically reduce quality on low-end devices
 */
export interface UseDevicePerformanceReturn {
  /**
   * Detected performance tier
   */
  tier: PerformanceTier;

  /**
   * Recommended target FPS
   * High/Medium: 30, Low: 15-20
   */
  targetFPS: number;

  /**
   * Whether device supports WebGL
   */
  supportsWebGL: boolean;

  /**
   * Detected GPU renderer string
   */
  gpuInfo: string;

  /**
   * Device pixel ratio
   */
  pixelRatio: number;

  /**
   * Manually override performance tier
   * For testing or user preference
   */
  setTier: (tier: PerformanceTier) => void;
}

/**
 * Detection logic:
 * - Checks WebGL context availability
 * - Measures initial frame timing (first 60 frames average)
 * - Parses GPU renderer string
 * - Classifies as high/medium/low based on:
 *   - Average FPS > 55 && not Intel integrated: high
 *   - Average FPS > 25: medium
 *   - Otherwise: low
 * - Detects mobile vs desktop via user agent
 * - Considers device pixel ratio (retina displays)
 */

// ============================================================================
// Hook: useResponsive
// ============================================================================

/**
 * useResponsive Hook
 *
 * Responsibility: Track viewport dimensions and device type
 *
 * Requirements:
 * - FR-010: Detect device type and apply responsive rules
 * - FR-017: Handle viewports < 320px
 */
export interface UseResponsiveReturn {
  /**
   * Current viewport width
   */
  width: number;

  /**
   * Current viewport height
   */
  height: number;

  /**
   * Detected device type
   */
  deviceType: DeviceType;

  /**
   * Current orientation
   */
  orientation: Orientation;

  /**
   * Breakpoint helpers
   */
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;

  /**
   * Whether viewport is below minimum width (320px)
   * Triggers horizontal scrolling
   */
  isBelowMinWidth: boolean;
}

/**
 * Breakpoints:
 * - Mobile: width < 768px
 * - Tablet: 768px <= width < 1024px
 * - Desktop: width >= 1024px
 *
 * Updates on window resize with debouncing (100ms)
 */

// ============================================================================
// Context: AppStateContext
// ============================================================================

/**
 * Global application state shared via React Context
 */
export interface AppState {
  /**
   * Current animation being played
   */
  currentAnimation: ActionName;

  /**
   * Update current animation
   * Triggers transition in BearModel
   */
  setCurrentAnimation: (animation: ActionName) => void;

  /**
   * Prism background color scheme
   * Synced with current animation
   */
  colorScheme: ColorScheme;

  /**
   * Update color scheme
   */
  setColorScheme: (scheme: ColorScheme) => void;

  /**
   * Viewport and device info
   */
  viewport: {
    width: number;
    height: number;
    deviceType: DeviceType;
    performanceTier: PerformanceTier;
  };

  /**
   * User preferences (persisted to localStorage)
   */
  preferences: {
    reducedMotion: boolean;
    qualityOverride?: PerformanceTier;
  };

  /**
   * Update user preferences
   */
  updatePreferences: (prefs: Partial<AppState['preferences']>) => void;
}

/**
 * Usage:
 * ```tsx
 * const { currentAnimation, setCurrentAnimation, colorScheme } = useAppState();
 *
 * const handleSelect = (index: number) => {
 *   const animation = animations[index];
 *   setCurrentAnimation(animation.name);
 * };
 * ```
 */

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Animation configuration map
 * Maps ActionName to Animation metadata
 */
export type AnimationConfigMap = Record<ActionName, Animation>;

/**
 * Performance settings by tier
 */
export interface PerformanceSettings {
  targetFPS: number;
  shadowsEnabled: boolean;
  textureQuality: 'low' | 'medium' | 'high';
  antialias: boolean;
  pixelRatio: number;
  prismSimplified: boolean;
}

/**
 * Responsive scale settings by device type
 */
export interface ResponsiveScale {
  bearScale: number;
  carouselHeight: number;
  thumbnailSize: number;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Standard transition duration for animation crossfade
 * Requirement: SC-003 - Animation switches occur within 0.5s
 */
export const ANIMATION_TRANSITION_DURATION = 500; // milliseconds

/**
 * Minimum viewport width
 * Requirement: FR-017 - Maintain 320px minimum
 */
export const MIN_VIEWPORT_WIDTH = 320;

/**
 * Performance tier settings
 */
export const PERFORMANCE_SETTINGS: Record<PerformanceTier, PerformanceSettings> = {
  high: {
    targetFPS: 30,
    shadowsEnabled: true,
    textureQuality: 'high',
    antialias: true,
    pixelRatio: Math.min(2, window.devicePixelRatio),
    prismSimplified: false
  },
  medium: {
    targetFPS: 30,
    shadowsEnabled: true,
    textureQuality: 'medium',
    antialias: false,
    pixelRatio: 1,
    prismSimplified: false
  },
  low: {
    targetFPS: 18, // 15-20 range
    shadowsEnabled: false,
    textureQuality: 'low',
    antialias: false,
    pixelRatio: 1,
    prismSimplified: true
  }
};

/**
 * Responsive scale settings
 */
export const RESPONSIVE_SCALES: Record<DeviceType, ResponsiveScale> = {
  desktop: {
    bearScale: 1.0,
    carouselHeight: 120,
    thumbnailSize: 80
  },
  tablet: {
    bearScale: 0.8,
    carouselHeight: 100,
    thumbnailSize: 64
  },
  mobile: {
    bearScale: 0.6,
    carouselHeight: 80,
    thumbnailSize: 48
  }
};

/**
 * Device type breakpoints (in pixels)
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024
} as const;
