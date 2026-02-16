/**
 * useResponsive Hook
 * Tracks viewport dimensions and device type
 * Feature: 001-3d-bear-web-app
 */

import { useState, useEffect } from 'react';
import type { DeviceType, Orientation } from '@/types/bear.types';
import { BREAKPOINTS, MIN_VIEWPORT_WIDTH } from '@/types/bear.types';

export interface UseResponsiveReturn {
  width: number;
  height: number;
  deviceType: DeviceType;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isBelowMinWidth: boolean;
}

export function useResponsive(): UseResponsiveReturn {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
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
    isBelowMinWidth: width < MIN_VIEWPORT_WIDTH
  };
}
