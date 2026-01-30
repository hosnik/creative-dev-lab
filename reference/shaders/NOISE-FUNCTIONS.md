# Noise Functions for Shaders

*The secret to organic, natural-looking effects*

---

## Why Noise?

Random values look chaotic. Noise functions create **coherent randomness**—patterns that feel natural and organic, like clouds, terrain, fire, and water.

---

## Types of Noise

### 1. Value Noise
- Interpolates between random values at grid points
- Smooth but can look "blocky"
- Fastest

### 2. Perlin Noise
- Interpolates gradients instead of values
- Smoother, more natural
- Industry standard since 1983

### 3. Simplex Noise
- Ken Perlin's improved algorithm (2001)
- Faster in higher dimensions
- Less directional artifacts
- **Recommended for most uses**

### 4. Worley/Cellular Noise
- Based on distance to random points
- Creates cell-like patterns
- Great for: caustics, stones, biological patterns

---

## Perlin/Simplex Noise Implementation

```glsl
// 2D Simplex Noise by Ian McEwan
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
```

### Usage

```glsl
uniform float uTime;
varying vec2 vUv;

void main() {
    // Basic noise
    float n = snoise(vUv * 5.0);
    
    // Animated noise
    float animated = snoise(vUv * 5.0 + uTime * 0.5);
    
    // Remap from [-1, 1] to [0, 1]
    float remapped = n * 0.5 + 0.5;
    
    gl_FragColor = vec4(vec3(remapped), 1.0);
}
```

---

## Fractal Brownian Motion (FBM)

Layer multiple noise octaves for richer detail:

```glsl
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // Add 6 octaves
    for (int i = 0; i < 6; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;      // Double frequency each octave
        amplitude *= 0.5;      // Halve amplitude each octave
    }
    
    return value;
}
```

### FBM Variations

```glsl
// Turbulence (absolute value creates sharper edges)
float turbulence(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 6; i++) {
        value += amplitude * abs(snoise(p * frequency));
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

// Ridge noise (inverted turbulence)
float ridge(vec2 p) {
    return 1.0 - abs(snoise(p));
}
```

---

## Worley (Cellular) Noise

```glsl
vec2 random2(vec2 p) {
    return fract(sin(vec2(
        dot(p, vec2(127.1, 311.7)),
        dot(p, vec2(269.5, 183.3))
    )) * 43758.5453);
}

float worley(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float minDist = 1.0;
    
    // Check 3x3 neighborhood
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i + neighbor);
            
            // Animate points
            // point = 0.5 + 0.5 * sin(uTime + 6.2831 * point);
            
            vec2 diff = neighbor + point - f;
            float dist = length(diff);
            minDist = min(minDist, dist);
        }
    }
    
    return minDist;
}
```

---

## Practical Effects

### Clouds

```glsl
void main() {
    vec2 uv = vUv;
    
    // Moving clouds
    uv.x += uTime * 0.1;
    
    float clouds = fbm(uv * 3.0);
    clouds = smoothstep(0.0, 1.0, clouds);
    
    vec3 skyBlue = vec3(0.4, 0.6, 0.9);
    vec3 white = vec3(1.0);
    
    vec3 color = mix(skyBlue, white, clouds);
    gl_FragColor = vec4(color, 1.0);
}
```

### Fire

```glsl
void main() {
    vec2 uv = vUv;
    
    // Move upward
    uv.y -= uTime * 2.0;
    
    // Distort horizontally
    uv.x += snoise(vec2(uv.y * 4.0, uTime)) * 0.1;
    
    float fire = fbm(uv * 4.0);
    fire = pow(fire * 0.5 + 0.5, 2.0);
    
    // Fade at top
    fire *= 1.0 - vUv.y;
    
    // Fire colors
    vec3 color = mix(
        vec3(1.0, 0.0, 0.0),    // Red
        vec3(1.0, 0.8, 0.0),    // Yellow
        fire
    );
    
    gl_FragColor = vec4(color * fire * 2.0, fire);
}
```

### Water Caustics

```glsl
void main() {
    vec2 uv = vUv * 5.0;
    
    float caustics = 0.0;
    
    // Layer multiple worley passes
    caustics += worley(uv + uTime * 0.2);
    caustics += worley(uv * 2.0 - uTime * 0.3) * 0.5;
    caustics += worley(uv * 4.0 + uTime * 0.1) * 0.25;
    
    caustics = pow(caustics, 3.0);
    
    vec3 waterColor = vec3(0.0, 0.3, 0.5);
    vec3 lightColor = vec3(0.4, 0.8, 1.0);
    
    vec3 color = mix(waterColor, lightColor, caustics);
    gl_FragColor = vec4(color, 1.0);
}
```

### Organic Blobs

```glsl
void main() {
    vec2 uv = vUv - 0.5;
    
    // Distance from center
    float dist = length(uv);
    
    // Distort the distance with noise
    float angle = atan(uv.y, uv.x);
    float noise = snoise(vec2(angle * 3.0, uTime)) * 0.1;
    
    dist += noise;
    
    // Create blob
    float blob = smoothstep(0.3, 0.28, dist);
    
    gl_FragColor = vec4(vec3(blob), 1.0);
}
```

---

## Domain Warping

Use noise to distort the input to more noise:

```glsl
float warpedNoise(vec2 p) {
    vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0)),
        fbm(p + vec2(5.2, 1.3))
    );
    
    vec2 r = vec2(
        fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * uTime),
        fbm(p + 4.0 * q + vec2(8.3, 2.8) + 0.126 * uTime)
    );
    
    return fbm(p + 4.0 * r);
}
```

This creates incredibly complex, organic patterns with minimal code.

---

## Performance Tips

1. **Precompute when possible** - Store noise in textures for complex effects
2. **Limit octaves** - 4-6 is usually enough for FBM
3. **Lower resolution** - Calculate noise at lower res, then upsample
4. **Use simplex over perlin** - Faster, especially in 3D+

---

## Quick Reference

```glsl
// Simple noise
float n = snoise(uv * frequency);

// Animated noise
float n = snoise(uv * frequency + time);

// FBM for complexity
float n = fbm(uv);

// Turbulence for sharpness
float n = turbulence(uv);

// Worley for cells
float n = worley(uv * frequency);

// Remap to 0-1
float n01 = n * 0.5 + 0.5;

// Threshold for hard edges
float binary = step(0.5, n);

// Soft threshold
float soft = smoothstep(0.4, 0.6, n);
```
