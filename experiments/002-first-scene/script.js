import * as THREE from 'three'

/**
 * 002 - First Three.js Scene
 * Following threejs-journey lesson 03
 * 
 * The 4 essentials:
 * 1. Scene - container for objects
 * 2. Objects - meshes (geometry + material)
 * 3. Camera - point of view
 * 4. Renderer - draws to canvas
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// 1. Scene
const scene = new THREE.Scene()

// 2. Object (red cube)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// 3. Camera
// PerspectiveCamera(fov, aspect ratio)
// fov = field of view in degrees (vertical angle)
// aspect = width / height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3 // move camera back so we can see the cube
scene.add(camera)

// 4. Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

// Render!
renderer.render(scene, camera)
