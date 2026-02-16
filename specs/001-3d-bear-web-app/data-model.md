# Data Model: 3D Bear Interactive Web App

**Feature**: 001-3d-bear-web-app
**Last Updated**: 2026-02-16

## Overview

This document defines the data structures, types, and state management for the 3D Bear web application. The app manages 3D model state, animation playback, UI interactions, and device-specific configurations.

## Core Entities

### Animation

Represents a single bear animation clip with associated metadata and visual configuration.

**TypeScript Definition**:
```typescript
interface Animation {
  id: string;                    // Unique identifier (matches GLTF animation name)
  name: ActionName;              // Type-safe animation name
  displayName: string;           // Human-readable label for UI
  thumbnail?: string;            // Optional preview image path
  duration: number;              // Animation length in seconds
  colorScheme: ColorScheme;      // Associated Prism background colors
  category: AnimationCategory;   // Grouping for UI organization
}

type ActionName =
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

type AnimationCategory =
  | 'dance'
  | 'action'
  | 'gesture'
  | 'movement'
  | 'emotion';
```

**Attributes**:
- `id`: Unique identifier matching GLTF clip name
- `name`: Type-safe string literal from 40+ predefined animations
- `displayName`: Formatted text for carousel display (e.g., "Hip Hop Dancing")
- `thumbnail`: Optional path to preview image in public/assets/thumbnails/
- `duration`: Clip length extracted from GLTF, used for looping
- `colorScheme`: RGB values for Prism background synchronization
- `category`: Logical grouping for potential filtering/organization

**Relationships**:
- One Animation has one ColorScheme
- Animations belong to one AnimationCategory

**Validation Rules**:
- `id` must be non-empty string
- `name` must match ActionName union type
- `duration` must be positive number > 0
- `colorScheme` must have valid RGB values (0-255)

---

### ColorScheme

Defines Prism background visual configuration for each animation.

**TypeScript Definition**:
```typescript
interface ColorScheme {
  hueShift: number;          // Prism hue rotation in radians
  colorFrequency: number;    // Color oscillation speed (0.5-2.0)
  bloom: number;             // Glow intensity (0.5-2.0)
  saturation: number;        // Color saturation multiplier (1.0-2.0)
}
```

**Attributes**:
- `hueShift`: Rotation value in radians for hue transformation (-π to π)
- `colorFrequency`: Affects color variation speed, higher = more dynamic
- `bloom`: Controls glow/brightness intensity
- `saturation`: Color intensity, 1.0 = normal, 2.0 = vivid

**Validation Rules**:
- `hueShift`: -3.14159 to 3.14159 (−π to π)
- `colorFrequency`: 0.5 to 2.0
- `bloom`: 0.5 to 2.0
- `saturation`: 1.0 to 2.0

---

### ViewportState

Tracks current viewport dimensions and device characteristics.

**TypeScript Definition**:
```typescript
interface ViewportState {
  width: number;              // Current viewport width in pixels
  height: number;             // Current viewport height in pixels
  deviceType: DeviceType;     // Detected device category
  performanceTier: PerformanceTier;  // GPU capability level
  orientation: Orientation;   // Portrait or landscape
  pixelRatio: number;         // Device pixel ratio (1-3)
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type PerformanceTier = 'high' | 'medium' | 'low';
type Orientation = 'portrait' | 'landscape';
```

**Attributes**:
- `width`/`height`: Current browser viewport dimensions
- `deviceType`: Classification based on width breakpoints
- `performanceTier`: GPU capability detected via feature tests
- `orientation`: Screen orientation
- `pixelRatio`: Device pixel density (affects rendering quality)

**Breakpoints**:
- Desktop: ≥1024px width
- Tablet: 768px-1023px width
- Mobile: <768px width

**Performance Detection**:
- High: GPU supports 60fps, >2GB VRAM estimated
- Medium: GPU supports 30fps, standard mobile GPU
- Low: Older mobile GPUs, throttled rendering

---

### ModelState

Tracks 3D model loading and runtime state.

