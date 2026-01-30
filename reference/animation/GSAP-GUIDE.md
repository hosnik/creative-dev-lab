# GSAP Animation Guide

*The professional standard for web animation*

---

## Why GSAP?

- **Performance** - Optimized for 60fps, handles the hard stuff
- **Browser support** - Works everywhere, even old browsers
- **Ecosystem** - ScrollTrigger, Draggable, MorphSVG, etc.
- **Timeline** - Complex orchestrated sequences
- **Easing** - Beautiful, customizable motion curves

---

## Installation

```bash
npm install gsap
```

For ScrollTrigger:
```bash
npm install gsap
```

```javascript
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

---

## Basic Tweens

### gsap.to() - Animate TO a state
```javascript
gsap.to('.box', {
  x: 200,
  duration: 1,
  ease: 'power2.out'
})
```

### gsap.from() - Animate FROM a state
```javascript
gsap.from('.box', {
  opacity: 0,
  y: 50,
  duration: 0.8
})
```

### gsap.fromTo() - Explicit start and end
```javascript
gsap.fromTo('.box', 
  { x: -100, opacity: 0 },
  { x: 0, opacity: 1, duration: 1 }
)
```

---

## Essential Properties

```javascript
gsap.to('.element', {
  // Transform
  x: 100,           // translateX
  y: 50,            // translateY
  rotation: 360,    // rotate
  scale: 1.5,
  scaleX: 2,
  scaleY: 0.5,
  skewX: 15,
  
  // Visibility
  opacity: 0.5,
  autoAlpha: 0,     // opacity + visibility
  
  // Layout
  width: '50%',
  height: 200,
  
  // Color
  backgroundColor: '#ff0000',
  color: 'blue',
  
  // Timing
  duration: 1,
  delay: 0.5,
  
  // Easing
  ease: 'power2.inOut',
  
  // Callbacks
  onStart: () => console.log('started'),
  onComplete: () => console.log('done'),
  onUpdate: () => console.log('updating'),
})
```

---

## Easing Functions

```javascript
// Power easings (1-4, higher = more dramatic)
'power1.out'   // Subtle
'power2.out'   // Recommended default
'power3.out'   // Punchy
'power4.out'   // Very dramatic

// Directions
'power2.in'    // Slow start, fast end
'power2.out'   // Fast start, slow end
'power2.inOut' // Slow start and end

// Special easings
'elastic.out(1, 0.3)'  // Bouncy overshoot
'bounce.out'           // Ball bounce
'back.out(1.7)'        // Slight overshoot
'expo.out'             // Very fast start
'circ.out'             // Circular motion

// Custom
'steps(5)'             // Stepped animation
```

### Visualize Easings
https://gsap.com/docs/v3/Eases/

---

## Timelines

Orchestrate complex sequences:

```javascript
const tl = gsap.timeline()

tl.to('.box1', { x: 100, duration: 0.5 })
  .to('.box2', { x: 100, duration: 0.5 })  // Starts after box1
  .to('.box3', { x: 100, duration: 0.5 })  // Starts after box2
```

### Position Parameter

```javascript
const tl = gsap.timeline()

// Absolute time
tl.to('.a', { x: 100 }, 0)      // At 0 seconds
  .to('.b', { x: 100 }, 0.5)    // At 0.5 seconds
  .to('.c', { x: 100 }, 1)      // At 1 second

// Relative positioning
tl.to('.a', { x: 100 })
  .to('.b', { x: 100 }, '<')     // Same time as previous
  .to('.c', { x: 100 }, '<0.2')  // 0.2s after previous starts
  .to('.d', { x: 100 }, '-=0.3') // 0.3s before end of timeline
  .to('.e', { x: 100 }, '+=0.5') // 0.5s after end of timeline
```

### Timeline Controls

```javascript
const tl = gsap.timeline({ paused: true })

