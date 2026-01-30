import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js'
import GUI from 'lil-gui'

/**
 * Environment Maps
 * 
 * Types:
 * - LDR: CubeTexture (6 images) or Equirectangular (1 image)
 * - HDR: High Dynamic Range, better lighting (.hdr, .exr)
 * 
 * Uses:
 * - scene.background: visual background
 * - scene.environment: lighting/reflections for PBR materials
 * - material.envMap: per-material override
 * 
 * Sources:
 * - HDRI Haven (Poly Haven)
 * - 3D software (Blender)
 * - AI generation
 */

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Environment Map - Multiple methods
 */

// Method 1: Cube Texture (6 images)
// const environmentMap = cubeTextureLoader.load([
//     '/textures/environmentMap/px.jpg', // positive x
//     '/textures/environmentMap/nx.jpg', // negative x
//     '/textures/environmentMap/py.jpg', // positive y
//     '/textures/environmentMap/ny.jpg', // negative y
//     '/textures/environmentMap/pz.jpg', // positive z
//     '/textures/environmentMap/nz.jpg'  // negative z
// ])
// scene.background = environmentMap
// scene.environment = environmentMap

// Method 2: HDR Equirectangular (single image, better quality)
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    
    scene.background = environmentMap
    scene.environment = environmentMap
})

// Method 3: LDR Equirectangular
// const environmentMap = textureLoader.load('/textures/environmentMap/blockadesLabsSkybox.jpg')
// environmentMap.mapping = THREE.EquirectangularReflectionMapping
// environmentMap.colorSpace = THREE.SRGBColorSpace
// scene.background = environmentMap
// scene.environment = environmentMap

/**
 * Environment Map Intensity
 */
scene.backgroundBlurriness = 0
scene.backgroundIntensity = 1

gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)

/**
 * Test Objects
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 1,
        color: 0xaaaaaa
    })
)
torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)

// Load a model
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene)
})

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
camera.position.set(4, 5, 4)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
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

    // Rotate torus knot
    if (torusKnot) {
        torusKnot.rotation.y = elapsedTime * 0.3
    }

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
