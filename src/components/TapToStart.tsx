/**
 * TapToStart Component
 * Overlay with blur effect and tap prompt
 */

import { cn } from '@/lib/utils';

interface TapToStartProps {
  onStart: () => void;
  isLoading?: boolean;
  className?: string;
}

export function TapToStart({ onStart, isLoading = false, className }: TapToStartProps) {
  const handleClick = () => {
    if (!isLoading) {
      onStart();
    }
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex items-center justify-center',
        'backdrop-blur-md bg-black/30',
        'transition-opacity duration-300',
        'pointer-events-auto', // Override parent's pointer-events-none
        !isLoading && 'cursor-pointer hover:bg-black/40',
        isLoading && 'cursor-default',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={!isLoading ? 0 : -1}
      onKeyDown={(e) => {
        if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onStart();
        }
      }}
      aria-label={isLoading ? 'Loading 3D model' : 'Tap to start animation'}
    >
      {!isLoading ? (
        /* Tap to Start text with floating animation - centered */
        <div className="text-center relative">
          {/* Ghost/shadow text - floating up */}
          <h2
            className="text-4xl font-bold text-white absolute inset-0"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.05em',
              animation: 'float-up 2s ease-in-out infinite',
              opacity: 0.4
            }}
          >
            TAP TO START
          </h2>

          {/* Main text */}
          <h2
            className="text-4xl font-bold text-white relative"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.05em',
              animation: 'float-main 2s ease-in-out infinite'
            }}
          >
            TAP TO START
          </h2>
        </div>
      ) : (
        /* Loading spinner */
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-white text-lg">Loading 3D Model...</p>
        </div>
      )}
    </div>
  );
}
