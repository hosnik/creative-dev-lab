# Award-Winning Sites Breakdown

*Study the best to become the best*

---

## How to Study Award-Winning Sites

1. **Experience it first** - Don't inspect immediately, feel it
2. **Identify what stands out** - What makes it memorable?
3. **Inspect the tech** - DevTools, network tab, source code
4. **Recreate elements** - Learn by doing
5. **Iterate** - Improve on what you've learned

---

## Recent Sites of the Month (Awwwards)

### 2025 Winners

#### Igloo Inc (Site of the Year 2024)
🔗 https://igloo.inc

**What makes it special:**
- Seamless 3D world transitions
- Interactive character animations
- Sound design integration
- Playful navigation

**Tech observed:**
- Three.js / React Three Fiber
- Custom shaders for transitions
- Sprite animations
- WebGL particles

**Takeaway:** Personality + Technical polish = Memorable

---

#### Lusion v3 (Site of the Year 2023)
🔗 https://lusion.co

**What makes it special:**
- Industry-leading WebGL craftsmanship
- Physics-based interactions
- Fluid, liquid effects
- Everything feels alive

**Tech observed:**
- Custom Three.js implementation
- Advanced shader work
- Post-processing stack
- Custom physics

**Takeaway:** Master shaders. They're the secret weapon.

---

#### Immersive Garden (Jan 2025)
🔗 https://immersive-garden.com

**What makes it special:**
- Scroll-driven 3D journey
- Seamless loading experience
- Environmental storytelling
- Micro-interactions everywhere

**Tech observed:**
- Three.js
- GSAP ScrollTrigger
- Custom loader
- Sound reactive

**Takeaway:** Loading screens are part of the experience.

---

#### Dropbox Brand (Feb 2025)
🔗 https://brand.dropbox.com

**What makes it special:**
- Clean, corporate yet playful
- 3D product visualization
- Interactive brand guidelines
- Accessible while creative

**Takeaway:** Creative doesn't mean inaccessible.

---

#### Active Theory V6 (Feb 2024)
🔗 https://activetheory.net

**What makes it special:**
- Mind-bending visual effects
- Real-time generative visuals
- Seamless project transitions
- Performance despite complexity

**Takeaway:** Push boundaries, but keep it smooth.

---

## Patterns Across Winners

### 1. Scroll Storytelling
Nearly every winner uses scroll as a narrative device:
- Progress-linked animations
- Sections that "snap" into focus
- Parallax depth
- Smooth, intentional scrolling (often Lenis)

### 2. Custom Cursors
The mouse becomes part of the design:
- Magnetic effects
- Context-aware transformations
- Trail effects
- Interactive hover states

### 3. Sound Design
Audio adds dimension:
- Ambient soundscapes
- UI feedback sounds
- Music that responds to interaction
- Volume that fades tastefully

### 4. Loading as Experience
Loading screens that don't feel like waiting:
- Progress indicators with personality
- Animated logos
- Preloaded first-view content
- Sequential asset loading

### 5. Transitions
Page changes feel crafted:
- Shared element animations
- Wipe/morph effects
- 3D camera movements
- Color shifts

---

## Studios to Follow

### Tier 1: Legendary

| Studio | Known For | Site |
|--------|-----------|------|
| **Lusion** | Cutting-edge WebGL | lusion.co |
| **Active Theory** | Experimental 3D | activetheory.net |
| **Resn** | Creative innovation | resn.co.nz |
| **14islands** | Swedish excellence | 14islands.com |
| **Immersive Garden** | 3D experiences | immersive-garden.com |

### Tier 2: Excellent

| Studio | Known For | Site |
|--------|-----------|------|
| **Locomotive** | Smooth scroll | locomotive.ca |
| **Monopo** | Japanese aesthetics | monopo.co.jp |
| **Aristide Benoist** | Individual craft | aristidebenoist.com |
| **Bruno Simon** | Three.js teaching | bruno-simon.com |
| **Akaru** | Playful interactions | akaru.fr |

---

## Techniques to Steal (Ethically)

### 1. Liquid/Fluid Distortion
```glsl
// Fragment shader distortion
vec2 distortedUV = vUv;
distortedUV.x += sin(vUv.y * 10.0 + uTime) * uIntensity;
distortedUV.y += cos(vUv.x * 10.0 + uTime) * uIntensity;
```

### 2. Image Reveal on Scroll
```javascript
gsap.to('.image', {
  clipPath: 'inset(0% 0% 0% 0%)',
  scrollTrigger: {
    trigger: '.section',
    scrub: true,
  }
})
```

### 3. Magnetic Button
```javascript
const handleMouse = (e) => {
  const rect = button.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  
  gsap.to(button, {
    x: x * 0.3,
    y: y * 0.3,
    duration: 0.3
  })
}
```

### 4. Smooth Scroll with Lenis
```javascript
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
```

### 5. Text Split Animation
```javascript
// Split text into spans
const chars = text.split('').map(char => `<span>${char}</span>`)

gsap.from('.char', {
  y: 100,
  opacity: 0,
  rotationX: -90,
  stagger: 0.02,
  ease: 'back.out'
})
```

---

## Daily Practice Routine

### Morning (15 min)
- Browse Awwwards Site of the Day
- Screenshot 3 things you love
- Note the technique used

### Weekly (2-3 hours)
- Pick one site to deep-dive
- Recreate one effect
- Document what you learned

### Monthly
- Complete one portfolio piece
- Ship something publicly
- Get feedback

---

## Resources for Staying Current

### Daily Inspiration
- [Awwwards](https://awwwards.com)
- [FWA](https://thefwa.com)
- [CSS Design Awards](https://cssdesignawards.com)
- [Codrops Webzibition](https://tympanus.net/codrops/webzibition/)

### Weekly Reading
- [Codrops Collective](https://tympanus.net/codrops/collective/)
- [Three.js Discourse](https://discourse.threejs.org/)
- [R3F Discord](https://discord.gg/ZZjjNvJ)

### Twitter/X Follows
- @mrdoob (Three.js creator)
- @0xca0a (R3F creator)
- @bruno_simon (Three.js Journey)
- @lusionltd
- @activetheory

---

## The 1% Difference

What separates good from great:

1. **Easing curves** - Custom, not defaults
2. **Sound** - Subtle audio feedback
3. **Loading** - Feels like part of the experience
4. **Cursor** - Transforms with context
5. **Transitions** - Between everything
6. **Performance** - 60fps always
7. **Details** - Things you notice subconsciously
8. **Consistency** - Same quality everywhere
