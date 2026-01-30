# React Three Fiber - Getting Started

*The React renderer for Three.js that makes 3D feel native*

---

## What is React Three Fiber?

React Three Fiber (R3F) is a React renderer for Three.js. It lets you build 3D scenes declaratively using React components, with full access to Three.js's power underneath.

### Why R3F over vanilla Three.js?

| Vanilla Three.js | React Three Fiber |
|------------------|-------------------|
| Imperative code | Declarative JSX |
| Manual cleanup | Automatic disposal |
| Class-based | Hooks-based |
| Separate from UI | Unified with React app |

---

## Installation

```bash
npm install three @types/three @react-three/fiber
```

### Version Compatibility
- `@react-three/fiber@8` → `react@18`
- `@react-three/fiber@9` → `react@19`

---

## Your First Scene

```tsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
  )
}
```

### What's happening:
- `<Canvas>` creates a WebGL context and render loop
- `<mesh>` is like `new THREE.Mesh()`
- `<boxGeometry>` and `<meshStandardMaterial>` are attached automatically
- JSX props map directly to Three.js properties

---

## Core Concepts

### 1. The Canvas

```tsx
<Canvas
  camera={{ position: [0, 0, 5], fov: 75 }}
  dpr={[1, 2]} // Pixel ratio
  shadows // Enable shadows
  gl={{ antialias: true }}
>
  {/* Your scene */}
</Canvas>
```

### 2. The Render Loop (useFrame)

```tsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function SpinningBox() {
  const meshRef = useRef()
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
```

**Important:** `useFrame` runs 60 times per second. Keep it fast!

### 3. Accessing Three.js Objects

```tsx
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

function CameraController() {
  const { camera, gl } = useThree()
  
  useEffect(() => {
    // Direct Three.js access
    camera.position.set(0, 5, 10)
  }, [camera])
  
  return null
}
```

---

## Events & Interactivity

R3F uses raycasting for pointer events—just like DOM events but in 3D:

```tsx
function InteractiveBox() {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  
  return (
    <mesh
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
```

### Available Events
- `onClick`, `onDoubleClick`
- `onPointerOver`, `onPointerOut`
- `onPointerDown`, `onPointerUp`
- `onPointerMove`
- `onWheel`

---

## Loading 3D Models

```tsx
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} />
}

// Preload for better UX
useGLTF.preload('/model.glb')
```

### Convert GLTF to JSX (gltfjsx)

```bash
npx gltfjsx model.glb
```

This generates a React component with full control over each mesh:

```tsx
export function Model(props) {
  const { nodes, materials } = useGLTF('/model.glb')
  return (
    <group {...props}>
      <mesh 
        geometry={nodes.Body.geometry} 
        material={materials.Metal}
      />
    </group>
  )
}
```

---

## Essential Hooks

### useThree
Access the entire R3F state:

```tsx
const { 
  camera,      // Current camera
  gl,          // WebGL renderer
  scene,       // Three.js scene
  size,        // Canvas dimensions
  viewport,    // Viewport in 3D units
  clock,       // Three.js clock
  pointer,     // Normalized mouse position
} = useThree()
```

### useLoader
Load assets with suspense support:

```tsx
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

function TexturedBox() {
  const texture = useLoader(TextureLoader, '/texture.jpg')
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
```

---

## Performance Tips

### 1. Avoid Re-renders
```tsx
// ❌ Bad - creates new object every render
<mesh position={[x, y, z]} />

// ✅ Good - reuse vector
const position = useMemo(() => new THREE.Vector3(x, y, z), [x, y, z])
<mesh position={position} />
```

### 2. Use Instances for Many Objects
```tsx
import { Instances, Instance } from '@react-three/drei'

function ManyBoxes() {
  return (
    <Instances limit={1000}>
      <boxGeometry />
      <meshStandardMaterial />
      {positions.map((pos, i) => (
        <Instance key={i} position={pos} />
      ))}
    </Instances>
  )
}
```

### 3. Conditional Rendering
```tsx
// Scene only renders when visible
<Canvas frameloop="demand">
```

---

## Project Structure

```
src/
├── components/
│   ├── canvas/          # 3D components
│   │   ├── Scene.tsx
│   │   ├── Model.tsx
│   │   └── Effects.tsx
│   └── ui/              # 2D React components
├── hooks/
│   └── useMousePosition.ts
├── shaders/
│   ├── vertex.glsl
│   └── fragment.glsl
└── App.tsx
```

---

## Next Steps

1. Install drei: `npm install @react-three/drei`
2. Read `DREI-COMPONENTS.md` for the helper library
3. Build something! Start with a rotating logo or product showcase

---

## Quick Reference

```tsx
// Basic scene template
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      
      <YourComponent />
      
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  )
}
```
