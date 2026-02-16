/**
 * BearModel Component
 * Renders and animates the 3D bear model using React Three Fiber
 * Feature: 001-3d-bear-web-app
 */

import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
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
  const { model, mixer, status, error, playAnimation, groupRef } = useBearModel();
  const [opacity, setOpacity] = useState(0); // Fade-in animation state (T034)

  // Handle load complete/error
  useEffect(() => {
    if (status === 'loaded' && onLoadComplete) {
      onLoadComplete();
    }
    if (status === 'error' && error && onLoadError) {
      onLoadError(error);
    }
  }, [status, error, onLoadComplete, onLoadError]);

  // Fade in on load (T034)
  useEffect(() => {
    if (status === 'loaded') {
      // Start fade in after a brief delay
      const timer = setTimeout(() => setOpacity(1), 100);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Play animation when prop changes
  useEffect(() => {
    if (status === 'loaded') {
      playAnimation(animation);
    }
  }, [animation, status, playAnimation]);

  // Update mixer and opacity animation on each frame
  useFrame((_state, delta) => {
    // Use actual delta for smooth animation, cap at 0.1 to prevent huge jumps
    const cappedDelta = Math.min(delta, 0.1);
    mixer?.update(cappedDelta);

    // Smooth fade-in animation (T034)
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        // Check if child has material property (Mesh objects)
        if ('material' in child && child.material) {
          const material = child.material as THREE.Material;
          if (!material.transparent) {
            material.transparent = true;
          }
          if ('opacity' in material) {
            (material as THREE.MeshStandardMaterial).opacity = Math.min(
              (material as THREE.MeshStandardMaterial).opacity + delta * 2, // Fade in over ~0.5s
              opacity
            );
          }
        }
      });
    }
  });

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
