# Quickstart Guide: 3D Bear Interactive Web App

**Feature**: 001-3d-bear-web-app
**Branch**: `001-3d-bear-web-app`
**Last Updated**: 2026-02-16

## Overview

This guide provides step-by-step instructions for implementing the 3D Bear Interactive Web App. Follow this guide to build a fullscreen web application featuring an animated 3D bear model with interactive carousel controls and responsive Prism background.

**Estimated Implementation Time**: 12-16 hours (across 3-4 development sessions)

---

## Prerequisites

### Required Knowledge

- TypeScript and React functional components
- Basic Three.js concepts (scenes, meshes, materials)
- React hooks (useState, useEffect, useContext, custom hooks)
- Tailwind CSS utility classes
- WebGL basics (contexts, rendering loops)

### Required Tools

- Node.js 18+ and npm/yarn
- Modern code editor (VS Code recommended)
- Git for version control
- Modern browser with WebGL support for testing

### Existing Project Setup

✅ Already configured:
- Vite 7.2 + React 19.2 + TypeScript 5.9
- Tailwind CSS 4.1
- OGL library for Prism component
- ESLint + TypeScript ESLint

❌ Need to install:
- React Three Fiber ecosystem
- GLTF model assets

---

## Step 1: Install Dependencies

### Add React Three Fiber Packages

```bash
npm install @react-three/fiber @react-three/drei three
npm install --save-dev @types/three
```

**Why these packages?**
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Helpful utilities (useGLTF, useAnimations)
- `three`: Core 3D library
- `@types/three`: TypeScript definitions

**Verification**:
```bash
npm list @react-three/fiber @react-three/drei three
```

---

## Step 2: Copy Model Assets

### Obtain Bear Model Files

Copy the following files from `hairybear-desktop` project:

```bash
# Create directories
mkdir -p public/assets/models/hairybear

# Copy model files (adjust source path as needed)
cp /path/to/hairybear-desktop/apps/frontend/src/assets/models/hairybear/hairybear.gltf \
   public/assets/models/hairybear/

cp /path/to/hairybear-desktop/apps/frontend/src/assets/models/hairybear/hairybear.bin \
   public/assets/models/hairybear/

cp /path/to/hairybear-desktop/apps/frontend/src/assets/models/hairybear/Image_0.png \
   public/assets/models/hairybear/
```

**Verification**:
```bash
ls -lh public/assets/models/hairybear/
# Should show:
# - hairybear.gltf (~1.2MB)
# - hairybear.bin (~7.6MB)
# - Image_0.png (~25MB)
```

**⚠️ Important**: Do NOT commit these large files to git. Add to `.gitignore`:

```bash
echo "public/assets/models/" >> .gitignore
```

---

## Step 3: Create Type Definitions

### src/types/bear.types.ts

Copy type definitions from `contracts/component-interfaces.ts`:

```typescript
// src/types/bear.types.ts
export type ActionName =
  | 'hip-hop-dancing'
  | 'jumping'
  | 'punching'
  // ... (all 40 animation names)
  | 'standing-torch-run-forward';

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
  category: 'dance' | 'action' | 'gesture' | 'movement' | 'emotion';
}

// ... (other types from contracts)
```

**Tip**: Copy the complete type definitions from `contracts/component-interfaces.ts` to ensure consistency.

---

## Step 4: Configure Animation Metadata

### src/utils/animation-config.ts

Create animation configuration with color schemes:

```typescript
import { Animation, ActionName, AnimationConfigMap } from '@/types/bear.types';

export const ANIMATION_CONFIG: AnimationConfigMap = {
  'hip-hop-dancing': {
    id: 'hip-hop-dancing',
    name: 'hip-hop-dancing',
    displayName: 'Hip Hop Dancing',
    duration: 3.5,
    colorScheme: {
      hueShift: 0.8,
      colorFrequency: 1.5,
      bloom: 1.8,
      saturation: 1.7
    },
    category: 'dance'
  },
  'jumping': {
    id: 'jumping',
    name: 'jumping',
    displayName: 'Jumping',
    duration: 1.2,
    colorScheme: {
      hueShift: 0.3,
      colorFrequency: 1.8,
      bloom: 1.5,
      saturation: 1.5
    },
    category: 'action'
  },
  // ... (define all 40 animations)
};

export const ANIMATIONS = Object.values(ANIMATION_CONFIG);

export function getAnimationByName(name: ActionName): Animation | undefined {
  return ANIMATION_CONFIG[name];
}
```

