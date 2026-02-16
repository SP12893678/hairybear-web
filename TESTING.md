# Testing Guide for 3D Bear Interactive Web App

This document provides instructions for manual testing and verification of the application.

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

## T038: Performance Testing

### FPS Monitoring

1. **Open Browser DevTools**:
   - Chrome: F12 → Performance tab → Click record → Interact with app → Stop
   - Use "Rendering" tab → Check "Frame Rendering Stats" for live FPS counter

2. **Performance Targets**:
   - ✅ High-end devices (discrete GPU): 30+ FPS
   - ✅ Medium devices (integrated GPU): 30 FPS
   - ✅ Low-end devices: 15-20 FPS (quality auto-reduced)

3. **Test Scenarios**:
   - Load page and verify initial animation runs smoothly
   - Switch between animations multiple times
   - Resize browser window
   - Test on mobile device (use Chrome DevTools device emulation)

### Performance Optimizations Implemented

- ✅ Performance tier detection (high/medium/low)
- ✅ Adaptive FPS targeting (30 for high/medium, 18 for low)
- ✅ DPR adjustment (2x for high, 1x for medium/low)
- ✅ Prism background suspended when offscreen
- ✅ Model preloading with useGLTF.preload()
- ✅ Mobile-optimized Prism settings (reduced timeScale and scale)

## T039: Cross-Browser Testing

### Browsers to Test

- ✅ **Chrome** (latest): Primary development browser
- ✅ **Firefox** (latest): Test WebGL compatibility
- ✅ **Safari** (latest): Test on macOS/iOS
- ✅ **Edge** (latest): Test Chromium-based rendering

### Test Checklist Per Browser

1. **Page Load**:
   - [ ] App displays in fullscreen (100vh x 100vw)
   - [ ] No scrollbars visible
   - [ ] Prism background renders correctly
   - [ ] Loading spinner appears

2. **3D Model**:
   - [ ] Bear model loads and displays centered
   - [ ] Default animation plays automatically
   - [ ] Animation loops continuously

3. **Carousel**:
   - [ ] Carousel displays at bottom
   - [ ] All 40 animations visible
   - [ ] Click switches animation smoothly (within 0.5s)
   - [ ] Background color syncs with selected animation
   - [ ] Selected item has visual highlight

4. **Keyboard Navigation**:
   - [ ] Tab key focuses carousel items
   - [ ] Enter/Space selects animation
   - [ ] Arrow keys navigate between items
   - [ ] Focus ring visible on selected item

5. **Responsive Design** (resize browser or use DevTools):
   - [ ] Mobile (<768px): Bear scaled to 0.6x, smaller carousel items
   - [ ] Tablet (768-1024px): Bear scaled to 0.8x, medium carousel items
   - [ ] Desktop (≥1024px): Bear at 1.0x scale, large carousel items
   - [ ] Viewport <320px: Warning banner appears, horizontal scroll enabled

6. **Error Handling**:
   - [ ] Disconnect network and reload → Error message appears
   - [ ] "Try Again" button reloads page
   - [ ] Background remains functional during error

## T040: Success Criteria Verification

### Functional Requirements

- **FR-001**: App displays in full viewport (100vh x 100vw) with no scrollbars
  - ✅ Implemented: `className="relative w-screen h-screen overflow-hidden"` in App.tsx

- **FR-002**: Prism background renders as fullscreen
  - ✅ Implemented: `className="absolute inset-0"` container for Prism

- **FR-003**: Bear model displays centered on screen
  - ✅ Implemented: Canvas with `camera={{ position: [0, 1, 5], fov: 50 }}`

- **FR-004**: Model loads from hairybear-desktop assets
  - ✅ Implemented: `MODEL_PATH = '/assets/models/hairybear/hairybear.gltf'`

- **FR-005**: Default animation plays automatically and loops
  - ✅ Implemented: `selectedIndex` defaults to 0, `setLoop(THREE.LoopRepeat, Infinity)`

