import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Textures
 * 
 * Types of textures:
 * - Color (albedo): base color
 * - Alpha: grayscale, white=visible, black=invisible
 * - Height (displacement): grayscale, moves vertices
 * - Normal: RGB, adds surface detail without geometry
 * - Ambient Occlusion: grayscale, fake shadows in crevices
 * - Metalness: grayscale, metallic areas
 * - Roughness: grayscale, rough vs smooth surfaces
 */

/**
 * Loading Manager - track loading progress
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => console.log('Loading started')
loadingManager.onLoad = () => console.log('Loading complete')
loadingManager.onProgress = (url, loaded, total) => {
    console.log(`Loading: ${url} (${loaded}/${total})`)
}
loadingManager.onError = (url) => console.error(`Error loading: ${url}`)

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader(loadingManager)

// Load the door texture
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// For minecraft-style textures, use NearestFilter to keep pixelated look
const minecraftTexture = textureLoader.load('/textures/minecraft.png')
minecraftTexture.generateMipmaps = false
minecraftTexture.minFilter = THREE.NearestFilter
minecraftTexture.magFilter = THREE.NearestFilter

// Color space - important for color textures!
colorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Texture transformations
 */
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping  // or MirroredRepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI / 4  // 45 degrees
// colorTexture.center.x = 0.5  // rotate around center
// colorTexture.center.y = 0.5

/**
 * Filtering
 * 
 * Minification filter (texture bigger than surface):
 * - NearestFilter: pixelated, fast
 * - LinearFilter: blurry, default
 * - NearestMipmapNearestFilter, LinearMipmapNearestFilter, etc.
 * 
 * Magnification filter (texture smaller than surface):
 * - NearestFilter: pixelated (good for minecraft)
 * - LinearFilter: blurry, default
 */

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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
