# Motion (Framer Motion) Guide

*The React-first animation library*

---

## Why Motion?

- **React-native API** - Animates like writing JSX
- **Layout animations** - Animate between layouts magically
- **Exit animations** - AnimatePresence for unmounting
- **Gestures** - Drag, hover, tap built-in
- **Spring physics** - Natural-feeling motion

---

## Installation

```bash
npm install motion
```

```jsx
import { motion } from 'motion/react'
```

---

## Basic Animations

### Simple Animation

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Hello
</motion.div>
```

### Hover & Tap

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### On Viewport Entry

```jsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: '-100px' }}
>
  Fades in when scrolled into view
</motion.div>
```

---

## Transition Options

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    // Timing
    duration: 0.5,
    delay: 0.2,
    
    // Easing
    ease: 'easeOut',
    ease: [0.17, 0.67, 0.83, 0.67], // Cubic bezier
    
    // Spring (recommended for natural motion)
    type: 'spring',
    stiffness: 300,
    damping: 20,
    mass: 1,
    
    // Repeat
    repeat: Infinity,
    repeatType: 'reverse',
  }}
/>
```

### Spring Presets

```jsx
// Bouncy
transition={{ type: 'spring', stiffness: 500, damping: 15 }}

// Smooth
transition={{ type: 'spring', stiffness: 100, damping: 20 }}

// Quick
transition={{ type: 'spring', stiffness: 400, damping: 25 }}
```

---

## Variants

Define animation states in one place:

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function List() {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.li key={item} variants={itemVariants}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

---

## Exit Animations

Use `AnimatePresence` for unmount animations:

```jsx
import { AnimatePresence, motion } from 'motion/react'

function Modal({ isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          Modal content
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Mode Options

```jsx
<AnimatePresence mode="wait">     {/* Wait for exit before enter */}
<AnimatePresence mode="popLayout"> {/* Smooth layout transition */}
<AnimatePresence mode="sync">      {/* Enter and exit together */}
```

---

## Layout Animations

Animate between different layouts automatically:

```jsx
function ExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <motion.div
      layout
      style={{
        width: isExpanded ? 300 : 100,
        height: isExpanded ? 200 : 100
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.h2 layout="position">Title</motion.h2>
    </motion.div>
  )
}
```

### Shared Layout Animations

```jsx
function Tabs() {
  const [activeTab, setActiveTab] = useState(0)
  
  return (
    <div className="tabs">
      {tabs.map((tab, i) => (
        <button key={tab} onClick={() => setActiveTab(i)}>
          {tab}
          {activeTab === i && (
            <motion.div
              layoutId="underline"
              className="underline"
            />
          )}
        </button>
      ))}
    </div>
  )
}
```

---

## Gestures

### Drag

```jsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
  dragElastic={0.1}
  dragMomentum={false}
  whileDrag={{ scale: 1.1 }}
/>

// Drag to dismiss
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    if (Math.abs(offset.y) > 100) {
      onDismiss()
    }
  }}
/>
```

### Pan

```jsx
<motion.div
  onPan={(e, info) => {
    console.log(info.point.x, info.point.y)
    console.log(info.delta.x, info.delta.y)
  }}
/>
```

---

## Scroll Animations

### useScroll

```jsx
import { useScroll, useTransform, motion } from 'motion/react'

function ParallaxSection() {
  const { scrollYProgress } = useScroll()
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0])
  
  return (
    <motion.div style={{ y, opacity }}>
      Parallax content
    </motion.div>
  )
}
```

### Scroll Progress for Specific Element

```jsx
function Section() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'] // When element enters/exits
  })
  
  return <div ref={ref}>...</div>
}
```

---

## Animation Controls

### useAnimate

```jsx
import { useAnimate } from 'motion/react'

function Component() {
  const [scope, animate] = useAnimate()
  
  const handleClick = async () => {
    await animate('.box', { x: 100 })
    await animate('.box', { rotate: 180 })
    animate('.box', { scale: 1.5 })
  }
  
  return (
    <div ref={scope}>
      <button onClick={handleClick}>Animate</button>
      <div className="box" />
    </div>
  )
}
```

### useAnimationControls

```jsx
import { useAnimationControls, motion } from 'motion/react'

function Component() {
  const controls = useAnimationControls()
  
  return (
    <>
      <button onClick={() => controls.start({ x: 100 })}>
        Move
      </button>
      <motion.div animate={controls} />
    </>
  )
}
```

---

## Motion Values

For high-performance animations:

```jsx
import { useMotionValue, useTransform, motion } from 'motion/react'

function Component() {
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0])
  const backgroundColor = useTransform(
    x,
    [-100, 100],
    ['#ff0000', '#00ff00']
  )
  
  return (
    <motion.div
      drag="x"
      style={{ x, opacity, backgroundColor }}
    />
  )
}
```

---

## Performance Tips

### 1. Animate Transform Properties

```jsx
// ✅ Good - GPU accelerated
<motion.div animate={{ x: 100, scale: 1.2, rotate: 45 }} />

// ❌ Bad - Triggers layout
<motion.div animate={{ width: 200, marginLeft: 100 }} />
```

### 2. Use willChange

```jsx
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
/>
```

### 3. Lazy Motion

Reduce bundle size:

```jsx
import { LazyMotion, domAnimation, m } from 'motion/react'

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div animate={{ x: 100 }} />
    </LazyMotion>
  )
}
```

---

## Common Patterns

### Staggered List

```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i} variants={item} />)}
</motion.ul>
```

### Page Transitions

```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <Page />
  </motion.div>
</AnimatePresence>
```

### Magnetic Button

```jsx
function MagneticButton({ children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.2)
    y.set((e.clientY - centerY) * 0.2)
  }
  
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  
  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  )
}
```

---

## Resources

- **Docs:** https://motion.dev/docs
- **Examples:** https://motion.dev/examples
