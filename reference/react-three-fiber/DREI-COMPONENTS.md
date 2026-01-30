# @react-three/drei - Essential Components

*100+ production-ready helpers that save you hundreds of hours*

---

## Installation

```bash
npm install @react-three/drei
```

---

## Most Used Components

### Controls

#### OrbitControls
```tsx
import { OrbitControls } from '@react-three/drei'

<OrbitControls 
  enableZoom={true}
  enablePan={false}
  maxPolarAngle={Math.PI / 2}
  minDistance={2}
  maxDistance={10}
/>
```

#### ScrollControls
Create scroll-driven experiences:

```tsx
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'

function App() {
  return (
    <Canvas>
      <ScrollControls pages={3} damping={0.1}>
        <Scene />
        <Scroll html>
          <div style={{ height: '300vh' }}>
            <h1>Your HTML content</h1>
          </div>
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}

function Scene() {
  const scroll = useScroll()
  
  useFrame(() => {
    const offset = scroll.offset // 0 to 1
    // Animate based on scroll
  })
}
```

---

### Loading

#### useGLTF
```tsx
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene, nodes, materials, animations } = useGLTF('/model.glb')
  return <primitive object={scene} />
}

// Draco compression support
useGLTF.setDecoderPath('/draco/')
```

#### useTexture
```tsx
import { useTexture } from '@react-three/drei'

function TexturedMesh() {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    '/color.jpg',
    '/normal.jpg', 
    '/roughness.jpg'
  ])
  
  return (
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial 
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
      />
    </mesh>
  )
}
```

#### Loader (with progress)
```tsx
import { Loader } from '@react-three/drei'

function App() {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  )
}
```

---

### Staging & Environment

#### Environment
Add realistic lighting with HDR:

```tsx
import { Environment } from '@react-three/drei'

// Using presets
<Environment preset="sunset" />
<Environment preset="studio" />
<Environment preset="city" />
<Environment preset="warehouse" />

// Custom HDR
<Environment files="/hdr/custom.hdr" />

// As background
<Environment background blur={0.5} />
```

#### Stage
Quick professional lighting:

```tsx
import { Stage } from '@react-three/drei'

<Stage environment="city" intensity={0.5}>
  <Model />
</Stage>
```

#### ContactShadows
Soft ground shadows without ray tracing:

```tsx
import { ContactShadows } from '@react-three/drei'

<ContactShadows 
  position={[0, -0.5, 0]}
  opacity={0.4}
  scale={10}
  blur={2}
  far={4}
/>
```

---

### Text

#### Text (2D in 3D)
```tsx
import { Text } from '@react-three/drei'

<Text
  fontSize={1}
  color="white"
  anchorX="center"
  anchorY="middle"
  font="/fonts/Inter-Bold.woff"
>
  Hello World
</Text>
```

#### Text3D
Extruded 3D text:

```tsx
import { Text3D, Center } from '@react-three/drei'

<Center>
  <Text3D
    font="/fonts/helvetiker_regular.typeface.json"
    size={0.75}
    height={0.2}
    bevelEnabled
    bevelSize={0.02}
  >
    CREATIVE
    <meshNormalMaterial />
  </Text3D>
</Center>
```

---

### Visual Effects

#### Float
Makes things float:

```tsx
import { Float } from '@react-three/drei'

<Float
  speed={2}
  rotationIntensity={1}
  floatIntensity={2}
>
  <Model />
</Float>
```

#### Sparkles
Particle sparkles:

```tsx
import { Sparkles } from '@react-three/drei'

<Sparkles
  count={200}
  scale={5}
  size={2}
  speed={0.4}
  color="gold"
/>
```

#### Stars
Starfield background:

```tsx
import { Stars } from '@react-three/drei'

<Stars 
  radius={100} 
  depth={50} 
  count={5000} 
  factor={4} 
/>
```

#### Trail
Motion trails:

```tsx
import { Trail } from '@react-three/drei'

<Trail
  width={1}
  length={8}
  color="hotpink"
  attenuation={(t) => t * t}
>
  <mesh ref={sphereRef}>
    <sphereGeometry args={[0.1]} />
    <meshBasicMaterial />
  </mesh>
</Trail>
```

---

### Materials

#### MeshReflectorMaterial
Reflective floors:

