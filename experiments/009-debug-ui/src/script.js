import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug UI
 * lil-gui creates a panel for tweaking values in real-time
 */
const gui = new GUI({
    width: 300,
    title: 'Debug Panel',
    closeFolders: false
})

// Can hide with: gui.hide() or press 'h'
// window.addEventListener('keydown', (e) => {
//     if (e.key === 'h') gui.show(gui._hidden)
// })

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: '#ff0000', wireframe: false })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Debug controls
 */
// Folder for organization
const cubeTweaks = gui.addFolder('Cube')

// Position controls (range sliders)
cubeTweaks.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('Position X')
cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Position Y')
cubeTweaks.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('Position Z')

// Boolean toggle (checkbox)
cubeTweaks.add(mesh, 'visible').name('Visible')
cubeTweaks.add(material, 'wireframe').name('Wireframe')

// Color picker - need to use onChange because color is not directly accessible
const colorController = cubeTweaks.addColor(material, 'color').name('Color')

// Custom object for button actions
const debugObject = {
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    },
    subdivision: 2
}

// Button (function)
cubeTweaks.add(debugObject, 'spin').name('Spin!')

// Complex control - rebuild geometry on change
cubeTweaks.add(debugObject, 'subdivision')
    .min(1).max(20).step(1)
    .name('Subdivisions')
    .onFinishChange(() => {
        // Dispose old geometry to avoid memory leak
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1,
            debugObject.subdivision,
            debugObject.subdivision,
            debugObject.subdivision
        )
    })

/**
 * Sizes
 */
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

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
