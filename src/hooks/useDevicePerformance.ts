/**
 * useDevicePerformance Hook
 * Detects device GPU capabilities and classifies performance tier
 * Feature: 001-3d-bear-web-app
 */

import { useState, useEffect } from 'react';
import type { PerformanceTier } from '@/types/bear.types';

export interface UseDevicePerformanceReturn {
  tier: PerformanceTier;
  targetFPS: number;
  supportsWebGL: boolean;
  gpuInfo: string;
  pixelRatio: number;
  setTier: (tier: PerformanceTier) => void;
}

export function useDevicePerformance(): UseDevicePerformanceReturn {
  const [tier, setTier] = useState<PerformanceTier>('medium');
  const [gpuInfo, setGpuInfo] = useState<string>('');
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    // Detect WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl || !('getExtension' in gl)) {
      setSupportsWebGL(false);
      setTier('low');
      return;
    }

    // Get GPU info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL);
      setGpuInfo(renderer);

      // Classify based on GPU
      // Intel integrated graphics tend to be lower performance
      if (renderer.includes('Intel')) {
        setTier('medium');
      } else if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Radeon')) {
        setTier('high');
      } else if (renderer.includes('Apple')) {
        // Apple Silicon GPUs are generally high performance
        setTier('high');
      }
    }

    // Mobile detection - downgrade tier for mobile devices
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setTier(prev => {
        if (prev === 'high') return 'medium';
        return 'low';
      });
    }

    // Check for low memory devices
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) {
      setTier(prev => prev === 'high' ? 'medium' : 'low');
    }

    // Cleanup
    canvas.remove();
  }, []);

  const targetFPS = tier === 'low' ? 18 : 30;
  const pixelRatio = Math.min(2, window.devicePixelRatio || 1);

  return {
    tier,
    targetFPS,
    supportsWebGL,
    gpuInfo,
    pixelRatio,
    setTier
  };
}
