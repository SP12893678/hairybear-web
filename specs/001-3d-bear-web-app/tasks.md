# Tasks: 3D Bear Interactive Web App

**Input**: Design documents from `/specs/001-3d-bear-web-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-interfaces.ts

**Tests**: Tests are NOT explicitly requested in the feature specification, so test tasks are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Type**: Web (single-page application)
- **Structure**: `src/` at repository root
- Assets served from `public/assets/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and copy model assets

- [x] T001 Install React Three Fiber dependencies (@react-three/fiber@latest @react-three/drei@latest three@latest)
- [x] T002 Install TypeScript types for Three.js (@types/three@latest)
- [x] T003 Create directory structure public/assets/models/hairybear/
- [x] T004 Copy GLTF model files from hairybear-desktop project to public/assets/models/hairybear/ (hairybear.gltf, hairybear.bin, Image_0.png)
- [x] T005 Add public/assets/models/ to .gitignore to prevent committing large binary files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and configuration that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create TypeScript type definitions in src/types/bear.types.ts (ActionName, ColorScheme, Animation, DeviceType, PerformanceTier, LoadingStatus, etc.)
- [x] T007 [P] Create animation configuration with color schemes for all 40 animations in src/utils/animation-config.ts (ANIMATION_CONFIG map, ANIMATIONS array, getAnimationByName helper)
- [x] T008 [P] Create useDevicePerformance hook in src/hooks/useDevicePerformance.ts (WebGL detection, GPU classification, FPS tier determination)
- [x] T009 [P] Create useResponsive hook in src/hooks/useResponsive.ts (viewport tracking, device type detection, breakpoint helpers)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View 3D Bear Model on Landing (Priority: P1) 🎯 MVP

**Goal**: Display centered animated 3D bear model with Prism background on page load

**Independent Test**: Open app on desktop browser - bear model appears centered, Prism background fills viewport, default animation plays continuously and loops

**Acceptance Criteria**:
- FR-001: App displays in full viewport (100vh x 100vw) with no scrollbars
- FR-002: Prism background renders as fullscreen
- FR-003: Bear model displays centered on screen
- FR-004: Model loads from hairybear-desktop assets
- FR-005: Default animation plays automatically and loops
- SC-001: App loads within 3 seconds
- SC-002: Animations maintain 30+ FPS

### Implementation for User Story 1

- [x] T010 [P] [US1] Create ErrorBoundary class component in src/components/ErrorBoundary.tsx (catch rendering errors, display fallback UI, keep background functional per FR-014)
- [x] T011 [P] [US1] Create useBearModel custom hook in src/hooks/useBearModel.ts (useGLTF for model loading, useAnimations for animation control, progress tracking, error handling, playAnimation function with 500ms crossfade)
- [x] T012 [US1] Create BearModel component in src/components/BearModel.tsx (render GLTF model using React Three Fiber, handle animation playback, support scale prop, performance-based quality settings per FR-018)
- [x] T013 [US1] Update App.tsx to integrate BearModel with existing Prism background (fullscreen layout, Canvas setup with camera configuration, ErrorBoundary wrapping, default animation state)
- [x] T014 [US1] Update App.tsx fullscreen layout styles (100vh x 100vw container, remove scrollbars per FR-001, absolute positioning for layers)
- [x] T015 [US1] Verify model loads and displays correctly (check Console for errors, test default animation loops continuously per FR-005 and FR-009)

**Checkpoint**: At this point, User Story 1 should be fully functional - bear model visible, animated, with Prism background

---

## Phase 4: User Story 2 - Switch Bear Animations via Carousel (Priority: P2)

**Goal**: Add interactive carousel control at bottom of screen for animation selection with background synchronization

**Independent Test**: Click carousel items - bear animation switches within 0.5s, background color updates, animation loops continuously

**Acceptance Criteria**:
- FR-006: Carousel displays at bottom of viewport
- FR-007: Animation switches on carousel selection
- FR-008: Background color scheme updates with animation
- FR-009: Continuous looping maintained
- FR-015: Rapid clicks cancel in-progress transitions
- FR-016: Keyboard navigation support (Tab, Enter/Space)
- SC-003: Animation switches within 0.5 seconds

### Implementation for User Story 2

- [x] T016 [P] [US2] Create AnimationCarousel component in src/components/AnimationCarousel.tsx (horizontal scrolling list, thumbnail display, selected state styling, onClick handler, auto-scroll selected item into view)
- [x] T017 [P] [US2] Add keyboard navigation to AnimationCarousel (Tab focus management, Enter/Space selection, role="listbox", aria-selected attributes per FR-016)
- [x] T018 [P] [US2] Add hover effects and visual feedback to carousel items (hover state styling, focus ring for accessibility)
- [x] T019 [US2] Update App.tsx to add carousel state management (selectedIndex state, handleAnimationSelect callback, integration with BearModel animation prop)
- [x] T020 [US2] Update App.tsx to sync Prism background colors with selected animation (extract colorScheme from ANIMATION_CONFIG, pass to Prism component props: hueShift, colorFrequency, bloom per FR-008)
- [x] T021 [US2] Update BearModel to handle rapid animation switches (cancel in-progress crossfade transitions, immediately switch to latest selection per FR-015)
- [x] T022 [US2] Verify carousel functionality (click switching, keyboard navigation, background color sync, 500ms transition timing per SC-003)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - can view bear and switch animations interactively

