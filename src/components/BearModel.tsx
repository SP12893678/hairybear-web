/**
 * BearModel Component
 * Renders and animates the 3D bear model using React Three Fiber
 * Feature: 001-3d-bear-web-app
 */

import { useEffect } from 'react';
import { useBearModel } from '@/hooks/useBearModel';
import type { ActionName, PerformanceTier } from '@/types/bear.types';

interface BearModelProps {
  animation: ActionName;
  scale?: number;
  position?: [number, number, number];
  targetFPS?: number;
  performanceTier?: PerformanceTier;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export function BearModel({
  animation,
  scale = 1.0,
  position = [0, 0, 0],
  targetFPS: _targetFPS = 30,
  performanceTier = 'high',
  onLoadComplete,
  onLoadError
}: BearModelProps) {
  const { model, status, error, playAnimation, groupRef } = useBearModel();

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

  if (status !== 'loaded' || !model) {
    return null; // Loading handled by parent
  }

  return (
    <group ref={groupRef} scale={scale} position={position}>
      <primitive object={model} />

      {/* Lighting based on performance tier */}
      {performanceTier === 'high' && (
        <>
          <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={1} />
        </>
      )}
      {performanceTier === 'medium' && (
        <>
          <directionalLight position={[5, 10, 5]} intensity={2} />
          <directionalLight position={[-5, 5, -5]} intensity={1} />
        </>
      )}
      {performanceTier === 'low' && (
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
      )}

      {/* Ambient light for all tiers - increased for better visibility */}
      <ambientLight intensity={1.2} />
    </group>
  );
}
