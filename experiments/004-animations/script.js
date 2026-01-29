import * as THREE from 'three'

/**
 * 004 - Animations
 * Following threejs-journey lesson 05
 * 
 * Key concepts:
 * - requestAnimationFrame for animation loop
 * - THREE.Clock for consistent timing
 * - Math.sin/cos for smooth motion
 */

const canvas = document.querySelector('canvas.webgl')
const sizes = { width: 800, height: 600 }

// Scene
const scene = new THREE.Scene()

// Objects - multiple cubes to animate differently
const geometry = new THREE.BoxGeometry(1, 1, 1)

const cube1 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = -2
scene.add(cube1)

const cube2 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
scene.add(cube2)

const cube3 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 2
scene.add(cube3)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

// Animation
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  
  // Cube 1: continuous rotation
  cube1.rotation.y = elapsedTime
  cube1.rotation.x = elapsedTime * 0.5
  
  // Cube 2: bouncing up and down with sin
  cube2.position.y = Math.sin(elapsedTime * 2) * 0.5
  cube2.rotation.z = elapsedTime
  
  // Cube 3: circular motion with sin/cos
  cube3.position.x = 2 + Math.cos(elapsedTime) * 0.5
  cube3.position.y = Math.sin(elapsedTime) * 0.5
  cube3.rotation.y = -elapsedTime
  
  // Render
  renderer.render(scene, camera)
  
  // Next frame
  window.requestAnimationFrame(tick)
}

tick()
