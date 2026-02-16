# Implementation Plan: 3D Bear Interactive Web App

**Branch**: `001-3d-bear-web-app` | **Date**: 2026-02-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-3d-bear-web-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a fullscreen web application featuring a centered animated 3D bear character with interactive Prism background effects. Users can switch between 40+ bear animations via a bottom carousel, with synchronized background color schemes. The app includes responsive design for mobile devices with adaptive performance scaling.

**Technical Approach**: React + TypeScript + Vite SPA using React Three Fiber (@react-three/fiber, @react-three/drei) for 3D rendering, reusing existing Prism component (OGL-based WebGL) for background, and implementing responsive carousel with Tailwind CSS.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2
**Primary Dependencies**: React Three Fiber, @react-three/drei, Three.js, OGL (for Prism), Tailwind CSS 4.1, Vite 7.2
**Storage**: Static assets (GLTF model, textures) in public/assets directory
**Testing**: Vitest + React Testing Library
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 years), Mobile Safari/Chrome
**Project Type**: Web (single-page application)
**Performance Goals**: 30+ FPS on desktop/standard mobile, 15-20 FPS acceptable on low-end devices, <3s initial load
**Constraints**: <500ms animation transition, maintain 320px minimum viewport width, WebGL 1.0+ required
**Scale/Scope**: 1 main view, 40+ animations, responsive carousel UI, ~8-10 source components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: No constitution.md file exists - this is a new project.

**Default Principles Applied**:
- Keep components simple and focused on single responsibilities
- Prefer functional components with hooks over class components
- Use established patterns from existing codebase (Prism component as reference)
- Minimize complexity - avoid over-engineering for hypothetical future needs
- Use TypeScript for type safety across all components

## Project Structure

### Documentation (this feature)

```text
specs/001-3d-bear-web-app/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Prism.tsx                    # Existing - background effect component
│   ├── BlurText.tsx                 # Existing - utility component
│   ├── BearModel.tsx                # NEW - 3D bear model loader and animator
│   ├── AnimationCarousel.tsx        # NEW - bottom carousel for animation selection
│   └── ErrorBoundary.tsx            # NEW - error handling for model load failures
│
├── hooks/
│   ├── useBearModel.ts              # NEW - model loading and animation management
│   ├── useDevicePerformance.ts      # NEW - detect device capabilities
│   └── useResponsive.ts             # NEW - responsive breakpoint detection
│
├── types/
│   └── bear.types.ts                # NEW - TypeScript types for bear model/animations
│
├── utils/
│   └── animation-config.ts          # NEW - animation metadata and color mappings
│
├── lib/
│   └── utils.ts                     # Existing - utility functions
│
├── App.tsx                          # UPDATE - main app layout
├── main.tsx                         # Existing - entry point
└── index.css                        # Existing - global styles

public/
└── assets/
    └── models/
        └── hairybear/               # NEW - copied from hairybear-desktop
            ├── hairybear.gltf
            ├── hairybear.bin
            └── Image_0.png

tests/
├── components/
│   ├── BearModel.test.tsx
│   └── AnimationCarousel.test.tsx
└── hooks/
    ├── useBearModel.test.ts
    └── useDevicePerformance.test.ts
```

**Structure Decision**: Using single web application structure (Option 1 adapted for React). All components in `src/components/`, hooks in `src/hooks/`, with existing Prism component preserved. New 3D rendering functionality isolated in dedicated components. Static assets served from `public/assets/` for optimal loading performance.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No constitution violations | No constitution file exists yet |