**TypeScript Definition**:
```typescript
interface ModelState {
  status: LoadingStatus;
  error: ModelError | null;
  progress: number;           // 0-100
  model: THREE.Group | null;  // Loaded GLTF scene
  mixer: THREE.AnimationMixer | null;  // Animation controller
}

type LoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface ModelError {
  code: ErrorCode;
  message: string;
  recoverable: boolean;
}

type ErrorCode =
  | 'NETWORK_ERROR'
  | 'PARSE_ERROR'
  | 'WEBGL_NOT_SUPPORTED'
  | 'WEBGL_CONTEXT_LOST'
  | 'INSUFFICIENT_MEMORY';
```

**Attributes**:
- `status`: Current loading phase
- `error`: Error details if loading fails
- `progress`: Loading percentage for UI feedback
- `model`: Three.js Group containing loaded GLTF scene
- `mixer`: AnimationMixer for controlling playback

**State Transitions**:
```
idle → loading → loaded
       ↓
     error (recoverable: true) → loading (retry)
     error (recoverable: false) → error (terminal)
```

---

### AnimationPlaybackState

Manages current animation playback.

**TypeScript Definition**:
```typescript
interface AnimationPlaybackState {
  currentAnimation: ActionName;
  previousAnimation: ActionName | null;
  transitionProgress: number;   // 0-1 during transitions
  isTransitioning: boolean;
  timeScale: number;            // Playback speed multiplier
  targetFPS: number;            // Device-specific FPS target
}
```

**Attributes**:
- `currentAnimation`: Active animation clip name
- `previousAnimation`: Previous clip (for transition blending)
- `transitionProgress`: Crossfade progress (0 = old, 1 = new)
- `isTransitioning`: True during 500ms transition window
- `timeScale`: Speed multiplier (1.0 = normal, 0.5 = slow motion)
- `targetFPS`: Performance-adjusted FPS (30 or 15-20)

**Validation Rules**:
- `currentAnimation` must be valid ActionName
- `transitionProgress`: 0.0 to 1.0
- `timeScale`: 0.1 to 2.0
- `targetFPS`: 15, 20, or 30 (based on performanceTier)

---

### CarouselState

UI state for animation selection carousel.

**TypeScript Definition**:
```typescript
interface CarouselState {
  selectedIndex: number;        // Current selection (0-based)
  scrollPosition: number;       // Horizontal scroll offset in pixels
  visibleRange: [number, number];  // [startIndex, endIndex]
  animations: Animation[];      // Full list of available animations
}
```

**Attributes**:
- `selectedIndex`: Currently active animation index
- `scrollPosition`: For smooth scrolling behavior
- `visibleRange`: Indices of animations in viewport (virtualization)
- `animations`: Complete animation catalog

**Validation Rules**:
- `selectedIndex`: 0 to animations.length - 1
- `scrollPosition`: ≥ 0
- `visibleRange[0]` ≤ `visibleRange[1]`

---

## Application State

### Global State Structure

```typescript
interface AppState {
  viewport: ViewportState;
  model: ModelState;
  playback: AnimationPlaybackState;
  carousel: CarouselState;
  userPreferences: UserPreferences;
}

interface UserPreferences {
  reducedMotion: boolean;       // Respects prefers-reduced-motion
  qualityOverride?: PerformanceTier;  // Manual quality selection
}
```

### State Management Strategy

**Approach**: React Context + useReducer for global state, local useState for component-specific UI.

**State Partitions**:
1. **Viewport State**: React Context, updates on resize/orientation change
2. **Model State**: React Context, managed by useBearModel hook
3. **Playback State**: React Context, shared between BearModel and Carousel
4. **Carousel State**: Local component state (AnimationCarousel)
5. **User Preferences**: Local Storage + React Context

**Persistence**:
- `userPreferences`: Saved to localStorage on change
- `carousel.selectedIndex`: Session storage (restore on refresh)
- Other state: Ephemeral (reset on page load)

---

## Data Flow

### Animation Selection Flow

```
User clicks carousel item
  ↓
CarouselState.selectedIndex updated
  ↓
AnimationPlaybackState.previousAnimation = current
AnimationPlaybackState.currentAnimation = new selection
AnimationPlaybackState.isTransitioning = true
  ↓
BearModel component receives new currentAnimation
  ↓
THREE.AnimationMixer crossfades over 500ms
  ↓
Prism component receives new colorScheme
  ↓
AnimationPlaybackState.isTransitioning = false (after 500ms)
```

### Model Loading Flow