---

## Phase 5: User Story 3 - Mobile Responsive Experience (Priority: P3)

**Goal**: Adapt UI for mobile devices with scaled bear model and optimized background

**Independent Test**: Open app on mobile device (or DevTools mobile emulation) - bear scales smaller, carousel touch-friendly, background adapts, orientation changes handled

**Acceptance Criteria**:
- FR-010: Device type detection and responsive styling
- FR-011: Bear model scales down on mobile
- FR-012: Prism background adapts to mobile viewport
- FR-013: Carousel works with touch interaction
- FR-017: Handle viewports < 320px with horizontal scroll
- FR-018: Reduce quality on low-end devices (15-20 FPS)
- SC-004: Displays correctly 320px to 3840px
- SC-005: Touch gestures work on mobile

### Implementation for User Story 3

- [x] T023 [P] [US3] Add responsive scaling logic to App.tsx (use useResponsive hook, calculate bearScale based on deviceType: desktop=1.0, tablet=0.8, mobile=0.6 per plan.md)
- [x] T024 [P] [US3] Update BearModel to accept and apply scale prop (scale entire group by bearScale factor per FR-011)
- [x] T025 [P] [US3] Update AnimationCarousel for mobile styling (smaller thumbnails on mobile, touch-optimized spacing, responsive item sizes per deviceType)
- [x] T026 [P] [US3] Add touch interaction support to AnimationCarousel (horizontal swipe scrolling, tap selection per FR-013)
- [x] T027 [P] [US3] Update Prism component usage for mobile performance (adjust timeScale, reduce complexity on mobile per FR-012)
- [x] T028 [US3] Add performance adaptation to BearModel (detect performanceTier, apply targetFPS: high/medium=30, low=15-20 per FR-018 and SC-002)
- [x] T029 [US3] Add minimum viewport width handling to App.tsx (detect < 320px, enable horizontal scrolling, display warning banner per FR-017)
- [x] T030 [US3] Add orientation change handling (listen to window resize, update layout on portrait/landscape switch)
- [x] T031 [US3] Test responsive behavior across breakpoints (320px mobile, 768px tablet, 1024px+ desktop, verify bear scaling, carousel sizing, background adaptation)

**Checkpoint**: All user stories should now be independently functional across all device sizes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T032 [P] Add loading spinner while model is fetching (display during ModelState.status === 'loading', hide on 'loaded')
- [x] T033 [P] Improve error messages in ErrorBoundary (user-friendly text, retry button that reloads page per contracts)
- [x] T034 [P] Add fade-in animation for bear model on initial load (CSS transition or React Spring animation)
- [x] T035 [P] Optimize Prism background performance settings (suspendWhenOffscreen=true already in plan, verify implementation)
- [x] T036 [P] Add accessibility improvements (ensure all interactive elements have proper focus states, verify ARIA labels on carousel)
- [x] T037 Code cleanup and TypeScript strict mode validation (fix any 'any' types, ensure null checks)
- [x] T038 Performance testing and optimization (monitor FPS with browser DevTools, verify 30+ FPS on standard devices, 15-20 FPS on low-end)
- [x] T039 Cross-browser testing (Chrome, Firefox, Safari, Edge - verify per SC-006)
- [x] T040 Verify all success criteria (test against SC-001 through SC-006, document results)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends US1 with carousel, independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends US1/US2 with responsive design, independently testable

**Note**: User Stories 2 and 3 build upon US1, but each delivers independent value:
- US1 alone = MVP (view bear with animation)
- US1 + US2 = Interactive experience (switch animations)
- US1 + US2 + US3 = Full responsive app (mobile support)

### Within Each User Story

- Models/Hooks before Components
- Components before App integration
- Core implementation before testing
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: All tasks can run sequentially (model copy depends on directory creation)

**Phase 2 (Foundational)**: T006-T009 all marked [P] can run in parallel

**Phase 3 (US1)**: T010 and T011 marked [P] can run in parallel, then T012-T015 sequential

**Phase 4 (US2)**: T016, T017, T018 marked [P] can run in parallel, then T019-T022 sequential

**Phase 5 (US3)**: T023-T027 marked [P] can run in parallel, then T028-T031 sequential

**Phase 6 (Polish)**: T032-T036 marked [P] can run in parallel, then T037-T040 sequential

---

## Parallel Example: User Story 1

```bash
# Launch foundational tasks together:
Task: "Create type definitions in src/types/bear.types.ts" (T006)
Task: "Create animation config in src/utils/animation-config.ts" (T007)
Task: "Create useDevicePerformance hook" (T008)
Task: "Create useResponsive hook" (T009)

# Then launch US1 component tasks together:
Task: "Create ErrorBoundary in src/components/ErrorBoundary.tsx" (T010)
Task: "Create useBearModel hook in src/hooks/useBearModel.ts" (T011)
```

