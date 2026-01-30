# React Three Fiber Patterns & Recipes

*Copy-paste solutions for common creative web dev needs*

---

## Scene Structure

### Basic Setup

```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'

export default function Scene() {
  return (
    <div className="h-screen w-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={null}>
          <Content />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
```

---

## Mouse & Pointer Effects

### Mouse Tracking

```jsx
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

function MouseFollower() {
  const ref = useRef()
  const { pointer, viewport } = useThree()
  
  useFrame(() => {
    ref.current.position.x = (pointer.x * viewport.width) / 2
    ref.current.position.y = (pointer.y * viewport.height) / 2
  })
  
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
```

### Mouse Parallax

```jsx
function ParallaxMesh({ children, factor = 0.1 }) {
  const ref = useRef()
  const { pointer } = useThree()
  
  useFrame(() => {
    ref.current.rotation.x = pointer.y * factor
    ref.current.rotation.y = pointer.x * factor
  })
  
  return <group ref={ref}>{children}</group>
}
```

### Raycaster Hover Effect

```jsx
function HoverableBox() {
  const [hovered, setHovered] = useState(false)
  
  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? '#ff6b6b' : '#4ecdc4'} />
    </mesh>
  )
}
```

---

## Scroll Animations

### Basic Scroll-linked

```jsx
import { ScrollControls, useScroll } from '@react-three/drei'

function App() {
  return (
    <Canvas>
      <ScrollControls pages={3} damping={0.1}>
        <Scene />
      </ScrollControls>
    </Canvas>
  )
}

function Scene() {
  const scroll = useScroll()
  const ref = useRef()
  
  useFrame(() => {
    // scroll.offset is 0 to 1
    ref.current.rotation.y = scroll.offset * Math.PI * 2
    ref.current.position.y = scroll.offset * -5
  })
  
  return <mesh ref={ref}>...</mesh>
}
```

### Scroll + HTML Overlay

```jsx
import { ScrollControls, Scroll } from '@react-three/drei'

function App() {
  return (
    <Canvas>
      <ScrollControls pages={5}>
        {/* 3D Content */}
        <Scene />
        
        {/* HTML Overlay */}
        <Scroll html>
          <section style={{ height: '100vh' }}>
            <h1>Section 1</h1>
          </section>
          <section style={{ height: '100vh' }}>
            <h1>Section 2</h1>
          </section>
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}
```

---

## Model Loading

### GLTF with Loading State

```jsx
import { useGLTF, Loader } from '@react-three/drei'
import { Suspense } from 'react'

function Model() {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} />
}

function App() {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  )
}

// Preload
useGLTF.preload('/model.glb')
```

### Animated Model

```jsx
import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect } from 'react'

function AnimatedModel() {
  const { scene, animations } = useGLTF('/animated.glb')
  const { actions } = useAnimations(animations, scene)
  
  useEffect(() => {
    actions['Walk']?.play()
    // or actions[Object.keys(actions)[0]]?.play()
  }, [actions])
  
  return <primitive object={scene} />
}
```

---

## Custom Shaders

### Basic Custom Material

```jsx
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'

const GradientMaterial = shaderMaterial(
  { uTime: 0, uColor1: new THREE.Color('#ff0000'), uColor2: new THREE.Color('#0000ff') },
  // Vertex
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    
    void main() {
      float mixer = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
      vec3 color = mix(uColor1, uColor2, mixer);
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ GradientMaterial })

function ShaderMesh() {
  const ref = useRef()
  
  useFrame((state) => {
    ref.current.uTime = state.clock.elapsedTime
  })
  
  return (
    <mesh>
      <planeGeometry args={[2, 2, 32, 32]} />
      <gradientMaterial ref={ref} />
    </mesh>
  )
}
```

---

## Post-Processing

### Basic Effects

```jsx
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'

function Effects() {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        intensity={0.5}
      />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  )
}
```

### Selective Bloom

```jsx
import { Selection, Select, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'

function Scene() {
  return (
    <Selection>
      <EffectComposer>
        <SelectiveBloom luminanceThreshold={0} intensity={0.5} />
      </EffectComposer>
      
      {/* This will bloom */}
      <Select enabled>
        <mesh><meshBasicMaterial color="hotpink" /></mesh>
      </Select>
      
      {/* This won't */}
      <mesh><meshStandardMaterial /></mesh>
    </Selection>
  )
}
```

---

## Environment & Lighting

### Quick Professional Lighting

```jsx
import { Stage } from '@react-three/drei'

<Stage environment="city" intensity={0.5}>
  <Model />
</Stage>
```

### Custom Environment

```jsx
import { Environment, Lightformer } from '@react-three/drei'

<Environment resolution={256}>
  <Lightformer 
    form="ring" 
    intensity={2} 
    position={[0, 5, -5]} 
    scale={20}
    color="white"
  />
</Environment>
```

### Contact Shadows

```jsx
import { ContactShadows } from '@react-three/drei'

<ContactShadows 
  position={[0, -0.5, 0]}
  opacity={0.5}
  scale={10}
  blur={1.5}
  far={1}
  color="#000000"
/>
```

---

## Performance Patterns

### Instanced Rendering

```jsx
import { Instances, Instance } from '@react-three/drei'

function Particles({ count = 1000 }) {
  const positions = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      scale: Math.random() * 0.5 + 0.1
    }))
  }, [count])
  
  return (
    <Instances limit={count}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
      {positions.map((props, i) => (
        <Instance key={i} position={props.position} scale={props.scale} />
      ))}
    </Instances>
  )
}
```

### Adaptive Performance

```jsx
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'

<Canvas>
  <PerformanceMonitor
    onDecline={() => setQuality('low')}
    onIncline={() => setQuality('high')}
  >
    <AdaptiveDpr pixelated />
    <AdaptiveEvents />
    <Scene quality={quality} />
  </PerformanceMonitor>
</Canvas>
```

---

## Common UI Patterns

### 3D Text

```jsx
import { Text3D, Center } from '@react-three/drei'

<Center>
  <Text3D
    font="/fonts/Inter_Bold.json"
    size={1}
    height={0.2}
    bevelEnabled
    bevelSize={0.02}
    bevelThickness={0.01}
  >
    CREATIVE
    <meshNormalMaterial />
  </Text3D>
</Center>
```

### HTML in 3D Space

```jsx
import { Html } from '@react-three/drei'

<mesh>
  <boxGeometry />
  <meshStandardMaterial />
  <Html
    position={[0, 1, 0]}
    center
    distanceFactor={8}
    occlude
  >
    <div className="tooltip">
      Click me
    </div>
  </Html>
</mesh>
```

### Floating Animation

```jsx
import { Float } from '@react-three/drei'

<Float
  speed={2}
  rotationIntensity={0.5}
  floatIntensity={1}
  floatingRange={[-0.1, 0.1]}
>
  <Model />
</Float>
```

---

## Quick Reference

```jsx
// Mouse position in 3D
const { pointer, viewport } = useThree()
const x = pointer.x * viewport.width / 2
const y = pointer.y * viewport.height / 2

// Animation loop
useFrame((state, delta) => {
  mesh.rotation.y += delta
})

// Scroll progress
const scroll = useScroll()
scroll.offset // 0 to 1

// Load model
const { scene } = useGLTF('/model.glb')

// Responsive
const { viewport } = useThree()
const isMobile = viewport.width < 5
```