```tsx
import { MeshReflectorMaterial } from '@react-three/drei'

<mesh rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[10, 10]} />
  <MeshReflectorMaterial
    blur={[300, 100]}
    resolution={2048}
    mixBlur={1}
    mixStrength={50}
    roughness={1}
    depthScale={1.2}
    color="#151515"
    metalness={0.5}
  />
</mesh>
```

#### MeshTransmissionMaterial
Glass/crystal effects:

```tsx
import { MeshTransmissionMaterial } from '@react-three/drei'

<mesh>
  <sphereGeometry />
  <MeshTransmissionMaterial
    backside
    samples={16}
    thickness={0.2}
    chromaticAberration={0.05}
    anisotropy={0.1}
    distortion={0.1}
    distortionScale={0.2}
    temporalDistortion={0.1}
  />
</mesh>
```

#### MeshDistortMaterial
Wobbly distortion:

```tsx
import { MeshDistortMaterial } from '@react-three/drei'

<mesh>
  <sphereGeometry args={[1, 64, 64]} />
  <MeshDistortMaterial
    color="#8B5CF6"
    attach="material"
    distort={0.4}
    speed={2}
  />
</mesh>
```

---

### Abstractions

#### Image
Display images in 3D space:

```tsx
import { Image } from '@react-three/drei'

<Image url="/photo.jpg" scale={[4, 3]} />

// With effects
<Image 
  url="/photo.jpg"
  transparent
  opacity={0.8}
  grayscale={0.5}
  zoom={1.2}
/>
```

#### Billboard
Always face camera:

```tsx
import { Billboard, Text } from '@react-three/drei'

<Billboard follow={true}>
  <Text>Always facing you</Text>
</Billboard>
```

#### Html
Embed HTML in 3D:

```tsx
import { Html } from '@react-three/drei'

<mesh>
  <boxGeometry />
  <meshStandardMaterial />
  <Html
    position={[0, 1, 0]}
    center
    distanceFactor={10}
    occlude
  >
    <div className="tooltip">Hover info</div>
  </Html>
</mesh>
```

---

### Performance

#### Instances
Render thousands of objects efficiently:

```tsx
import { Instances, Instance } from '@react-three/drei'

<Instances limit={1000} range={1000}>
  <boxGeometry />
  <meshStandardMaterial />
  {data.map((item, i) => (
    <Instance
      key={i}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      color={item.color}
    />
  ))}
</Instances>
```

#### Preload
Preload all assets:

```tsx
import { Preload } from '@react-three/drei'

<Canvas>
  <Suspense fallback={null}>
    <Scene />
  </Suspense>
  <Preload all />
</Canvas>
```

#### useDetectGPU
Adaptive quality:

```tsx
import { useDetectGPU } from '@react-three/drei'

function AdaptiveScene() {
  const GPUTier = useDetectGPU()
  
  return (
    <mesh>
      <sphereGeometry args={[1, GPUTier.tier > 2 ? 64 : 32, 32]} />
    </mesh>
  )
}
```

---

### Cameras

#### PerspectiveCamera
Make it default camera:

```tsx
import { PerspectiveCamera } from '@react-three/drei'

<PerspectiveCamera 
  makeDefault 
  position={[0, 2, 5]} 
  fov={50}
/>
```

#### CameraShake
Add realistic camera shake:

```tsx
import { CameraShake } from '@react-three/drei'

<CameraShake
  maxYaw={0.05}
  maxPitch={0.05}
  maxRoll={0.05}
  yawFrequency={0.5}
  pitchFrequency={0.5}
  rollFrequency={0.4}
/>
```

---

## Full Component Categories

| Category | Components |
|----------|------------|
| **Cameras** | PerspectiveCamera, OrthographicCamera, CubeCamera |
| **Controls** | OrbitControls, ScrollControls, PresentationControls, KeyboardControls |
| **Gizmos** | PivotControls, TransformControls, Grid, GizmoHelper |
| **Abstractions** | Image, Text, Text3D, Billboard, Html, Effects |
| **Shaders** | MeshReflectorMaterial, MeshDistortMaterial, MeshTransmissionMaterial |
| **Staging** | Stage, Environment, Sky, Stars, Cloud, Sparkles, ContactShadows |
| **Performance** | Instances, Merged, Points, Detailed, Preload, BakeShadows |
| **Loaders** | useGLTF, useFBX, useTexture, useFont |
| **Misc** | Stats, useHelper, useAnimations, useCursor |

---

## Documentation

Full docs: https://pmndrs.github.io/drei/
