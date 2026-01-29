import * as THREE from 'three';

// scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

camera.position.z = 50;

// particle config
const PARTICLE_COUNT = 5000;
const positions = new Float32Array(PARTICLE_COUNT * 3);
const velocities = new Float32Array(PARTICLE_COUNT * 3);
const colors = new Float32Array(PARTICLE_COUNT * 3);

// initialize particles
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const i3 = i * 3;
  
  // random position in a sphere
  const radius = 30 + Math.random() * 20;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  
  positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  positions[i3 + 2] = radius * Math.cos(phi);
  
  velocities[i3] = 0;
  velocities[i3 + 1] = 0;
  velocities[i3 + 2] = 0;
  
  // gradient colors: cyan to magenta
  const t = i / PARTICLE_COUNT;
  colors[i3] = 0.1 + t * 0.9;     // r
  colors[i3 + 1] = 0.8 - t * 0.4; // g
  colors[i3 + 2] = 0.9;           // b
}

// geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// material
const material = new THREE.PointsMaterial({
  size: 0.15,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// simplex-like noise (simplified)
function noise3d(x, y, z) {
  const freq = 0.02;
  return Math.sin(x * freq) * Math.cos(y * freq) * Math.sin(z * freq + x * 0.01);
}

// mouse interaction
const mouse = new THREE.Vector2(0, 0);
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// animation loop
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;
  
  const posArray = geometry.attributes.position.array;
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    
    const x = posArray[i3];
    const y = posArray[i3 + 1];
    const z = posArray[i3 + 2];
    
    // flow field forces
    const noiseX = noise3d(x + time * 10, y, z);
    const noiseY = noise3d(x, y + time * 10, z);
    const noiseZ = noise3d(x, y, z + time * 10);
    
    // add forces to velocity
    velocities[i3] += noiseX * 0.02;
    velocities[i3 + 1] += noiseY * 0.02;
    velocities[i3 + 2] += noiseZ * 0.02;
    
    // mouse repulsion
    const dx = x - mouse.x * 30;
    const dy = y - mouse.y * 30;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 15) {
      const force = (15 - dist) * 0.02;
      velocities[i3] += (dx / dist) * force;
      velocities[i3 + 1] += (dy / dist) * force;
    }
    
    // damping
    velocities[i3] *= 0.98;
    velocities[i3 + 1] *= 0.98;
    velocities[i3 + 2] *= 0.98;
    
    // apply velocity
    posArray[i3] += velocities[i3];
    posArray[i3 + 1] += velocities[i3 + 1];
    posArray[i3 + 2] += velocities[i3 + 2];
    
    // boundary: pull back toward center
    const currentDist = Math.sqrt(x * x + y * y + z * z);
    if (currentDist > 60) {
      posArray[i3] *= 0.99;
      posArray[i3 + 1] *= 0.99;
      posArray[i3 + 2] *= 0.99;
    }
  }
  
  geometry.attributes.position.needsUpdate = true;
  
  // gentle rotation
  particles.rotation.y = time * 0.1;
  particles.rotation.x = Math.sin(time * 0.5) * 0.1;
  
  renderer.render(scene, camera);
}

animate();

// resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