**Tip**: Start with 5-10 animations for initial testing, add remaining later.

---

## Step 5: Build Custom Hooks

### 5a. useDevicePerformance Hook

```typescript
// src/hooks/useDevicePerformance.ts
import { useState, useEffect } from 'react';
import { PerformanceTier } from '@/types/bear.types';

export function useDevicePerformance() {
  const [tier, setTier] = useState<PerformanceTier>('medium');
  const [gpuInfo, setGpuInfo] = useState<string>('');
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    // Detect WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      setSupportsWebGL(false);
      setTier('low');
      return;
    }

    // Get GPU info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      setGpuInfo(renderer);

      // Classify based on GPU
      if (renderer.includes('Intel')) {
        setTier('medium');
      } else if (renderer.includes('NVIDIA') || renderer.includes('AMD')) {
        setTier('high');
      }
    }

    // Mobile detection
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setTier(prev => prev === 'high' ? 'medium' : 'low');
    }
  }, []);

  const targetFPS = tier === 'low' ? 18 : 30;

  return {
    tier,
    targetFPS,
    supportsWebGL,
    gpuInfo,
    pixelRatio: Math.min(2, window.devicePixelRatio),
    setTier
  };
}
```

### 5b. useResponsive Hook

```typescript
// src/hooks/useResponsive.ts
import { useState, useEffect } from 'react';
import { DeviceType, Orientation } from '@/types/bear.types';

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024
};

export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }, 100); // Debounce 100ms
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const deviceType: DeviceType =
    width < BREAKPOINTS.mobile ? 'mobile' :
    width < BREAKPOINTS.tablet ? 'tablet' : 'desktop';

  const orientation: Orientation = width > height ? 'landscape' : 'portrait';

  return {
    width,
    height,
    deviceType,
    orientation,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    isBelowMinWidth: width < 320
  };
}
```

### 5c. useBearModel Hook

```typescript
// src/hooks/useBearModel.ts
import { useState, useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { ActionName, LoadingStatus } from '@/types/bear.types';

const MODEL_PATH = '/assets/models/hairybear/hairybear.gltf';

export function useBearModel() {
  const [status, setStatus] = useState<LoadingStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const group = useRef<THREE.Group>(null);

  // Load GLTF model
  const { scene, animations } = useGLTF(MODEL_PATH, true, true, (loader) => {
    loader.manager.onProgress = (url, loaded, total) => {
      setProgress((loaded / total) * 100);
    };
    loader.manager.onError = (url) => {
      setError(new Error(`Failed to load: ${url}`));
      setStatus('error');
    };
  });

  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (scene && animations.length > 0) {
      setStatus('loaded');
      setProgress(100);
    }
  }, [scene, animations]);

  const playAnimation = (name: ActionName) => {
    if (!actions[name]) {
      console.warn(`Animation "${name}" not found`);
      return;
    }

    // Crossfade to new animation
    const action = actions[name];

    // Stop all other animations
    Object.values(actions).forEach(a => {
      if (a && a !== action) {
        a.fadeOut(0.5);
      }
    });

    // Play new animation
    action?.reset().fadeIn(0.5).play();
  };

  const stopAllAnimations = () => {
    Object.values(actions).forEach(action => {
      action?.stop();
    });
  };

  return {
    model: scene,
    mixer,
    animations,
    status,
    error,
    progress,
    playAnimation,
    stopAllAnimations,
    groupRef: group
  };
}

// Preload model
useGLTF.preload(MODEL_PATH);
```

---

## Step 6: Create Components

### 6a. BearModel Component