```
App component mounts
  ↓
ModelState.status = 'loading'
  ↓
useGLTF hook fetches /assets/models/hairybear/hairybear.gltf
  ↓
Progress updates → ModelState.progress (0-100)
  ↓
Success:
  ModelState.status = 'loaded'
  ModelState.model = loaded GLTF scene
  ModelState.mixer = new AnimationMixer
  AnimationPlaybackState.currentAnimation = default (first in list)
  ↓
Error:
  ModelState.status = 'error'
  ModelState.error = { code, message, recoverable }
  → Display ErrorBoundary UI
```

### Performance Adaptation Flow

```
App initializes
  ↓
useDevicePerformance hook runs:
  - Detect GPU via WebGL context
  - Measure frame timing
  - Classify as high/medium/low tier
  ↓
ViewportState.performanceTier set
  ↓
AnimationPlaybackState.targetFPS adjusted:
  - High: 30 FPS
  - Medium: 30 FPS
  - Low: 15-20 FPS
  ↓
BearModel applies:
  - Reduced shadows (low tier)
  - Lower texture resolution (low tier)
  - Simplified Prism effects (low tier)
```

---

## Data Validation

### Runtime Checks

```typescript
// Animation selection validation
function validateAnimationSelection(index: number, animations: Animation[]): boolean {
  return index >= 0 && index < animations.length;
}

// Color scheme validation
function validateColorScheme(scheme: ColorScheme): boolean {
  return (
    scheme.hueShift >= -Math.PI && scheme.hueShift <= Math.PI &&
    scheme.colorFrequency >= 0.5 && scheme.colorFrequency <= 2.0 &&
    scheme.bloom >= 0.5 && scheme.bloom <= 2.0 &&
    scheme.saturation >= 1.0 && scheme.saturation <= 2.0
  );
}

// Performance tier derivation
function derivePerformanceTier(fps: number, gpu: string): PerformanceTier {
  if (fps >= 55 && !gpu.includes('Intel')) return 'high';
  if (fps >= 25) return 'medium';
  return 'low';
}
```

---

## Example Data

### Sample Animation Configuration

```typescript
const sampleAnimation: Animation = {
  id: 'hip-hop-dancing',
  name: 'hip-hop-dancing',
  displayName: 'Hip Hop Dancing',
  thumbnail: '/assets/thumbnails/hip-hop-dancing.jpg',
  duration: 3.5,
  colorScheme: {
    hueShift: 0.8,        // Purple-ish tint
    colorFrequency: 1.5,  // Dynamic colors
    bloom: 1.8,           // High glow
    saturation: 1.7       // Vivid
  },
  category: 'dance'
};
```

### Sample Application State

```typescript
const initialAppState: AppState = {
  viewport: {
    width: 1920,
    height: 1080,
    deviceType: 'desktop',
    performanceTier: 'high',
    orientation: 'landscape',
    pixelRatio: 2
  },
  model: {
    status: 'idle',
    error: null,
    progress: 0,
    model: null,
    mixer: null
  },
  playback: {
    currentAnimation: 'hip-hop-dancing',
    previousAnimation: null,
    transitionProgress: 0,
    isTransitioning: false,
    timeScale: 1.0,
    targetFPS: 30
  },
  carousel: {
    selectedIndex: 0,
    scrollPosition: 0,
    visibleRange: [0, 10],
    animations: [] // Populated from animation-config.ts
  },
  userPreferences: {
    reducedMotion: false,
    qualityOverride: undefined
  }
};
```

---

## Notes

### Type Safety

All entities use TypeScript strict mode with:
- No implicit any
- Strict null checks enabled
- Discriminated unions for state variants

### Immutability

State updates follow immutable patterns:
```typescript
// Good: Spread operator creates new objects
const newState = {
  ...state,
  playback: {
    ...state.playback,
    currentAnimation: 'jumping'
  }
};

// Bad: Direct mutation
state.playback.currentAnimation = 'jumping'; // ❌
```

### Error Handling

- Network errors: Retryable with exponential backoff
- WebGL errors: Non-retryable, show fallback UI
- Parse errors: Log to console, show error boundary

### Future Considerations

- Animation playlists: Sequential playback of multiple animations
- Custom color schemes: User-editable color mappings
- Performance metrics: FPS counter, frame time graphs
- Animation bookmarks: Save favorite animations to localStorage
