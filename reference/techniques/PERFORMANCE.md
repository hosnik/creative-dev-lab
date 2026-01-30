# WebGL & Three.js Performance Optimization

*60fps is non-negotiable. Here's how to get there.*

---

## The Performance Mindset

1. **Measure first** - Don't optimize blindly
2. **GPU > CPU** - Move work to shaders when possible
3. **Less is more** - Every draw call has a cost
4. **Perceived performance** - Loading states matter

---

## Measuring Performance

### Browser DevTools

1. **Performance tab** - Record and analyze frame timing
2. **Memory tab** - Track GPU memory usage
3. **Layers panel** - See GPU layers

### Three.js Stats

```jsx
import { Stats } from '@react-three/drei'

<Canvas>
  <Stats />
  {/* Your scene */}
</Canvas>
```

Shows: FPS, MS per frame, MB memory

### Detailed Stats

```jsx
import { StatsGl } from '@react-three/drei'

<Canvas>
  <StatsGl />
</Canvas>
```

Shows: Draw calls, triangles, textures, shaders

### useDetectGPU

```jsx
import { useDetectGPU } from '@react-three/drei'

function AdaptiveScene() {
  const gpu = useDetectGPU()
  
  // gpu.tier: 0-3 (0 = low, 3 = high)
  // gpu.isMobile
  // gpu.device
  
  return (
    <mesh>
      <sphereGeometry args={[1, gpu.tier > 1 ? 64 : 32, 32]} />
    </mesh>
  )
}
```

---

## Geometry Optimization

### 1. Reduce Polygon Count

```jsx
// ❌ Too many segments
<sphereGeometry args={[1, 256, 256]} /> // 131k triangles

// ✅ Optimized
<sphereGeometry args={[1, 32, 32]} /> // 1.8k triangles
```

### 2. Use Instances for Repeated Objects

```jsx
import { Instances, Instance } from '@react-three/drei'

// Render 1000 cubes with ONE draw call
<Instances limit={1000}>
  <boxGeometry />
  <meshStandardMaterial />
  {positions.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>
```

### 3. Merge Static Geometries

```jsx
import { Merged } from '@react-three/drei'

const meshes = [mesh1, mesh2, mesh3]

<Merged meshes={meshes}>
  {(Mesh1, Mesh2, Mesh3) => (
    <>
      <Mesh1 position={[0, 0, 0]} />
      <Mesh2 position={[1, 0, 0]} />
      <Mesh3 position={[2, 0, 0]} />
    </>
  )}
</Merged>
```

### 4. Level of Detail (LOD)

```jsx
import { Detailed } from '@react-three/drei'

<Detailed distances={[0, 15, 30, 60]}>
  <HighDetailModel />   {/* 0-15 units */}
  <MediumDetailModel /> {/* 15-30 units */}
  <LowDetailModel />    {/* 30-60 units */}
  <null />              {/* >60 units (hidden) */}
</Detailed>
```

---

## Material Optimization

### 1. Use Cheaper Materials When Possible

```jsx
// Cost hierarchy (cheapest to most expensive)
MeshBasicMaterial      // No lighting
MeshLambertMaterial    // Simple diffuse
MeshPhongMaterial      // Specular highlights
MeshStandardMaterial   // PBR (default)
MeshPhysicalMaterial   // Advanced PBR (expensive!)
```

### 2. Share Materials

```jsx
// ❌ Bad - creates new material per mesh
{items.map(item => (
  <mesh key={item.id}>
    <meshStandardMaterial color={item.color} />
  </mesh>
))}

// ✅ Good - reuse materials
const materials = useMemo(() => ({
  red: new THREE.MeshStandardMaterial({ color: 'red' }),
  blue: new THREE.MeshStandardMaterial({ color: 'blue' }),
}), [])

{items.map(item => (
  <mesh key={item.id} material={materials[item.color]} />
))}
```

### 3. Disable Unused Features

```jsx
<meshStandardMaterial
  metalness={0}           // If not metallic
  roughness={1}           // If fully rough
  envMapIntensity={0}     // If no reflections
  flatShading={true}      // Skip normal interpolation
/>
```

---

## Texture Optimization

### 1. Compress Textures

Use **KTX2** format with Basis Universal compression:

```jsx
import { useKTX2 } from '@react-three/drei'

function Model() {
  const texture = useKTX2('/texture.ktx2')
  return <meshStandardMaterial map={texture} />
}
```

