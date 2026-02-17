/**
 * useBearModel Hook
 * Manages bear model loading and animation state
 * Feature: 001-3d-bear-web-app
 */

import { useState, useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';
import type { ActionName, LoadingStatus } from '@/types/bear.types';

const MODEL_PATH = `${import.meta.env.BASE_URL}assets/models/hairybear/hairybear.gltf`;

export interface UseBearModelReturn {
  model: THREE.Group | null;
  mixer: THREE.AnimationMixer | null;
  animations: THREE.AnimationClip[];
  status: LoadingStatus;
  error: Error | null;
  progress: number;
  playAnimation: (name: ActionName) => void;
  stopAllAnimations: () => void;
  groupRef: React.RefObject<THREE.Group | null>;
}

export function useBearModel(): UseBearModelReturn {
  const [status, setStatus] = useState<LoadingStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const group = useRef<THREE.Group>(null);

  // Load GLTF model - useGLTF cannot be in try-catch as it's a hook
  const gltf = useGLTF(MODEL_PATH) as GLTF;
  const scene = gltf.scene;
  const animations = gltf.animations;

  const { actions, mixer } = useAnimations(animations, group);

  // Update status when model loads
  useEffect(() => {
    if (scene && animations.length > 0) {
      setStatus('loaded');
      setProgress(100);
    } else if (!scene) {
      setStatus('error');
      setError(new Error('Failed to load model'));
    }
  }, [scene, animations]);

  const playAnimation = (name: ActionName) => {
    if (!actions[name]) {
      console.warn(`Animation "${name}" not found in model`);
      return;
    }

    const action = actions[name];
    if (!action) return;

    // Cancel any in-progress transitions immediately (FR-015)
    // For rapid clicks, stop all other animations immediately without fade
    Object.entries(actions).forEach(([actionName, otherAction]) => {
      if (otherAction && actionName !== name) {
        otherAction.stop();
      }
    });

    // Play new animation with fade in (500ms transition - SC-003)
    action.reset().fadeIn(0.5).play();
    action.setLoop(THREE.LoopRepeat, Infinity); // Continuous loop per FR-009
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

// Preload model for faster initial load
useGLTF.preload(MODEL_PATH);
