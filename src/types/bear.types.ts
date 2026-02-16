/**
 * Type Definitions for 3D Bear Interactive Web App
 * Feature: 001-3d-bear-web-app
 */

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

export interface ViewportState {
  width: number;
  height: number;
  deviceType: DeviceType;
  performanceTier: PerformanceTier;
  orientation: Orientation;
  pixelRatio: number;
}

export interface ModelState {
  status: LoadingStatus;
  error: Error | null;
  progress: number;
  model: any | null; // THREE.Group
  mixer: any | null; // THREE.AnimationMixer
}

export interface AnimationPlaybackState {
  currentAnimation: ActionName;
  previousAnimation: ActionName | null;
  transitionProgress: number;
  isTransitioning: boolean;
  timeScale: number;
  targetFPS: number;
}

export interface CarouselState {
  selectedIndex: number;
  scrollPosition: number;
  visibleRange: [number, number];
  animations: Animation[];
}

export interface UserPreferences {
  reducedMotion: boolean;
  qualityOverride?: PerformanceTier;
}

export interface AppState {
  viewport: ViewportState;
  model: ModelState;
  playback: AnimationPlaybackState;
  carousel: CarouselState;
  userPreferences: UserPreferences;
}

export type AnimationConfigMap = Record<ActionName, Animation>;

export interface PerformanceSettings {
  targetFPS: number;
  shadowsEnabled: boolean;
  textureQuality: 'low' | 'medium' | 'high';
  antialias: boolean;
  pixelRatio: number;
  prismSimplified: boolean;
}

export interface ResponsiveScale {
  bearScale: number;
  carouselHeight: number;
  thumbnailSize: number;
}

export const ANIMATION_TRANSITION_DURATION = 500; // milliseconds
export const MIN_VIEWPORT_WIDTH = 320;

export const PERFORMANCE_SETTINGS: Record<PerformanceTier, PerformanceSettings> = {
  high: {
    targetFPS: 30,
    shadowsEnabled: true,
    textureQuality: 'high',
    antialias: true,
    pixelRatio: Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1),
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
    targetFPS: 18,
    shadowsEnabled: false,
    textureQuality: 'low',
    antialias: false,
    pixelRatio: 1,
    prismSimplified: true
  }
};

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

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024
} as const;
