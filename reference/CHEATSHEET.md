# Creative Web Dev Cheatsheet 🚀

*Quick reference for when you're in the zone*

---

## NPM Installs

```bash
# Core
npm install three @types/three @react-three/fiber @react-three/drei

# Animation
npm install gsap motion lenis

# Post-processing
npm install @react-three/postprocessing

# Physics
npm install @react-three/rapier
```

---

## Canvas Template

```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

<Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
  <ambientLight intensity={0.5} />
  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
  
  <Suspense fallback={null}>
    <YourComponent />
    <Environment preset="city" />
  </Suspense>
  
  <OrbitControls />
</Canvas>
```

---

## Essential Hooks

```jsx
// Animation loop
useFrame((state, delta) => { mesh.rotation.y += delta })

// Access Three.js context
const { camera, gl, scene, viewport, pointer } = useThree()

// Scroll progress (with ScrollControls)
const scroll = useScroll()
scroll.offset // 0 to 1

// Load assets
const { scene } = useGLTF('/model.glb')
const texture = useTexture('/texture.jpg')
```

---

## Common Effects

### Mouse Parallax
```jsx
useFrame(() => {
  mesh.rotation.x = pointer.y * 0.1
  mesh.rotation.y = pointer.x * 0.1
})
```

### Float
```jsx
<Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
  <Model />
</Float>
```

### Scroll Animation
```jsx
useFrame(() => {
  mesh.position.y = scroll.offset * -10
  mesh.rotation.y = scroll.offset * Math.PI * 2
})
```

---

## Shader Quick Start

```jsx
const MyMaterial = shaderMaterial(
  { uTime: 0 },
  // Vertex
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  // Fragment
  `uniform float uTime;
   varying vec2 vUv;
   void main() {
     gl_FragColor = vec4(vUv, sin(uTime), 1.0);
   }`
)
extend({ MyMaterial })
```

---

## GSAP Scroll

```jsx
gsap.to('.element', {
  x: 500,
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
  }
})
```

---

## Motion (Framer) Basics

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  whileHover={{ scale: 1.05 }}
  transition={{ type: 'spring', stiffness: 300 }}
/>
```

---

## Smooth Scroll (Lenis)

```js
import Lenis from 'lenis'
const lenis = new Lenis()
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
```

---

## Performance Checklist

- [ ] Use Instances for repeated meshes
- [ ] Compress textures (KTX2)
- [ ] Limit lights to 2-4
- [ ] Use ContactShadows over real shadows
- [ ] Set dpr={[1, 2]} on Canvas
- [ ] Preload models with useGLTF.preload()
- [ ] Dispose materials/geometries on unmount

---

## Drei MVP Components

| Component | Use For |
|-----------|---------|
| `<OrbitControls>` | Camera control |
| `<Environment>` | Realistic lighting |
| `<Float>` | Floating animation |
| `<Text3D>` | 3D text |
| `<Html>` | HTML in 3D |
| `<useGLTF>` | Load models |
| `<ScrollControls>` | Scroll experience |
| `<ContactShadows>` | Soft shadows |
| `<MeshTransmissionMaterial>` | Glass/crystal |
| `<Instances>` | Performance |

---

## Easing Curves

```js
// GSAP
'power2.out'    // Smooth deceleration
'power3.inOut'  // Smooth start & end
'elastic.out'   // Bouncy
'back.out(1.7)' // Overshoot

// Motion
{ type: 'spring', stiffness: 300, damping: 20 }
```

---

## Quick Links

- **Three.js:** https://threejs.org
- **R3F Docs:** https://r3f.docs.pmnd.rs
- **Drei Docs:** https://pmndrs.github.io/drei
- **GSAP:** https://gsap.com/docs
- **Motion:** https://motion.dev
- **Book of Shaders:** https://thebookofshaders.com
- **Three.js Journey:** https://threejs-journey.com
- **Awwwards:** https://awwwards.com
