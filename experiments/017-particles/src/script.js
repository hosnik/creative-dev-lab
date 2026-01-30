import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Particles
 * 
 * Created using:
 * - BufferGeometry (positions as Float32Array)
 * - PointsMaterial (size, color, map, alphaMap, etc.)
 * - Points (not Mesh!)
 * 
 * Key properties:
 * - size: particle size
 * - sizeAttenuation: smaller when far (perspective)
 * - alphaMap: texture for shape
 * - alphaTest/depthTest/depthWrite: fix transparency issues
 * - blending: AdditiveBlending for glow effect
 * - vertexColors: per-particle colors
 */

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

// Positions (x, y, z for each particle)
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random() // RGB values 0-1
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true, // smaller when far
    color: 0xffffff,
    transparent: true,
    // alphaMap: particleTexture, // use texture for shape
    // alphaTest: 0.001, // don't render pixels below threshold
    // depthTest: false, // ignore depth (careful with other objects)
    depthWrite: false, // don't write to depth buffer (fixes overlap issues)
    blending: THREE.AdditiveBlending, // add colors together (glow effect)
    vertexColors: true // use per-vertex colors
})

// Points (not Mesh!)
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// GUI
gui.add(particlesMaterial, 'size').min(0.01).max(0.5).step(0.01)

/**
 * Sizes
 */
const sizes = { width: window.innerWidth, height: window.innerHeight }

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    // Animate particles (wave effect)
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
