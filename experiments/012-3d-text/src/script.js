import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * 3D Text
 * 
 * TextGeometry creates 3D text from a typeface JSON font
 * FontLoader loads the font file
 */

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// AxesHelper - debug tool to see orientation
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    // TextGeometry parameters
    const textGeometry = new TextGeometry('Hello Three.js', {
        font: font,
        size: 0.5,
        depth: 0.2,          // was 'height' in older versions
        curveSegments: 5,     // curves smoothness
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    })
    
    // Center the text using bounding box
    textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
    // )
    // Or simpler:
    textGeometry.center()
    
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)
    
    // Add donuts around the text
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    
    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, material)
        
        // Random position
        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10
        
        // Random rotation
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        
        // Random scale
        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
        
        scene.add(donut)
    }
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
camera.position.set(1, 1, 2)
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