- **FR-006**: Carousel displays at bottom of viewport
  - ✅ Implemented: `className="fixed bottom-0"` in AnimationCarousel

- **FR-007**: Animation switches on carousel selection
  - ✅ Implemented: `handleAnimationSelect` callback in App.tsx

- **FR-008**: Background color scheme updates with animation
  - ✅ Implemented: Prism receives `hueShift`, `colorFrequency`, `bloom` from currentAnimation

- **FR-009**: Continuous looping maintained
  - ✅ Implemented: `setLoop(THREE.LoopRepeat, Infinity)` in useBearModel

- **FR-010**: Device type detection and responsive styling
  - ✅ Implemented: useResponsive hook detects mobile/tablet/desktop

- **FR-011**: Bear model scales down on mobile
  - ✅ Implemented: `bearScale` calculation based on deviceType

- **FR-012**: Prism background adapts to mobile viewport
  - ✅ Implemented: `prismTimeScale` and `prismScale` adjust for mobile

- **FR-013**: Carousel works with touch interaction
  - ✅ Implemented: `WebkitOverflowScrolling: 'touch'`, `touch-manipulation` class

- **FR-014**: Graceful error handling (error message, keep background)
  - ✅ Implemented: ErrorBoundary with user-friendly message and retry button

- **FR-015**: Rapid clicks cancel in-progress transitions
  - ✅ Implemented: Immediate stop() of other animations in playAnimation()

- **FR-016**: Keyboard navigation support (Tab, Enter/Space)
  - ✅ Implemented: handleKeyDown in AnimationCarousel, role="listbox"

- **FR-017**: Handle viewports <320px with horizontal scroll
  - ✅ Implemented: `isBelowMinWidth` check with warning banner

- **FR-018**: Reduce quality on low-end devices (15-20 FPS)
  - ✅ Implemented: Performance tier detection, targetFPS adjustment

### Success Criteria

- **SC-001**: App loads within 3 seconds
  - ✅ Test: Open app in DevTools Network tab (Fast 3G throttling)
  - Expected: Initial render <3s

- **SC-002**: Animations maintain 30+ FPS
  - ✅ Test: Enable FPS counter in DevTools Rendering tab
  - Expected: High/medium devices ≥30 FPS, low devices ≥15 FPS

- **SC-003**: Animation switches within 0.5 seconds
  - ✅ Test: Click carousel items rapidly
  - Expected: Smooth 500ms crossfade transition

- **SC-004**: Displays correctly 320px to 3840px
  - ✅ Test: Resize browser from 320px to 3840px
  - Expected: Responsive layout adapts, no broken UI

- **SC-005**: Touch gestures work on mobile
  - ✅ Test: Use real mobile device or DevTools mobile emulation
  - Expected: Carousel swipe-scrollable, tap to select

- **SC-006**: Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
  - ✅ Test: Open app in all four browsers
  - Expected: Consistent behavior and rendering

## Performance Profiling

### Chrome DevTools Performance Profile

1. Open DevTools → Performance tab
2. Click record (⚫)
3. Interact with the app:
   - Let default animation play for 5 seconds
   - Click 5 different carousel items
   - Resize window from desktop → mobile → desktop
4. Stop recording
5. Analyze:
   - **Scripting**: Should be <30% of frame time
   - **Rendering**: Should be <50% of frame time
   - **FPS**: Should show consistent 30+ FPS (or 15+ on low-end)
   - **Long Tasks**: Should have no tasks >50ms

### Lighthouse Audit

```bash
# Build production version
npm run build
npm run preview

# Run Lighthouse in Chrome DevTools
# Performance score target: 80+
# Accessibility score target: 95+
```

### Expected Results

- **Performance**: 75-85 (3D apps typically score lower)
- **Accessibility**: 95+ (all ARIA labels, keyboard nav, focus states)
- **Best Practices**: 90+
- **SEO**: 90+