tl.play()
tl.pause()
tl.reverse()
tl.restart()
tl.progress(0.5) // Jump to 50%
tl.timeScale(2)  // 2x speed
```

---

## ScrollTrigger

### Basic Scroll Animation

```javascript
gsap.to('.box', {
  x: 500,
  scrollTrigger: {
    trigger: '.box',
    start: 'top center',    // When top of trigger hits center of viewport
    end: 'bottom center',   // When bottom of trigger hits center
    scrub: true,            // Link animation to scroll position
    markers: true,          // Debug markers (remove in production)
  }
})
```

### Start/End Values

```javascript
start: 'top center'     // trigger-position viewport-position
start: 'top 80%'        // When top of trigger is at 80% of viewport
start: 'center center'  // When centers align
start: 'top top'        // When tops align (pinned header style)
start: '-=100'          // 100px before default position
```

### Scrub Options

```javascript
scrub: true       // 1:1 with scroll, instant
scrub: 0.5        // 0.5s smooth catch-up
scrub: 1          // 1s smooth catch-up (recommended)
```

### Pin Elements

```javascript
gsap.to('.panel', {
  scrollTrigger: {
    trigger: '.panel',
    start: 'top top',
    end: '+=500',        // Pin for 500px of scroll
    pin: true,
    pinSpacing: true,    // Add space for pinned element
  }
})
```

### Parallax Effect

```javascript
gsap.to('.background', {
  yPercent: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  }
})
```

---

## React Integration

### useGSAP Hook (Recommended)

```jsx
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

function Component() {
  const container = useRef()
  
  useGSAP(() => {
    // All GSAP animations here
    gsap.to('.box', { x: 100 })
  }, { scope: container }) // Scope to container
  
  return (
    <div ref={container}>
      <div className="box" />
    </div>
  )
}
```

### Manual Cleanup

```jsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Component() {
  const boxRef = useRef()
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(boxRef.current, { x: 100 })
    })
    
    return () => ctx.revert() // Cleanup on unmount
  }, [])
  
  return <div ref={boxRef} />
}
```

---

## Stagger Animations

Animate multiple elements with delay between each:

```javascript
gsap.to('.item', {
  y: 0,
  opacity: 1,
  stagger: 0.1,       // 0.1s between each
  duration: 0.5,
})

// Advanced stagger
gsap.to('.item', {
  stagger: {
    each: 0.1,        // Time between each
    from: 'center',   // Start from center
    grid: [4, 4],     // For grid layouts
    ease: 'power2.in'
  }
})
```

---

## Best Practices

### 1. Use will-change

```javascript
gsap.to('.element', {
  x: 100,
  force3D: true,  // Use 3D transforms for GPU acceleration
})
```

### 2. Batch ScrollTriggers

```javascript
ScrollTrigger.batch('.item', {
  onEnter: (elements) => {
    gsap.to(elements, { opacity: 1, y: 0, stagger: 0.1 })
  }
})
```

### 3. Kill Animations on Cleanup

```javascript
// Kill specific
gsap.killTweensOf('.element')

// Kill all
gsap.globalTimeline.clear()

// Context-based cleanup
const ctx = gsap.context(() => { /* animations */ })
ctx.revert()
```

### 4. Responsive ScrollTrigger

```javascript
ScrollTrigger.matchMedia({
  '(min-width: 800px)': function() {
    // Desktop animations
  },
  '(max-width: 799px)': function() {
    // Mobile animations
  }
})
```

---

## Quick Reference

```javascript
// Simple animation
gsap.to('.el', { x: 100, duration: 0.5 })

// Scroll-linked
gsap.to('.el', { x: 100, scrollTrigger: { trigger: '.el', scrub: 1 } })

// Timeline
const tl = gsap.timeline()
tl.to('.a', { x: 100 }).to('.b', { x: 100 }, '<')

// Stagger
gsap.to('.items', { y: 0, stagger: 0.1 })

// Pin
ScrollTrigger.create({ trigger: '.el', pin: true, end: '+=500' })
```

---

## Resources

- **Docs:** https://gsap.com/docs/v3/
- **Easing visualizer:** https://gsap.com/docs/v3/Eases/
- **Cheat sheet:** https://gsap.com/cheatsheet/
