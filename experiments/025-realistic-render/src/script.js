import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'

/**
 * Realistic Render
 * 
 * Key settings for photorealism:
 * 
 * 1. Renderer:
 *    - toneMapping: maps HDR to LDR (ACESFilmicToneMapping)
 *    - toneMappingExposure: brightness control
 *    - outputColorSpace: THREE.SRGBColorSpace
 *    - antialias: true
 * 
 * 2. Lights:
 *    - Use environment maps for natural lighting
 *    - DirectionalLight for sun
 *    - Proper shadow settings
 * 
 * 3. Materials:
 *    - Correct colorSpace on textures
 *    - Proper metalness/roughness values
 * 
 * 4. Model:
 *    - Traverse and update materials
 *    - Enable shadows on meshes
 */

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()

/**
 * Environment Map
 */
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    
    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Directional Light (sun)
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 6)
directionalLight.position.set(-4, 6.5, 2.5)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)

// Sharper shadows
directionalLight.shadow.normalBias = 0.027
directionalLight.shadow.bias = -0.004

scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Light Intensity')
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('Light X')
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('Light Y')
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('Light Z')

/**
 * Model
 */
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene)
    
    // Update all materials in the model
    updateAllMaterials()
})

/**
 * Update all materials for realism
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            // Environment map intensity
            child.material.envMapIntensity = 1
            
            // Enable shadows
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

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
 * Renderer - Realistic settings
 */
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true  // smooth edges
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tone mapping (HDR to LDR)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(() => updateAllMaterials())

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

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
