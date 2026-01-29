import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * 005 - Cameras & OrbitControls
 * Following threejs-journey lesson 06
 */

const canvas = document.querySelector('canvas.webgl')
const sizes = { width: 800, height: 600 }

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera - PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls - OrbitControls for interactive camera
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // smooth camera movement

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

// Animation loop
const tick = () => {
  // Update controls (required for damping)
  controls.update()
  
  // Render
  renderer.render(scene, camera)
  
  window.requestAnimationFrame(tick)
}

tick()