## Mobile Device Testing

### iOS Safari

1. **Build and serve**:
   ```bash
   npm run build
   npm run preview -- --host
   ```

2. **Access from iPhone**:
   - Find your local IP: `ipconfig getifaddr en0` (macOS)
   - Open Safari on iPhone: `http://<your-ip>:4173`

3. **Test**:
   - [ ] Touch scroll carousel works
   - [ ] Tap to select animation works
   - [ ] Bear scales to 60% size on mobile
   - [ ] Animations run smoothly (check for frame drops)
   - [ ] No horizontal scroll (except <320px)

### Android Chrome

Follow same steps as iOS Safari, but use Chrome on Android device.

## Accessibility Testing

### axe DevTools Extension

1. Install axe DevTools for Chrome/Firefox
2. Open app → Run axe scan
3. Expected: 0 violations

### Manual Keyboard Navigation

1. **Tab Navigation**:
   - Press Tab → Should focus first carousel item
   - Press Tab repeatedly → Should cycle through all items
   - Focus ring should be visible

2. **Selection**:
   - Focus an item → Press Enter → Animation should switch
   - Focus an item → Press Space → Animation should switch

3. **Arrow Navigation**:
   - Focus an item → Press → (right arrow) → Next item focuses
   - Focus an item → Press ← (left arrow) → Previous item focuses

### Screen Reader Testing (Optional)

- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA
- Expected: Carousel announces "Animation selection listbox", items announce name and selected state

## Known Issues / Limitations

- Large bundle size (1.2MB) due to Three.js - acceptable for 3D app
- Initial model load may take 2-3s on slow connections
- WebGL not supported on very old browsers (IE11, old mobile browsers)

## Next Steps After Testing

1. ✅ All tests pass → Ready for deployment
2. ❌ Issues found → Document and fix before deployment
3. Deploy to:
   - Vercel: `npm run build && vercel --prod`
   - Netlify: `npm run build && netlify deploy --prod`
   - GitHub Pages: Requires base path configuration

## Manual Test Report Template

```
Date: ___________
Tester: ___________
Browser: ___________
Device: ___________

FR-001 (Fullscreen viewport): [ ] Pass [ ] Fail
FR-002 (Prism background): [ ] Pass [ ] Fail
FR-003 (Centered bear): [ ] Pass [ ] Fail
FR-004 (Model loads): [ ] Pass [ ] Fail
FR-005 (Default animation): [ ] Pass [ ] Fail
FR-006 (Carousel bottom): [ ] Pass [ ] Fail
FR-007 (Animation switches): [ ] Pass [ ] Fail
FR-008 (Background sync): [ ] Pass [ ] Fail
FR-009 (Continuous loop): [ ] Pass [ ] Fail
FR-010 (Device detection): [ ] Pass [ ] Fail
FR-011 (Mobile scaling): [ ] Pass [ ] Fail
FR-012 (Mobile Prism): [ ] Pass [ ] Fail
FR-013 (Touch interaction): [ ] Pass [ ] Fail
FR-014 (Error handling): [ ] Pass [ ] Fail
FR-015 (Rapid clicks): [ ] Pass [ ] Fail
FR-016 (Keyboard nav): [ ] Pass [ ] Fail
FR-017 (Small viewports): [ ] Pass [ ] Fail
FR-018 (Low-end perf): [ ] Pass [ ] Fail

SC-001 (Load <3s): [ ] Pass [ ] Fail - Actual: ____s
SC-002 (30+ FPS): [ ] Pass [ ] Fail - Actual: ____fps
SC-003 (Switch <0.5s): [ ] Pass [ ] Fail
SC-004 (320-3840px): [ ] Pass [ ] Fail
SC-005 (Touch gestures): [ ] Pass [ ] Fail
SC-006 (Cross-browser): [ ] Pass [ ] Fail

Notes:
_____________________________________________
_____________________________________________
```
