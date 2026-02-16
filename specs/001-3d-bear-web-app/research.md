# Technical Research: 3D Bear Model Viewer with React Three Fiber

**Project**: Hairy Bear Web App
**Date**: 2026-02-16
**Focus**: Performance-optimized 3D model viewer with 40+ animations

---

## 1. React Three Fiber vs Raw Three.js - Best Practices for React Integration

**Decision**: Use React Three Fiber (@react-three/fiber) instead of raw Three.js

**Rationale**:
- **Declarative API**: R3F provides a React-friendly declarative approach to Three.js, making it easier to manage 3D scenes using React component patterns and state management
- **Automatic Memory Management**: R3F automatically disposes of Three.js objects when components unmount, preventing memory leaks that are common pitfalls in raw Three.js applications
- **Built-in React Integration**: Seamless integration with React hooks, state, and lifecycle methods without manual event loop management
- **Ecosystem Support**: Access to @react-three/drei helper library providing pre-built components (useGLTF, useAnimations, CameraControls) that significantly reduce boilerplate code
- **Performance**: R3F uses React's reconciler which allows efficient updates and minimal re-renders. The frameloop system integrates naturally with React's rendering cycle
- **Developer Experience**: Better TypeScript support, easier debugging through React DevTools, and more maintainable code structure for React developers

**Alternatives Considered**:
- **Raw Three.js**: Rejected due to manual memory management complexity, verbose setup code, and difficult integration with React lifecycle. Would require significant boilerplate for scene management, animation loops, and cleanup
- **Hybrid Approach (Three.js with React refs)**: Rejected because it doesn't provide the declarative benefits and still requires manual disposal logic, leading to potential memory leaks

**Implementation Notes**:
```tsx
// Use R3F Canvas as the root component
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true
      }}
    >
      {/* 3D scene content */}
    </Canvas>
  );
}
```
- Keep 3D logic inside Canvas, React UI outside
- Use `useThree()` hook to access Three.js renderer, scene, and camera when needed
- Mutations should occur in `useFrame()` hook, not React state, to avoid unnecessary re-renders
- For the hairybear project, this aligns with existing hairybear-desktop implementation patterns