```tsx
// src/components/BearModel.tsx
import { useEffect } from 'react';
import { useBearModel } from '@/hooks/useBearModel';
import { ActionName, PerformanceTier } from '@/types/bear.types';
import { useFrame } from '@react-three/fiber';

interface BearModelProps {
  animation: ActionName;
  scale?: number;
  targetFPS?: number;
  performanceTier?: PerformanceTier;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export function BearModel({
  animation,
  scale = 1.0,
  targetFPS = 30,
  performanceTier = 'high',
  onLoadComplete,
  onLoadError
}: BearModelProps) {
  const { model, mixer, status, error, playAnimation, groupRef } = useBearModel();

  // Handle load complete/error
  useEffect(() => {
    if (status === 'loaded' && onLoadComplete) {
      onLoadComplete();
    }
    if (status === 'error' && error && onLoadError) {
      onLoadError(error);
    }
  }, [status, error, onLoadComplete, onLoadError]);

  // Play animation when prop changes
  useEffect(() => {
    if (status === 'loaded') {
      playAnimation(animation);
    }
  }, [animation, status, playAnimation]);

  // Update mixer on each frame
  const frameDelta = 1 / targetFPS;
  useFrame((state, delta) => {
    const cappedDelta = Math.min(delta, frameDelta * 2); // Prevent huge jumps
    mixer?.update(cappedDelta);
  });

  if (status !== 'loaded' || !model) {
    return null; // Loading handled by parent
  }

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={model} />
      {performanceTier === 'high' && (
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      )}
      <ambientLight intensity={0.5} />
    </group>
  );
}
```

### 6b. AnimationCarousel Component