---

## Parallel Example: User Story 2

```bash
# Launch carousel component tasks together:
Task: "Create AnimationCarousel component" (T016)
Task: "Add keyboard navigation to AnimationCarousel" (T017)
Task: "Add hover effects to carousel items" (T018)

# Then integrate sequentially:
Task: "Update App.tsx for carousel state" (T019)
Task: "Sync Prism colors with animation" (T020)
```

---

## Parallel Example: User Story 3

```bash
# Launch responsive updates together:
Task: "Add responsive scaling logic to App.tsx" (T023)
Task: "Update BearModel for scale prop" (T024)
Task: "Update AnimationCarousel mobile styling" (T025)
Task: "Add touch interaction support" (T026)
Task: "Update Prism for mobile performance" (T027)

# Then add performance and edge case handling:
Task: "Add performance adaptation to BearModel" (T028)
Task: "Add minimum viewport handling" (T029)
Task: "Add orientation change handling" (T030)
Task: "Test responsive behavior" (T031)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T009) - CRITICAL
3. Complete Phase 3: User Story 1 (T010-T015)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Open app on desktop
   - Verify bear model appears centered
   - Verify default animation plays and loops
   - Verify Prism background fills viewport
   - Check FPS is 30+
5. Deploy/demo if ready - MVP complete!

### Incremental Delivery

1. **Foundation** (T001-T009): Setup + Types + Hooks → Ready for features
2. **MVP** (T010-T015): User Story 1 → Test independently → Deploy/Demo (basic viewing)
3. **Interactive** (T016-T022): User Story 2 → Test independently → Deploy/Demo (carousel switching)
4. **Responsive** (T023-T031): User Story 3 → Test independently → Deploy/Demo (mobile support)
5. **Polish** (T032-T040): Cross-cutting improvements → Final testing → Production ready

Each story adds value without breaking previous stories!

### Parallel Team Strategy

With multiple developers:

1. **Team together** completes Setup + Foundational (T001-T009)
2. Once Foundational is done, **split work**:
   - Developer A: User Story 1 (T010-T015)
   - Developer B: User Story 2 (T016-T022) - can start after US1 basic structure
   - Developer C: User Story 3 (T023-T031) - can start after US1 basic structure
3. Stories complete and integrate independently
4. **Team together** for final Polish (T032-T040)

---

## Task Summary

**Total Tasks**: 40

**Tasks by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (User Story 1): 6 tasks
- Phase 4 (User Story 2): 7 tasks
- Phase 5 (User Story 3): 9 tasks
- Phase 6 (Polish): 9 tasks

**Tasks by User Story**:
- User Story 1: 6 tasks (T010-T015)
- User Story 2: 7 tasks (T016-T022)
- User Story 3: 9 tasks (T023-T031)

**Parallelizable Tasks**: 18 tasks marked with [P]

**Independent Test Criteria**:
- **US1**: Open app → bear visible, animated, background renders
- **US2**: Click carousel → animation switches, background changes
- **US3**: Open on mobile → bear scaled, carousel touch-works, responsive layout

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1) = 15 tasks

**Estimated Implementation Time**: 12-16 hours
- Setup + Foundation: 2-3 hours
- User Story 1 (MVP): 3-4 hours
- User Story 2: 3-4 hours
- User Story 3: 3-4 hours
- Polish: 1-2 hours

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to parallelize
- **[Story] labels**: Map tasks to user stories for traceability
- **File paths**: All paths are exact - ready for implementation
- **Sequential dependencies**: Clearly marked (e.g., "depends on T012, T013")
- **Checkpoints**: Each user story has validation checkpoint
- **Testing approach**: Manual testing at checkpoints (no automated tests requested in spec)
- **Model assets**: Remember to verify GLTF files load correctly (8.8MB total)
- **Performance**: Monitor FPS during development, especially on mobile
- **Accessibility**: ARIA labels and keyboard navigation are requirements, not polish
- **Error handling**: FR-014 requires graceful degradation - test network failures

**Commit Strategy**:
- Commit after each completed task
- Tag commits with task ID (e.g., "T015: Verify model loads correctly")
- Create checkpoint commits after each user story completion
- Branch naming: `feature/001-3d-bear-web-app` or task-specific branches

**Validation Before Moving Forward**:
- After Setup (Phase 1): Verify dependencies installed, model files copied
- After Foundational (Phase 2): Verify TypeScript types compile, hooks work
- After US1 (Phase 3): Test independently - bear renders, animates, loops
- After US2 (Phase 4): Test independently - carousel works, animations switch
- After US3 (Phase 5): Test independently - responsive, mobile-friendly
- After Polish (Phase 6): Full cross-browser, cross-device testing

**Next Steps After Tasks Complete**:
1. Run production build: `npm run build`
2. Preview: `npm run preview`
3. Performance audit with Lighthouse
4. Accessibility audit with axe DevTools
5. Deploy to hosting (Vercel, Netlify, etc.)
6. Optional: Convert to GitHub issues with `/speckit.taskstoissues`
