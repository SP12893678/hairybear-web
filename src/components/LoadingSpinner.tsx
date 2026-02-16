/**
 * LoadingSpinner Component
 * Displays while model is loading
 * Feature: 001-3d-bear-web-app - T032
 */

export function LoadingSpinner() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      role="status"
      aria-live="polite"
      aria-label="Loading 3D bear model"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"
          aria-hidden="true"
        />
        <p className="text-white text-lg">Loading 3D Model...</p>
      </div>
    </div>
  );
}