```tsx
// src/components/AnimationCarousel.tsx
import { useEffect, useRef } from 'react';
import { Animation, DeviceType } from '@/types/bear.types';
import { cn } from '@/lib/utils';

interface AnimationCarouselProps {
  animations: Animation[];
  selectedIndex: number;
  onAnimationSelect: (index: number) => void;
  deviceType?: DeviceType;
  className?: string;
}

export function AnimationCarousel({
  animations,
  selectedIndex,
  onAnimationSelect,
  deviceType = 'desktop',
  className
}: AnimationCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (containerRef.current) {
      const selectedItem = containerRef.current.children[selectedIndex] as HTMLElement;
      selectedItem?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedIndex]);

  const itemSize = deviceType === 'mobile' ? 48 : deviceType === 'tablet' ? 64 : 80;

  return (
    <div className={cn('fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm', className)}>
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-4 p-4 scroll-smooth"
        role="listbox"
        aria-label="Animation selection"
      >
        {animations.map((anim, index) => (
          <button
            key={anim.id}
            onClick={() => onAnimationSelect(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAnimationSelect(index);
              }
            }}
            className={cn(
              'flex flex-col items-center flex-shrink-0 p-2 rounded-lg transition-all',
              'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50',
              selectedIndex === index && 'bg-white/20 ring-2 ring-white'
            )}
            style={{ width: itemSize + 32 }}
            role="option"
            aria-selected={selectedIndex === index}
            tabIndex={selectedIndex === index ? 0 : -1}
          >
            <div
              className="bg-gray-700 rounded-md flex items-center justify-center text-white/50 text-xs"
              style={{ width: itemSize, height: itemSize }}
            >
              {anim.thumbnail ? (
                <img src={anim.thumbnail} alt={anim.displayName} className="w-full h-full object-cover rounded-md" />
              ) : (
                anim.displayName.slice(0, 3)
              )}
            </div>
            <span className="text-xs text-white mt-1 text-center truncate w-full">
              {anim.displayName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### 6c. ErrorBoundary Component

```tsx
// src/components/ErrorBoundary.tsx
import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center h-full text-white text-center p-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Failed to load 3D model</h2>
            <p className="text-gray-300 mb-4">
              {this.state.error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Step 7: Update App Component

### src/App.tsx

```tsx
import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Prism from '@/components/Prism';
import { BearModel } from '@/components/BearModel';
import { AnimationCarousel } from '@/components/AnimationCarousel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';
import { useResponsive } from '@/hooks/useResponsive';
import { ANIMATIONS } from '@/utils/animation-config';
import { ActionName } from '@/types/bear.types';

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { tier, targetFPS } = useDevicePerformance();
  const { deviceType, isBelowMinWidth } = useResponsive();

  const currentAnimation = ANIMATIONS[selectedIndex];
  const bearScale = deviceType === 'mobile' ? 0.6 : deviceType === 'tablet' ? 0.8 : 1.0;

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ minWidth: 320 }}>
      {/* Prism Background */}
      <div className="absolute inset-0">
        <Prism
          hueShift={currentAnimation.colorScheme.hueShift}
          colorFrequency={currentAnimation.colorScheme.colorFrequency}
          bloom={currentAnimation.colorScheme.bloom}
          animationType="3drotate"
          suspendWhenOffscreen
        />
      </div>

      {/* 3D Bear Model */}
      <div className="absolute inset-0 pointer-events-none">
        <ErrorBoundary>
          <Canvas
            camera={{ position: [0, 1, 5], fov: 50 }}
            dpr={tier === 'high' ? 2 : 1}
          >
            <BearModel
              animation={currentAnimation.name}
              scale={bearScale}
              targetFPS={targetFPS}
              performanceTier={tier}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Animation Carousel */}
      <AnimationCarousel
        animations={ANIMATIONS}
        selectedIndex={selectedIndex}
        onAnimationSelect={setSelectedIndex}
        deviceType={deviceType}
      />

      {/* Horizontal scroll warning for very small screens */}
      {isBelowMinWidth && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center p-2 text-sm">
          Screen width below 320px - horizontal scrolling enabled
        </div>
      )}
    </div>
  );
}

export default App;
```

---

## Step 8: Testing

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### Test Checklist

- [ ] Page loads without errors
- [ ] Prism background visible and animating
- [ ] 3D bear model appears centered
- [ ] Default animation plays automatically and loops
- [ ] Carousel displays at bottom
- [ ] Clicking carousel items switches animations
- [ ] Animation transitions are smooth (500ms)
- [ ] Rapid clicks don't queue animations
- [ ] Keyboard Tab/Enter/Space works on carousel
- [ ] Responsive on mobile (test with DevTools)
- [ ] Bear scales down on mobile viewport
- [ ] Performance acceptable on simulated slow device

---

## Step 9: Production Build

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment

Upload `dist/` directory to your hosting provider (Vercel, Netlify, etc.)

**Remember**: Ensure model assets are accessible in production (consider CDN for large files)

---

## Troubleshooting

### Model Doesn't Load

**Check**:
1. Files exist in `public/assets/models/hairybear/`
2. Console for CORS errors
3. Network tab for 404s
4. File paths are correct (case-sensitive on Linux)

**Fix**: Verify file paths and rebuild

### Animations Don't Play

**Check**:
1. Console for "Animation not found" warnings
2. Animation names match exactly (case-sensitive)
3. `useAnimations` hook is receiving animations array

**Fix**: Compare animation names in GLTF with ActionName type

### Poor Performance

**Check**:
1. Performance tier detection in console
2. GPU info via `useDevicePerformance`
3. FPS counter (add via React DevTools Profiler)

**Fix**:
- Manually set tier to 'low' for testing
- Reduce `pixelRatio` in Canvas
- Disable shadows on low-tier devices

### Carousel Not Scrolling

**Check**:
1. `overflow-x-auto` class applied
2. Items have `flex-shrink-0`
3. Parent container has defined width

**Fix**: Inspect with DevTools, ensure Tailwind classes compile correctly

---

## Next Steps

After completing the basic implementation:

1. **Add Animation Thumbnails**: Generate preview images for each animation
2. **Implement Tests**: Write unit tests for hooks and components
3. **Performance Monitoring**: Add FPS counter and performance metrics
4. **Accessibility Audit**: Test with screen readers, keyboard-only navigation
5. **Mobile Optimization**: Fine-tune touch gestures and mobile performance
6. **Error Tracking**: Integrate Sentry or similar for production error monitoring

---

## Additional Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [@react-three/drei Helpers](https://github.com/pmndrs/drei)
- [GLTF Model Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
- [WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

---

## Support

For questions or issues specific to this feature:

1. Review `specs/001-3d-bear-web-app/plan.md` for architecture decisions
2. Check `specs/001-3d-bear-web-app/research.md` for technical deep-dives
3. Consult `specs/001-3d-bear-web-app/data-model.md` for type definitions
4. Reference `specs/001-3d-bear-web-app/contracts/` for component interfaces

**Happy coding!** 🐻