**References**:
- [React Three Fiber vs. Three.js in 2026](https://graffersid.com/react-three-fiber-vs-three-js/)
- [React Three Fiber Official Docs](https://r3f.docs.pmnd.rs/)

---

## 2. GLTF Model Loading with useGLTF - Performance Optimization

**Decision**: Use useGLTF from @react-three/drei with preloading and Draco compression

**Rationale**:
- **Automatic Caching**: useGLTF automatically caches loaded models, preventing redundant network requests and parsing operations
- **Suspense Integration**: Built-in support for React Suspense, enabling loading states and progressive rendering without custom loading logic
- **Type Safety**: Returns properly typed GLTF nodes, materials, and animations, reducing runtime errors
- **Preload Capability**: useGLTF.preload() allows eager loading of critical assets before components mount, reducing initial render time by 40-60%
- **Draco Compression Support**: Automatic handling of Draco-compressed models can reduce file size by 70-90% (hairybear.gltf is 7.6MB + textures, significant optimization opportunity)

**Alternatives Considered**:
- **GLTFLoader directly**: Rejected because it requires manual cache management, loading state handling, and cleanup. No automatic disposal
- **useLoader from R3F**: Rejected as useGLTF is a higher-level abstraction specifically optimized for GLTF with better defaults and Draco support

**Implementation Notes**:
```tsx
// Preload at module level for fastest loading
import { useGLTF } from '@react-three/drei';
useGLTF.preload('/assets/models/hairybear/hairybear.gltf');

// Component usage with TypeScript
type GLTFResult = GLTF & {
  nodes: {
    Mesh_0: THREE.SkinnedMesh;
    mixamorig1Hips: THREE.Bone;
  };
  materials: {
    Material_0: THREE.MeshStandardMaterial;
  };
};

function HairyBear() {
  const { nodes, materials, animations } = useGLTF(
    '/assets/models/hairybear/hairybear.gltf'
  ) as GLTFResult;

  return (
    <group dispose={null}>
      <skinnedMesh
        geometry={nodes.Mesh_0.geometry}
        material={materials.Material_0}
        skeleton={nodes.Mesh_0.skeleton}
      />
    </group>
  );
}
```

**Optimization Strategy**:
1. **Asset Compression**: Use gltfjsx --transform to create Draco-compressed, texture-optimized .glb (can reduce 26MB models to 560KB)
2. **Draco CDN Prefetch**: Add link prefetch tags in HTML head for Draco decoder binaries
   ```html
   <link rel="prefetch" href="https://www.gstatic.com/draco/v1/decoders/draco_decoder.wasm" />
   ```
3. **Progressive Loading**: Load critical model first, then lazy-load additional animations or lower-priority assets
4. **Texture Optimization**: Convert textures to WebP/KTX2 format for smaller file sizes and faster GPU upload
5. **Avoid useGLTF.preload() + Preload component together**: Using both causes shader precompilation issues

**Performance Targets**:
- Initial model load: < 2 seconds on 3G connection
- Parse and ready to render: < 500ms on desktop
- Subsequent loads: < 50ms (from cache)

**References**:
- [useGLTF - Drei Documentation](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf)
- [3D Optimization for Web - 26MB to 560KB](https://echobind.com/post/3D-Optimization-for-Web-26mb-down-to-560kb)
- [Building Efficient Three.js Scenes](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)

---

## 3. Animation Management with useAnimations Hook - Handling 40+ Animations Efficiently

**Decision**: Use useAnimations hook from @react-three/drei with selective animation playback and state-driven switching

**Rationale**:
- **Simplified API**: useAnimations provides direct access to Three.js AnimationActions without manual AnimationMixer setup
- **Automatic Mixer Management**: Creates and manages AnimationMixer lifecycle, including cleanup on unmount
- **Named Actions Access**: Returns actions object with animation names as keys, enabling intuitive animation control
- **React Integration**: Works seamlessly with useEffect for declarative animation triggering based on state changes
- **Memory Efficiency**: Animations are stored in GLTF and referenced, not duplicated - only active actions consume CPU/GPU resources

**Alternatives Considered**:
- **Manual AnimationMixer**: Rejected due to verbose setup, manual cleanup requirements, and lack of React integration
- **react-spring for 3D animations**: Rejected for skeletal animations - react-spring is better for property tweens, not skeletal animation playback
- **Custom animation pooling**: Not needed - Three.js AnimationMixer already efficiently manages multiple clips

**Implementation Notes**:
```tsx
import { useAnimations } from '@react-three/drei';

export type ActionName =
  | 'hip-hop-dancing'
  | 'jumping'
  | 'punching'
  // ... 40+ animation names
  | 'standing-torch-run-forward';

interface Props {
  currentAnimation?: ActionName;
}

function HairyBear({ currentAnimation }: Props) {
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF('/model.gltf') as GLTFResult;
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (currentAnimation && actions[currentAnimation]) {
      // Stop all animations first
      names.forEach(name => actions[name]?.stop());

      // Play selected animation with smooth transition
      actions[currentAnimation]?.reset().fadeIn(0.5).play();
    }
  }, [currentAnimation, actions, names]);

  return <group ref={group}>{/* model */}</group>;
}
```

**Efficiency Strategies for 40+ Animations**:

1. **Single Active Animation Pattern**: Only one animation plays at a time (per spec requirement), minimizing CPU overhead
   - Stop all other animations before playing new one
   - Use `fadeIn(0.5)` for smooth 500ms transitions (aligns with SC-003 requirement)

2. **Lazy Action Initialization**: Actions are created on-demand by useAnimations, not pre-instantiated

3. **Rapid Click Handling**: For rapid carousel clicking, cancel in-progress transitions:
   ```tsx
   useEffect(() => {
     names.forEach(name => {
       const action = actions[name];
       action?.stop(); // Immediately stop, don't wait for fade
     });
     actions[currentAnimation]?.reset().play();
   }, [currentAnimation]);
   ```

4. **Animation Preloading**: All 40+ animations are embedded in single GLTF - loaded once, no runtime fetching

5. **Performance Monitoring**: Track active animations to ensure only one plays:
   ```tsx
   useEffect(() => {
     const activeCount = names.filter(name => actions[name]?.isRunning()).length;
     if (activeCount > 1) console.warn('Multiple animations active');
   });
   ```

6. **Avoid State Updates in Animation Loop**: Don't update React state on every animation frame - use refs for animation-related data that doesn't need UI updates

**Performance Targets**:
- Animation switch time: < 500ms (per SC-003)
- Memory overhead: < 50MB for all 40 animations (amortized across GLTF)
- CPU usage: < 5% when single animation playing on desktop

**References**:
- [useAnimations - Drei Documentation](https://drei.docs.pmnd.rs/abstractions/use-animations)
- [Basic Animations - React Three Fiber](https://r3f.docs.pmnd.rs/tutorials/basic-animations)
- [Animation Techniques - DeepWiki](https://deepwiki.com/pmndrs/react-three-fiber/4.3-animation-techniques)

---

## 4. Performance Optimization Strategies for WebGL in Browser

**Decision**: Implement multi-tier optimization strategy with device detection and adaptive quality settings

**Rationale**:
- **Device Variability**: Users range from high-end desktop GPUs to low-end mobile devices (per spec requirement FR-018)
- **Draw Call Reduction**: Primary bottleneck in WebGL is draw calls - target < 100 for 60fps, < 50 for mobile 30fps
- **On-Demand Rendering**: Rendering every frame wastes battery and CPU when scene is static
- **Progressive Enhancement**: Start with lower quality settings, scale up for capable devices
- **Mobile Constraints**: Limited memory (1-2GB VRAM), thermal throttling, and battery considerations require aggressive optimization

**Alternatives Considered**:
- **Single Quality Tier**: Rejected - would either alienate low-end users or underutilize high-end hardware
- **User-Configurable Quality**: Rejected for initial release - adds UI complexity, better as future enhancement
- **Server-Side Rendering**: Not applicable for real-time 3D interactions

**Implementation Notes**:

**1. Device Detection and Adaptive Quality**:
```tsx
import { Canvas } from '@react-three/fiber';

function detectDeviceTier() {
  const gl = document.createElement('canvas').getContext('webgl2');
  const renderer = gl?.getParameter(gl.RENDERER) || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);

  if (isMobile) return 'low';
  if (renderer.includes('NVIDIA') || renderer.includes('AMD')) return 'high';
  return 'medium';
}

function App() {
  const tier = detectDeviceTier();

  return (
    <Canvas
      dpr={tier === 'low' ? 1 : Math.min(2, window.devicePixelRatio)}
      performance={{ min: 0.5 }} // Adaptive performance
      frameloop={tier === 'low' ? 'demand' : 'always'}
      gl={{
        powerPreference: tier === 'low' ? 'default' : 'high-performance',
        antialias: tier !== 'low',
        alpha: true
      }}
    >
      <BearScene qualityTier={tier} />
    </Canvas>
  );
}
```

**2. On-Demand Rendering** (FR-018 - 15-20fps on low-end):
```tsx
import { useFrame, useThree } from '@react-three/fiber';

function Scene() {
  const { invalidate } = useThree();

  // Only render when animation changes or user interacts
  useEffect(() => {
    invalidate(); // Trigger single frame
  }, [currentAnimation]);

  return (
    <Canvas frameloop="demand">
      {/* Scene will only render when invalidate() is called */}
    </Canvas>
  );
}
```

**3. Draw Call Optimization**:
- **Single Model**: Hairy bear is one SkinnedMesh = 1 draw call (optimal)
- **Instancing**: Not applicable (single unique character)
- **Texture Atlasing**: Combine textures if multiple materials needed
- **Minimal Lights**: Use 1-2 lights max, prefer environment maps

```tsx
<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 5, 5]} intensity={0.8} />
  {/* Avoid adding more lights - use baked lighting in textures instead */}
</Canvas>
```

**4. LOD (Level of Detail)** - Future Enhancement:
```tsx
import { Detailed } from '@react-three/drei';

<Detailed distances={[0, 10, 20]}>
  <BearHighPoly /> {/* < 10 units from camera */}
  <BearMediumPoly /> {/* 10-20 units */}
  <BearLowPoly /> {/* > 20 units */}
</Detailed>
```

**5. Memory Management**:
```tsx
// Explicit disposal when switching scenes
useEffect(() => {
  return () => {
    scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  };
}, []);
```

**6. Performance Monitoring**:
```tsx
import { Perf } from 'r3f-perf';

<Canvas>
  {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
</Canvas>
```

**Quality Settings per Tier**:

| Feature | Low (Mobile) | Medium (Desktop) | High (Gaming) |
|---------|--------------|------------------|---------------|
| DPR | 1 | 1.5 | 2 |
| Antialias | false | true | true |
| Shadow Quality | none | PCF | PCFSoft |
| Texture Size | 1024px | 2048px | 4096px |
| Target FPS | 15-20 | 30 | 60 |
| Frame Loop | demand | always | always |
| Post-Processing | none | basic | advanced |

**Performance Targets**:
- Desktop: 60fps at 1080p (SC-002)
- Mobile High-end: 30fps at 750p
- Mobile Low-end: 15-20fps at 375p (SC-002, FR-018)
- Draw calls: < 10 (single model + lights)
- Memory: < 150MB total (model + textures)

**References**:
- [Scaling Performance - React Three Fiber](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [100 Three.js Tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [Optimization - Wawa Sensei](https://wawasensei.dev/courses/react-three-fiber/lessons/optimization)

---

## 5. Integration Patterns Between React Three Fiber (Canvas) and Regular React Components

**Decision**: Use HTML overlay pattern with absolute positioning and React state bridge

**Rationale**:
- **Separation of Concerns**: 3D rendering inside Canvas, UI controls outside - clean architectural boundary
- **Performance**: HTML/CSS for UI is more performant than 3D text/sprites and doesn't add draw calls
- **Accessibility**: HTML elements are naturally accessible (keyboard navigation, screen readers) while 3D elements are not
- **Familiar Patterns**: Standard React state management works seamlessly between 2D and 3D components
- **Layout Flexibility**: CSS for UI layout is more powerful and familiar than 3D positioning

**Alternatives Considered**:
- **Html component from drei**: Rejected for primary UI - adds complexity, harder to style, performance overhead for many elements
- **Sprite-based 3D UI**: Rejected - poor accessibility, difficult text rendering, extra draw calls
- **Separate Canvas for UI**: Rejected - unnecessary complexity, harder synchronization

**Implementation Notes**:

**Architecture Pattern**:
```tsx
function App() {
  const [currentAnimation, setCurrentAnimation] = useState<ActionName>('walking');

  return (
    <div className="relative w-screen h-screen bg-black">
      {/* Background Layer - 3D Scene */}
      <div className="absolute inset-0">
        <Prism {...prismProps} />
      </div>

      {/* 3D Content Layer */}
      <div className="absolute inset-0">
        <Canvas>
          <HairyBear currentAnimation={currentAnimation} />
        </Canvas>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-8 left-0 right-0 pointer-events-auto">
          <AnimationCarousel
            onSelectAnimation={setCurrentAnimation}
            animations={ActionNames}
          />
        </div>
      </div>
    </div>
  );
}
```

**State Bridge Pattern**:
```tsx
// Shared state between React UI and R3F scene
const [animationState, setAnimationState] = useState({
  current: 'walking' as ActionName,
  isPlaying: true,
  progress: 0
});

// React component updates state
function Carousel() {
  return (
    <button onClick={() => setAnimationState(prev => ({
      ...prev,
      current: 'jumping'
    }))}>
      Jump
    </button>
  );
}

// R3F component consumes state
function BearScene() {
  const { current } = animationState;
  // Use in useEffect to trigger animations
}
```

**Pointer Events Management**:
```tsx
// Allow clicks to pass through overlay to 3D scene where needed
<div className="absolute inset-0 pointer-events-none">
  {/* Re-enable pointer events only for interactive UI */}
  <button className="pointer-events-auto">Click Me</button>
</div>

// Or make entire UI layer interactive
<div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
  <Carousel />
</div>
```

**Responsive Layout**:
```tsx
function ResponsiveUI() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={`
      absolute bottom-0 left-0 right-0
      ${isMobile ? 'h-24 px-4' : 'h-32 px-8'}
    `}>
      <AnimationCarousel
        itemSize={isMobile ? 'small' : 'large'}
        itemsVisible={isMobile ? 3 : 7}
      />
    </div>
  );
}
```

**Syncing UI with 3D State** (optional, for progress indicators):
```tsx
function BearWithProgress({ onProgressUpdate }) {
  const { mixer } = useAnimations(animations, ref);

  useFrame(() => {
    if (mixer) {
      // Update React state sparingly (throttle to avoid re-renders)
      const progress = mixer.time / mixer.clipAction.getClip().duration;
      if (Math.abs(progress - lastProgress.current) > 0.1) {
        onProgressUpdate(progress);
        lastProgress.current = progress;
      }
    }
  });
}
```

**Canvas Configuration for Overlay**:
```tsx
<Canvas
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1 // Below UI overlay (z-index: 10)
  }}
  gl={{ alpha: true }} // Transparent background for layering
>
```

**Best Practices**:
1. **Minimize State Bridges**: Only sync essential state between UI and 3D scene to avoid re-renders
2. **Use Refs for Non-Visual Data**: Animation progress, internal timers don't need React state
3. **Throttle Updates**: If syncing 3D state to UI, throttle to max 10 updates/sec
4. **Pointer Events**: Use `pointer-events-none` on overlay container, `pointer-events-auto` on interactive elements
5. **Z-Index Layers**: Background (z:0) < Canvas (z:1) < UI Overlay (z:10)

**Error Boundary Pattern**:
```tsx
function App() {
  return (
    <ErrorBoundary fallback={<ErrorUI />}>
      <Suspense fallback={<LoadingUI />}>
        <Canvas>
          <BearScene />
        </Canvas>
      </Suspense>
      <UIOverlay />
    </ErrorBoundary>
  );
}
```

**References**:
- [Canvas - React Three Fiber](https://r3f.docs.pmnd.rs/api/canvas)
- [How to build stunning 3D scenes](https://varun.ca/modular-webgl/)
- [React Three Fiber Tutorial](https://waelyasmina.net/articles/react-three-fiber-for-beginners/)

---

## 6. Responsive 3D Rendering - Camera Adjustments and Model Scaling for Different Viewports

**Decision**: Use viewport-based scaling with useThree hook and responsive camera configuration

**Rationale**:
- **Viewport-Aware Scaling**: useThree().viewport provides Three.js world units based on camera frustum, enabling consistent object sizing across devices
- **Automatic Aspect Ratio**: R3F automatically updates camera aspect ratio on resize, no manual management needed
- **Mobile Optimization**: Smaller viewports need adjusted camera distance and FOV to keep model properly framed (per FR-011)
- **Performance Scaling**: Different viewports can trigger different quality tiers (see section 4)
- **CSS Integration**: Canvas size controlled by CSS, Three.js adapts automatically

**Alternatives Considered**:
- **Fixed World Units**: Rejected - model appears too small on mobile, too large on desktop
- **Manual Resize Listeners**: Rejected - R3F handles this automatically, manual listeners create duplicate logic
- **Multiple Cameras**: Rejected - single camera with responsive parameters is simpler and more maintainable
- **react-three-resize-helper**: Rejected - adds dependency for functionality achievable with built-in hooks

**Implementation Notes**:

**1. Viewport-Based Model Scaling**:
```tsx
import { useThree } from '@react-three/fiber';

function ResponsiveBear() {
  const viewport = useThree(state => state.viewport);
  const isMobile = viewport.width < 8; // Three.js units

  // Scale model based on viewport (FR-011: scale down on mobile)
  const scale = isMobile ? 0.6 : 1.0;

  return (
    <HairyBear
      scale={scale}
      position={[0, isMobile ? -1 : -5, 0]}
    />
  );
}
```

**2. Responsive Camera Configuration**:
```tsx
function App() {
  const [cameraConfig, setCameraConfig] = useState({
    position: [0, 0, 10] as [number, number, number],
    fov: 50
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setCameraConfig({
        position: isMobile ? [0, 0, 8] : [0, 0, 10], // Closer on mobile
        fov: isMobile ? 60 : 50 // Wider FOV on mobile to show more
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Canvas camera={cameraConfig}>
      <ResponsiveBear />
    </Canvas>
  );
}
```

**3. Using useMediaQuery for Device Detection**:
```tsx
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

function Scene() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return (
    <HairyBear
      scale={isMobile ? 0.6 : 1.0}
      position={[
        0,
        isMobile && !isLandscape ? -1 : -5, // Adjust for mobile portrait
        0
      ]}
    />
  );
}
```

**4. Automatic Aspect Ratio Management**:
```tsx
// R3F automatically handles this - no code needed
// When Canvas resizes, camera.aspect updates automatically
// Just ensure Canvas container is properly sized with CSS

<div className="w-screen h-screen">
  <Canvas>
    {/* Camera aspect ratio updates automatically on window resize */}
  </Canvas>
</div>
```

**5. Advanced: CameraControls from drei**:
```tsx
import { CameraControls } from '@react-three/drei';

function Scene() {
  const controlsRef = useRef<CameraControlsImpl>();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (controlsRef.current) {
      // Animate camera to new position on resize
      controlsRef.current.setLookAt(
        0, 0, isMobile ? 8 : 10, // camera position
        0, 0, 0,                  // target
        true                       // animate
      );
    }
  }, [isMobile]);

  return (
    <>
      <CameraControls
        ref={controlsRef}
        minDistance={5}
        maxDistance={15}
        enabled={!isMobile} // Disable controls on mobile for better UX
      />
      <HairyBear />
    </>
  );
}
```

**6. Responsive Background (Prism Component)**:
```tsx
function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="relative w-screen h-screen">
      {/* Adjust Prism parameters for mobile (FR-012) */}
      <Prism
        height={isMobile ? 2.5 : 3.5}
        baseWidth={isMobile ? 4.0 : 5.5}
        scale={isMobile ? 2.5 : 3.6}
        timeScale={isMobile ? 0.3 : 0.5} // Slower on mobile for battery
      />
      <Canvas>
        <ResponsiveBear />
      </Canvas>
    </div>
  );
}
```

**Responsive Breakpoints**:

| Breakpoint | Width | Camera FOV | Camera Distance | Model Scale | Notes |
|------------|-------|------------|-----------------|-------------|-------|
| Mobile S | 320-480px | 65 | 8 units | 0.5 | Minimum layout (FR-017) |
| Mobile M | 481-768px | 60 | 8 units | 0.6 | Standard mobile (FR-011) |
| Tablet | 769-1024px | 55 | 9 units | 0.8 | iPad landscape |
| Desktop | 1025-1920px | 50 | 10 units | 1.0 | Standard desktop |
| 4K | 1921-3840px | 45 | 12 units | 1.2 | High-res displays |

**Orientation Handling** (FR-013):
```tsx
function OrientationAdaptive() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return (
    <HairyBear
      position={[
        0,
        orientation === 'portrait' ? -1 : -2,
        0
      ]}
    />
  );
}
```

**Performance Considerations**:
- Avoid updating camera/scale on every resize event - debounce to 100-200ms
- Use CSS media queries for layout, JS only for Three.js parameters
- Test on actual devices, not just browser dev tools (GPU differences)
- Cache viewport-based calculations in useMemo

**References**:
- [Responsive Camera Discussion](https://github.com/pmndrs/react-three-fiber/discussions/711)
- [Viewport and Size Usage](https://github.com/pmndrs/react-three-fiber/discussions/857)
- [Responsive 3D Objects](https://github.com/pmndrs/react-three-fiber/discussions/647)

---

## 7. Error Handling for WebGL Context Loss and Model Loading Failures

**Decision**: Implement multi-layer error boundaries with automatic recovery for context loss and graceful degradation for loading failures

**Rationale**:
- **Context Loss is Common**: Mobile browsers limit WebGL contexts to 10-20, aggressive memory management causes context loss
- **Automatic Recovery**: Three.js WebGLRenderer handles context restoration automatically, but app state needs manual recovery
- **User Experience**: Per FR-014, show error message but keep background and carousel functional for better UX than blank screen
- **Mobile Stability**: iOS Safari and older iPads are particularly prone to context loss - need platform-specific mitigations
- **Loading Failures**: Network issues, missing files, or unsupported browsers should degrade gracefully without crashing app

**Alternatives Considered**:
- **No Error Handling**: Rejected - leads to blank screen and poor UX, doesn't meet FR-014
- **Full Page Error**: Rejected - spec requires keeping background and carousel functional
- **Retry Only**: Insufficient - need to prevent loss in first place and handle permanent failures
- **Service Worker Caching**: Future enhancement - adds complexity, better as progressive enhancement

**Implementation Notes**:

**1. WebGL Context Loss Prevention and Recovery**:
```tsx
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

function ContextLossHandler() {
  const gl = useThree(state => state.gl);
  const isRecovering = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault(); // Prevent default browser behavior
      console.warn('WebGL context lost, attempting recovery...');
      isRecovering.current = true;

      // Stop animation loop to save resources
      // R3F will automatically pause rendering
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      isRecovering.current = false;

      // R3F automatically reinitializes when context restored
      // Textures and buffers are recreated by Three.js
      // May need to reload GLTF if not cached
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  return null;
}

// Add to Canvas scene
<Canvas>
  <ContextLossHandler />
  <BearScene />
</Canvas>
```

**2. iOS-Specific Context Loss Mitigation**:
```tsx
function App() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <Canvas
      gl={{
        // iOS mitigation: reduce power consumption
        powerPreference: isIOS ? 'default' : 'high-performance',
        antialias: !isIOS, // Disable AA on iOS to reduce memory
        preserveDrawingBuffer: false, // Don't preserve buffer (saves memory)
      }}
      dpr={isIOS ? 1 : Math.min(2, window.devicePixelRatio)} // Lower DPR on iOS
    >
      <ContextLossHandler />
      <BearScene />
    </Canvas>
  );
}
```

**3. Model Loading Error Boundary**:
```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ModelErrorFallback({ error, resetErrorBoundary }) {
  return (
    <group>
      {/* Show placeholder or error message in 3D space */}
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
    </group>
  );
}

function BearWithErrorHandling(props) {
  return (
    <ErrorBoundary
      FallbackComponent={ModelErrorFallback}
      onReset={() => {
        // Attempt to reload model
        useGLTF.clear('/assets/models/hairybear/hairybear.gltf');
      }}
    >
      <Suspense fallback={<LoadingPlaceholder />}>
        <HairyBear {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**4. Loading State Management (FR-014)**:
```tsx
function App() {
  const [modelState, setModelState] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className="relative w-screen h-screen bg-black">
      {/* Background always active (FR-014) */}
      <Prism {...prismProps} />

      {/* 3D Model with error handling */}
      <ErrorBoundary
        fallback={
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <p className="text-xl mb-4">Unable to load 3D model</p>
              <p className="text-sm text-gray-400">
                Your browser may not support WebGL or the model failed to load
              </p>
            </div>
          </div>
        }
        onError={() => setModelState('error')}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas>
            <BearScene onLoad={() => setModelState('loaded')} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>

      {/* Carousel always functional (FR-014) */}
      <AnimationCarousel
        disabled={modelState === 'error'}
        showErrorState={modelState === 'error'}
      />
    </div>
  );
}
```

**5. Network Error Handling with Retry**:
```tsx
function useGLTFWithRetry(url: string, maxRetries = 3) {
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  try {
    return useGLTF(url);
  } catch (err) {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        useGLTF.clear(url); // Clear cache
        setRetryCount(prev => prev + 1);
      }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
    } else {
      setError(err as Error);
    }
    throw err;
  }
}
```

**6. Browser Capability Detection**:
```tsx
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
      return { supported: false, reason: 'WebGL not available' };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : 'Unknown';

    // Check for SwiftShader (software renderer - poor performance)
    if (renderer.includes('SwiftShader')) {
      return {
        supported: true,
        warning: 'Using software renderer - expect poor performance'
      };
    }

    return { supported: true, renderer };
  } catch (err) {
    return { supported: false, reason: 'WebGL check failed' };
  }
}

function App() {
  const webglSupport = checkWebGLSupport();

  if (!webglSupport.supported) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">WebGL Not Supported</h1>
          <p>{webglSupport.reason}</p>
          <p className="mt-4 text-sm text-gray-400">
            Please use a modern browser (Chrome, Firefox, Safari, Edge)
          </p>
        </div>
      </div>
    );
  }

  if (webglSupport.warning) {
    console.warn(webglSupport.warning);
  }

  return <MainApp />;
}
```

**7. Monitoring and Logging**:
```tsx
function ErrorMonitor() {
  const gl = useThree(state => state.gl);

  useEffect(() => {
    const checkContextHealth = () => {
      if (gl.getContext().isContextLost()) {
        console.error('WebGL context is lost');
        // Send to analytics/monitoring service
      }
    };

    const interval = setInterval(checkContextHealth, 5000);
    return () => clearInterval(interval);
  }, [gl]);

  return null;
}
```

**Error Handling Checklist**:
- [ ] Context loss event listeners on canvas
- [ ] iOS-specific power settings
- [ ] React Error Boundary around Canvas
- [ ] Suspense for loading states
- [ ] Retry logic for network failures
- [ ] WebGL capability detection on mount
- [ ] Error messages meet FR-014 (show error, keep background/carousel)
- [ ] Analytics for error tracking

**Common Error Scenarios**:

| Error Type | Cause | Recovery Strategy | User Experience |
|------------|-------|-------------------|-----------------|
| Context Loss | Mobile memory pressure | Auto-recovery via events | Brief pause, then resumes |
| Network Failure | Slow/offline connection | Retry 3x with backoff | Loading spinner, then error msg |
| Model Corruption | Invalid GLTF file | Show error, no retry | Error msg, background active |
| WebGL Unavailable | Old browser, no GPU | Detect on mount, block app | Upgrade browser message |
| Memory Exhausted | Too many contexts | Limit to single Canvas | Should not occur (1 canvas) |

**References**:
- [WebGL Context Lost Handling](https://github.com/pmndrs/react-three-fiber/discussions/723)
- [Context Lost on iOS Discussion](https://github.com/pmndrs/react-three-fiber/discussions/2457)
- [100 Three.js Tips - Context Loss](https://www.utsubo.com/blog/threejs-best-practices-100-tips)

---

## Additional Considerations

### Development Tools
- **React DevTools**: Inspect R3F component tree
- **r3f-perf**: Monitor FPS, draw calls, memory in development
- **Leva**: Quick GUI controls for tweaking parameters during development
- **gltfjsx**: Generate TypeScript components from GLTF files

### Testing Strategy
- **Unit Tests**: Test animation switching logic, state management
- **Visual Regression**: Screenshot testing for different viewports
- **Performance Tests**: Measure FPS on target devices, ensure SC-002 compliance
- **E2E Tests**: Carousel interaction, animation switching (SC-003: < 0.5s)
- **Device Testing**: Real device testing for iOS Safari, Android Chrome
  - iPhone 12 (baseline mobile high-end)
  - iPhone 8 (mobile low-end, FR-018 15-20fps)
  - Desktop Chrome (60fps target)

### Future Enhancements
- **WebGPU Migration**: Once broader support (2027+), migrate from WebGL for better performance
- **LOD System**: Multiple model qualities for different distances/devices
- **Animation Blending**: Smooth transitions between animations beyond simple fade
- **Shadow Mapping**: Dynamic shadows for enhanced realism (high-end devices only)
- **Post-Processing**: Bloom, color grading via @react-three/postprocessing
- **Service Worker**: Offline support and faster repeat loads

### Dependencies
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@react-three/fiber": "^8.15.16",
    "@react-three/drei": "^9.97.5",
    "three": "^0.161.0",
    "three-stdlib": "^2.29.4"
  },
  "devDependencies": {
    "r3f-perf": "^7.1.2",
    "@types/three": "^0.161.0"
  }
}
```

---

## Summary of Key Decisions

1. **React Three Fiber over raw Three.js** - Declarative API, automatic memory management, better React integration
2. **useGLTF with preloading** - Automatic caching, Suspense support, 70-90% file size reduction via Draco
3. **useAnimations for 40+ animations** - Single active animation pattern, automatic mixer management, smooth transitions
4. **Multi-tier performance optimization** - Device detection, on-demand rendering, 15-20fps mobile target
5. **HTML overlay pattern** - 3D in Canvas, UI outside with absolute positioning, state bridge
6. **Viewport-based responsive design** - useThree viewport, responsive camera FOV/distance, mobile scaling
7. **Comprehensive error handling** - Context loss recovery, iOS mitigations, graceful loading failures per FR-014

These decisions align with 2026 best practices and meet all functional requirements (FR-001 through FR-018) and success criteria (SC-001 through SC-006) defined in the specification.

---

## Sources

- [React Three Fiber vs. Three.js in 2026](https://graffersid.com/react-three-fiber-vs-three-js/)
- [Scaling performance - React Three Fiber](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [100 Three.js Tips That Actually Improve Performance (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [Building Efficient Three.js Scenes](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)
- [Gltf / useGLTF - Drei](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf)
- [3D Optimization for Web—How I Got a Model From 26MB Down to 560KB](https://echobind.com/post/3D-Optimization-for-Web-26mb-down-to-560kb)
- [useAnimations - Drei](https://drei.docs.pmnd.rs/abstractions/use-animations)
- [Basic Animations - React Three Fiber](https://r3f.docs.pmnd.rs/tutorials/basic-animations)
- [WebGL Context Lost Handling Discussion](https://github.com/pmndrs/react-three-fiber/discussions/723)
- [Canvas - React Three Fiber](https://r3f.docs.pmnd.rs/api/canvas)
- [How to build stunning 3D scenes with React Three Fiber](https://varun.ca/modular-webgl/)
- [Responsive Camera Discussion](https://github.com/pmndrs/react-three-fiber/discussions/711)
- [Viewport and Size Usage](https://github.com/pmndrs/react-three-fiber/discussions/857)