Convert with: `npx @gltf-transform/cli optimize input.glb output.glb`

### 2. Size Textures Appropriately

| Use Case | Max Size |
|----------|----------|
| Environment maps | 2048px |
| Main textures | 1024px |
| Detail textures | 512px |
| Mobile | 512px max |

Power of 2 dimensions required: 256, 512, 1024, 2048

### 3. Mipmapping

```jsx
<meshStandardMaterial
  map={texture}
  map-minFilter={THREE.LinearMipmapLinearFilter}
  map-generateMipmaps={true}
/>
```

---

## Lighting Optimization

### 1. Bake Lighting

Pre-calculate lighting in Blender, export as textures.

```jsx
const { scene } = useGLTF('/baked-model.glb')
// Lightmap already applied to materials
```

### 2. Limit Real-time Lights

```jsx
// Max recommended: 4 lights
<ambientLight intensity={0.2} />
<directionalLight intensity={1} castShadow />
```

### 3. Cheaper Shadows

```jsx
// Use ContactShadows instead of real shadows
import { ContactShadows } from '@react-three/drei'

<ContactShadows 
  position={[0, -0.5, 0]}
  opacity={0.4}
  scale={10}
  blur={2}
/>

// Or bake shadows
import { BakeShadows } from '@react-three/drei'
<BakeShadows />
```

---

## Render Optimization

### 1. Pixel Ratio

```jsx
<Canvas
  dpr={[1, 2]} // Min 1, max 2 based on device
  // Or fixed for consistency
  dpr={1.5}
/>
```

### 2. Demand-based Rendering

```jsx
// Only render when something changes
<Canvas frameloop="demand">
  <Scene />
</Canvas>

// Trigger render manually
const invalidate = useThree(state => state.invalidate)
invalidate() // Call when you need a re-render
```

### 3. Adaptive Performance

```jsx
import { PerformanceMonitor } from '@react-three/drei'

<PerformanceMonitor
  onDecline={() => setDpr(1)}
  onIncline={() => setDpr(2)}
>
  <Scene />
</PerformanceMonitor>
```

### 4. Frustum Culling

Enabled by default—objects outside camera view aren't rendered.

```jsx
// Disable for objects that shouldn't be culled
<mesh frustumCulled={false}>
```

---

## Code Optimization

### 1. Avoid Re-renders

```jsx
// ❌ Bad - creates new vector every render
<mesh position={[x, y, z]} />

// ✅ Good - memoize
const position = useMemo(() => new THREE.Vector3(x, y, z), [x, y, z])
<mesh position={position} />
```

### 2. Optimize useFrame

```jsx
// ❌ Bad - heavy computation every frame
useFrame(() => {
  const result = expensiveCalculation()
  mesh.position.x = result
})

// ✅ Good - throttle or cache
useFrame((state, delta) => {
  // Skip frames
  if (state.clock.elapsedTime % 0.1 < delta) {
    mesh.position.x = expensiveCalculation()
  }
})
```

### 3. Dispose Properly

```jsx
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])
```

---

## Loading Optimization

### 1. Preload Assets

```jsx
import { useGLTF, useTexture } from '@react-three/drei'

// At module level
useGLTF.preload('/model.glb')
useTexture.preload(['/texture1.jpg', '/texture2.jpg'])
```

### 2. Lazy Load with Suspense

```jsx
function Scene() {
  return (
    <Suspense fallback={<LoadingPlaceholder />}>
      <HeavyModel />
    </Suspense>
  )
}
```

### 3. Draco Compression

Reduce GLTF file sizes by 80-90%:

```jsx
import { useGLTF } from '@react-three/drei'

useGLTF.setDecoderPath('/draco/')

function Model() {
  const { scene } = useGLTF('/compressed.glb')
  return <primitive object={scene} />
}
```

---

## Mobile Optimization Checklist

- [ ] Lower pixel ratio (dpr={1})
- [ ] Reduce geometry complexity
- [ ] Use compressed textures (512px max)
- [ ] Fewer lights (2 max)
- [ ] No real-time shadows
- [ ] Simpler materials
- [ ] Lower post-processing quality
- [ ] Demand-based rendering

---

## Quick Wins

1. **Use Instances** for repeated geometry
2. **Compress textures** with KTX2
3. **Bake lighting** when possible
4. **Lower dpr** on mobile
5. **Merge static** meshes
6. **Share materials** between meshes
7. **Use ContactShadows** over real shadows
8. **Preload** critical assets
