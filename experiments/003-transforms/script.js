import * as THREE from 'three'

/**
 * 003 - Transforms
 * Following threejs-journey lesson 04
 * 
 * Transform properties:
 * - position (Vector3)
 * - scale (Vector3)
 * - rotation (Euler) / quaternion
 */

const canvas = document.querySelector('canvas.webgl')
const sizes = { width: 800, height: 600 }

// Scene
const scene = new THREE.Scene()

// Axes helper - red=x, green=y, blue=z
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Group - transform multiple objects together
const group = new THREE.Group()
scene.add(group)

// Create 3 cubes with different colors
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = -2
group.add(cube1)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = 0
group.add(cube2)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 2
group.add(cube3)

// Transform the group (affects all children)
group.position.y = 0.5
group.scale.y = 1.5
group.rotation.y = Math.PI * 0.15 // slight rotation

// Individual transforms still work
cube1.rotation.x = Math.PI * 0.25
cube3.scale.set(0.5, 0.5, 0.5)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.y = 1
camera.lookAt(group.position) // point camera at group center
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Log some Vector3 methods
console.log('cube1 distance from origin:', cube1.position.length())
console.log('cube1 distance from cube3:', cube1.position.distanceTo(cube3.position))
