import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object - Custom BufferGeometry
 * 
 * Geometry stores:
 * - Vertices (positions)
 * - Faces (triangles connecting vertices)
 * - Normals (for lighting)
 * - UVs (for textures)
 * - And more attributes
 */

// Create a custom triangle geometry
// const geometry = new THREE.BufferGeometry()

// // Create vertices array (3 vertices * 3 coordinates each = 9 values)
// const positionsArray = new Float32Array([
//     0, 0, 0,    // vertex 1
//     0, 1, 0,    // vertex 2
//     1, 0, 0     // vertex 3
// ])

// // Create a BufferAttribute (array, itemSize)
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

// // Set the position attribute
// geometry.setAttribute('position', positionsAttribute)

/**
 * Random triangles - more interesting demo
 */
const geometry = new THREE.BufferGeometry()

// Create many random triangles
const count = 50  // 50 triangles
const positionsArray = new Float32Array(count * 3 * 3) // 50 triangles * 3 vertices * 3 coords

// Fill with random positions
for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4 // random value between -2 and 2
}

// Create attribute and apply to geometry
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

// Material - wireframe to see the triangles
const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    wireframe: true  // see individual triangles
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
