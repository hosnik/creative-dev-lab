import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

/**
 * Imported Models
 * 
 * Formats:
 * - GLTF: standard, supports most features
 * - GLB: binary GLTF, single file
 * - DRACO: compressed, smaller file size
 * - FBX, OBJ: older formats, less features
 * 
 * Structure:
 * - scene: contains the model
 * - animations: animation clips
 * - cameras: embedded cameras
 * - asset: metadata
 */

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Models
 */

// DRACO Loader (for compressed models)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/') // need draco decoder files

// GLTF Loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null // for animations

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf', // or .glb
    (gltf) => {
        console.log('Model loaded:', gltf)
        
        // Option 1: Add entire scene
        // scene.add(gltf.scene)
        
        // Option 2: Add children individually
        // while (gltf.scene.children.length) {
        //     scene.add(gltf.scene.children[0])
        // }
        
        // Option 3: Add scene but scale/position
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
        
        // Animations
        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(gltf.scene)
            const action = mixer.clipAction(gltf.animations[0])
            action.play()
            
            // GUI to switch animations
            const animationNames = gltf.animations.map(a => a.name)
            console.log('Animations:', animationNames)
        }
    },
    (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
    },
    (error) => {
        console.error('Error loading model:', error)
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update animation mixer
    if (mixer) {
        mixer.update(deltaTime)
    }

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
