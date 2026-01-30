# GLSL Shader Fundamentals

*The secret weapon of every top creative developer*

---

## Why Learn Shaders?

Shaders let you:
- Create effects impossible with standard materials
- Control every pixel on screen
- Build unique visual identities
- Optimize performance (GPU > CPU for graphics)

**Top 1% creative developers write custom shaders. Period.**

---

## What is a Shader?

A shader is a program that runs on the GPU. There are two main types:

### Vertex Shader
- Runs once per vertex
- Controls position of geometry points
- Output: `gl_Position`

### Fragment Shader (Pixel Shader)
- Runs once per pixel
- Controls the color of each pixel
- Output: `gl_FragColor` (or `fragColor` in modern GLSL)

---

## GLSL Basics

### Data Types

```glsl
// Scalars
float f = 1.0;
int i = 1;
bool b = true;

// Vectors
vec2 v2 = vec2(1.0, 2.0);
vec3 v3 = vec3(1.0, 2.0, 3.0);
vec4 v4 = vec4(1.0, 2.0, 3.0, 1.0); // Often used for colors (RGBA)

// Matrices
mat2 m2 = mat2(1.0);
mat3 m3 = mat3(1.0);
mat4 m4 = mat4(1.0);
```

### Vector Swizzling

```glsl
vec4 color = vec4(1.0, 0.5, 0.25, 1.0);

vec3 rgb = color.rgb;   // (1.0, 0.5, 0.25)
vec2 xy = color.xy;     // (1.0, 0.5)
float r = color.r;      // 1.0

// Rearrange
vec3 bgr = color.bgr;   // (0.25, 0.5, 1.0)
vec4 rrgg = color.rrgg; // (1.0, 1.0, 0.5, 0.5)
```

### Built-in Functions

```glsl
// Math
sin(x), cos(x), tan(x)
pow(x, y)      // x^y
sqrt(x)
abs(x)
floor(x), ceil(x), fract(x)
mod(x, y)      // x % y
min(a, b), max(a, b)
clamp(x, min, max)

// Interpolation
mix(a, b, t)   // Linear interpolation: a*(1-t) + b*t
smoothstep(edge0, edge1, x)  // Smooth 0-1 transition
step(edge, x)  // Returns 0 if x < edge, else 1

// Vector operations
length(v)
distance(a, b)
normalize(v)
dot(a, b)
cross(a, b)    // 3D only
reflect(I, N)
```

---

## Shader Communication

### Uniforms
Values passed from JavaScript to shader (same for all vertices/fragments):

```glsl
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform sampler2D uTexture;
```

### Attributes (Vertex Shader only)
Per-vertex data:

```glsl
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
```

### Varyings
Pass data from vertex to fragment shader:

```glsl
// Vertex shader
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment shader
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
```

---

## Your First Shader

### Basic Color Gradient

```glsl
// Fragment shader
uniform vec2 uResolution;

void main() {
  // Normalize coordinates (0.0 to 1.0)
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // Red gradient from left to right
  gl_FragColor = vec4(uv.x, 0.0, 0.0, 1.0);
}
```

### Animated Wave

```glsl
uniform float uTime;
uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // Create wave
  float wave = sin(uv.x * 10.0 + uTime) * 0.5 + 0.5;
  
  // Apply to color
  vec3 color = vec3(wave, uv.y, 1.0 - uv.x);
  
  gl_FragColor = vec4(color, 1.0);
}
```

---

## Using Shaders in Three.js

### Raw ShaderMaterial

```javascript
import * as THREE from 'three'

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ff0000') }
  },
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    
    void main() {
      vec3 color = uColor;
      color.r += sin(vUv.x * 10.0 + uTime) * 0.5;
      gl_FragColor = vec4(color, 1.0);
    }
  `
})

// Update in render loop
material.uniforms.uTime.value = clock.getElapsedTime()
```

### With React Three Fiber

```tsx
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'

// Create custom material
const WaveMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color('#ff0000') },
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
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      vec3 color = uColor;
      color.r += sin(vUv.x * 10.0 + uTime) * 0.5;
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ WaveMaterial })

function WaveMesh() {
  const ref = useRef()
  
  useFrame((state) => {
    ref.current.uTime = state.clock.elapsedTime
  })
  
  return (
    <mesh>
      <planeGeometry args={[2, 2, 32, 32]} />
      <waveMaterial ref={ref} />
    </mesh>
  )
}
```

---

## Common Patterns

### Circles

```glsl
float circle(vec2 uv, vec2 center, float radius) {
  return 1.0 - smoothstep(radius - 0.01, radius + 0.01, length(uv - center));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float c = circle(uv, vec2(0.5), 0.3);
  gl_FragColor = vec4(vec3(c), 1.0);
}
```

### Stripes

```glsl
float stripes(vec2 uv, float frequency) {
  return step(0.5, fract(uv.x * frequency));
}
```

### Polar Coordinates

```glsl
vec2 toPolar(vec2 uv) {
  vec2 centered = uv - 0.5;
  float radius = length(centered);
  float angle = atan(centered.y, centered.x);
  return vec2(radius, angle);
}
```

### Color Mixing

```glsl
vec3 colorA = vec3(1.0, 0.0, 0.0);
vec3 colorB = vec3(0.0, 0.0, 1.0);
vec3 mixed = mix(colorA, colorB, uv.x);
```

---

## Distortion Effects

### Vertex Displacement

```glsl
// Vertex shader
uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  
  // Sine wave displacement
  pos.z += sin(pos.x * 5.0 + uTime) * 0.1;
  pos.z += sin(pos.y * 3.0 + uTime * 0.5) * 0.1;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### UV Distortion

```glsl
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Wavy distortion
  uv.x += sin(uv.y * 10.0 + uTime) * 0.05;
  uv.y += cos(uv.x * 10.0 + uTime) * 0.05;
  
  vec3 color = vec3(uv, 0.5);
  gl_FragColor = vec4(color, 1.0);
}
```

---

## Resources

### Learning
- [The Book of Shaders](https://thebookofshaders.com) - THE resource
- [Shadertoy](https://shadertoy.com) - Examples & community
- [Three.js Journey](https://threejs-journey.com) - Shader chapters

### Tools
- [Shader Toy](https://shadertoy.com) - Live shader playground
- [glslCanvas](https://github.com/patriciogonzalezvivo/glslCanvas) - Local testing
- VS Code extension: `Shader languages support`

---

## Next Steps

Read `NOISE-FUNCTIONS.md` to learn about procedural textures and organic effects.
