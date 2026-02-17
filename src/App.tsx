/**
 * Main App Component
 * 3D Bear Interactive Web App
 * Feature: 001-3d-bear-web-app
 */

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Prism from './components/Prism';
import { BearModel } from './components/BearModel';
import { AnimationCarousel } from './components/AnimationCarousel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TapToStart } from './components/TapToStart';
import { useDevicePerformance } from './hooks/useDevicePerformance';
import { useResponsive } from './hooks/useResponsive';
import { ANIMATIONS } from './utils/animation-config';

function App() {
  // Carousel state management (T019)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentAnimation = ANIMATIONS[selectedIndex];

  // Loading state management (T032)
  const [isModelLoading, setIsModelLoading] = useState(true);

  // Start state - show "Tap to Start" after model loads
  const [hasStarted, setHasStarted] = useState(false);

  const { tier, targetFPS } = useDevicePerformance();
  const { deviceType, isBelowMinWidth } = useResponsive();

  // Calculate bear scale based on device type (FR-011, T023)
  // Reduced base scale to fit model better in viewport
  const bearScale = deviceType === 'mobile' ? 0.28 : deviceType === 'tablet' ? 0.32 : 0.4;

  // Calculate bear Y position based on device type - mobile needs higher position
  const bearYPosition = deviceType === 'mobile' ? -1.5 : deviceType === 'tablet' ? -1.8 : -2;

  // Calculate Prism scale based on device type - mobile needs smaller scale to show full background
  const prismBaseWidth = deviceType === 'mobile' ? 3.5 : deviceType === 'tablet' ? 4.5 : 5.5;
  const prismScale = deviceType === 'mobile' ? 2.2 : deviceType === 'tablet' ? 2.8 : 3.6;

  // Handle animation selection (T019)
  const handleAnimationSelect = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        minWidth: 320,
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)'
      }}
    >
      {/* Minimum viewport width warning (T029, FR-017) */}
      {isBelowMinWidth && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center p-2 text-sm z-50">
          Screen width below 320px - horizontal scrolling enabled
        </div>
      )}

      {/* Prism Background - FR-002, FR-008 */}
      {/* <div className="absolute inset-0" style={{ transform: 'rotateX(180deg)' }}>
        <Prism
          animationType="rotate"
          timeScale={1}
          height={3.5}
          baseWidth={prismBaseWidth}
          scale={prismScale}
          hueShift={0}
          colorFrequency={3}
          noise={0}
          glow={1}
          offset={{y: -200}}
        />
      </div> */}

      <div className="absolute inset-0">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={prismBaseWidth}
          scale={prismScale}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
          offset={{y: -50}}
        />
      </div>

      {/* 3D Bear Model - FR-003 */}
      <div className="absolute inset-0 pointer-events-none">
        <ErrorBoundary>
          <Canvas
            camera={{ position: [0, 1, 8], fov: 50 }}
            dpr={deviceType === 'mobile' ? 1 : tier === 'high' ? 1.5 : 1}
            frameloop="always"
            gl={{
              antialias: tier === 'high',
              alpha: true,
              powerPreference: deviceType === 'mobile' ? 'low-power' : 'high-performance'
            }}
            performance={{ min: 0.5 }}
          >
            <Suspense fallback={null}>
              <BearModel
                animation={currentAnimation.name}
                scale={bearScale}
                position={[0, bearYPosition, 0]}
                targetFPS={targetFPS}
                performanceTier={tier}
                onLoadComplete={() => setIsModelLoading(false)}
                onLoadError={() => setIsModelLoading(false)}
              />
            </Suspense>
          </Canvas>
        </ErrorBoundary>

        {/* Tap to Start overlay - shows during loading and after load until user taps */}
        {!hasStarted && (
          <TapToStart
            onStart={() => setHasStarted(true)}
            isLoading={isModelLoading}
          />
        )}
      </div>

      {/* Animation Carousel - FR-006 */}
      <AnimationCarousel
        animations={ANIMATIONS}
        selectedIndex={selectedIndex}
        onAnimationSelect={handleAnimationSelect}
        deviceType={deviceType}
      />
    </div>
  );
}

export default App;
