# Unicorn Studio Guide

*No-code WebGL for rapid prototyping and production*

🔗 https://unicorn.studio

---

## What is Unicorn Studio?

A no-code tool for creating WebGL effects that export as lightweight, embeddable code. Perfect for:

- Rapid prototyping shader effects
- Creating hero animations without code
- Background effects
- Interactive UI elements
- Client demos

---

## Key Features

### Effects Library
- Distortion effects
- Particle systems
- Gradient animations
- Image effects (RGB split, blur, etc.)
- Noise and organic effects
- Mouse-reactive elements

### Export Options
- **Embed code** - Drop into any website
- **React component** - Native integration
- **Video** - For presentations
- **GIF** - For previews

---

## When to Use Unicorn Studio

### ✅ Good For

1. **Hero backgrounds** - Animated gradients, particles
2. **Image effects** - Hover distortions, reveals
3. **Quick prototypes** - Test ideas before coding
4. **Client presentations** - Show concepts fast
5. **Marketing sites** - Lightweight embeds

### ❌ Not Ideal For

1. **Complex 3D scenes** - Use Three.js
2. **Heavy customization** - Write shaders instead
3. **Performance-critical apps** - Custom code is leaner
4. **Unique interactions** - Limited to their system

---

## Workflow

### 1. Design in Unicorn
- Start with template or blank
- Layer effects
- Add interactions (mouse, scroll)
- Preview in real-time

### 2. Export for React

```bash
npm install @aspect-ui/react-unicorn
```

```jsx
import { Unicorn } from '@aspect-ui/react-unicorn'

function Hero() {
  return (
    <Unicorn
      projectId="your-project-id"
      style={{ width: '100%', height: '100vh' }}
    />
  )
}
```

### 3. Or Embed Directly

```html
<script src="https://cdn.unicorn.studio/v1.0.0/unicorn.js"></script>
<div data-unicorn="your-project-id"></div>
```

---

## Performance Considerations

### Pros
- Optimized output
- Lazy loading built-in
- Mobile detection
- Fallback images

### Cons
- External dependency
- Limited control
- Subscription cost for advanced features

---

## Alternatives

| Tool | Best For |
|------|----------|
| **Unicorn Studio** | Quick WebGL effects |
| **Spline** | 3D scenes with interactions |
| **Rive** | Vector animations |
| **Lottie** | After Effects animations |
| **CSS/GSAP** | Simple animations |
| **Three.js** | Full control |

---

## Integration with Three.js

Use Unicorn for backgrounds, Three.js for main 3D:

```jsx
function Scene() {
  return (
    <>
      {/* Unicorn background */}
      <div className="absolute inset-0 -z-10">
        <Unicorn projectId="bg-effect" />
      </div>
      
      {/* Three.js foreground */}
      <Canvas className="relative z-10">
        <Model />
      </Canvas>
    </>
  )
}
```

---

## Learning Resources

- **Templates:** Built-in library
- **Tutorials:** unicorn.studio/learn
- **Community:** Discord
- **Examples:** unicorn.studio/explore
