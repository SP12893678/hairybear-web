/**
 * AnimationCarousel Component
 * Simple left/right navigation for animation selection
 * Feature: 001-3d-bear-web-app - FR-006, FR-007, FR-013, FR-016
 */

import type { Animation, DeviceType } from '@/types/bear.types';
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
  const currentAnimation = animations[selectedIndex];
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < animations.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onAnimationSelect(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onAnimationSelect(selectedIndex + 1);
    }
  };

  // Handle keyboard navigation (FR-016)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Mobile needs larger buttons for better touch targets
  const buttonSize = deviceType === 'mobile' ? 'w-14 h-14' : 'w-10 h-10';
  const textSize = deviceType === 'mobile' ? 'text-lg' : 'text-2xl';
  const minWidth = deviceType === 'mobile' ? 'min-w-[180px]' : 'min-w-[250px]';

  return (
    <div
      className={cn('fixed bottom-0 left-0 right-0', className)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Animation controls"
    >
      <div className="flex items-center justify-center gap-12 py-8 px-4">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className={cn(
            buttonSize,
            'group relative flex items-center justify-center transition-all duration-300',
            'hover:scale-125 active:scale-95',
            'disabled:opacity-0 disabled:cursor-not-allowed',
            'focus:outline-none'
          )}
          aria-label="Previous animation"
        >
          {/* Ghost Arrow 1 - furthest */}
          {hasPrev && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full absolute animate-ghost-left"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
                animationDelay: '0s'
              }}
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Ghost Arrow 2 - middle */}
          {hasPrev && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full absolute animate-ghost-left"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
                animationDelay: '0.5s'
              }}
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Main Arrow Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full relative z-10"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
            }}
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-white transition-all"
            />
          </svg>
        </button>

        {/* Animation Name */}
        <div className={cn('text-center relative', minWidth)}>
          {/* Ghost text layers - shimmer effect */}
          <p
            className={cn(
              'text-white font-bold tracking-wide uppercase absolute inset-0 animate-text-shimmer',
              textSize
            )}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.05em',
              opacity: 0.3,
              filter: 'blur(2px)'
            }}
            aria-hidden="true"
          >
            {currentAnimation?.displayName || 'Loading...'}
          </p>
          <p
            className={cn(
              'text-white font-bold tracking-wide uppercase absolute inset-0 animate-text-shimmer',
              textSize
            )}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.05em',
              opacity: 0.2,
              filter: 'blur(4px)',
              animationDelay: '1s'
            }}
            aria-hidden="true"
          >
            {currentAnimation?.displayName || 'Loading...'}
          </p>

          {/* Main text with glow animation */}
          <p
            className={cn(
              'text-white font-bold tracking-wide uppercase relative animate-text-glow',
              textSize
            )}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '0.05em'
            }}
          >
            {currentAnimation?.displayName || 'Loading...'}
          </p>

          <p
            className="text-white/70 text-sm mt-2 font-medium relative"
            style={{
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
            }}
          >
            {selectedIndex + 1} / {animations.length}
          </p>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className={cn(
            buttonSize,
            'group relative flex items-center justify-center transition-all duration-300',
            'hover:scale-125 active:scale-95',
            'disabled:opacity-0 disabled:cursor-not-allowed',
            'focus:outline-none'
          )}
          aria-label="Next animation"
        >
          {/* Ghost Arrow 1 - furthest */}
          {hasNext && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full absolute animate-ghost-right"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
                animationDelay: '0s'
              }}
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Ghost Arrow 2 - middle */}
          {hasNext && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full absolute animate-ghost-right"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
                animationDelay: '0.5s'
              }}
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Main Arrow Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full relative z-10"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
            }}
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-white transition-all"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
