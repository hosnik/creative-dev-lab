import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

/**
 * Modified Materials
 * 
 * Instead of writing shaders from scratch, modify existing materials!
 * This keeps all the PBR lighting, shadows, env maps while adding custom effects.
 * 
 * Hook into material shaders using:
 * - material.onBeforeCompile = (shader) => { ... }
 * - shader.vertexShader - modify vertex code
 * - shader.fragmentShader - modify fragment code
 * - shader.uniforms - add custom uniforms
 * 
 * Find injection points in Three.js shader chunks:
 * - #include <begin_vertex> - after position is defined
 * - #include <project_vertex> - before projection
 */

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()

/**
 * Environment map
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
scene.background = environmentMap
scene.environment = environmentMap

/**
 * Material with modified shaders
 */
const customUniforms = {
    uTime: { value: 0 }
}

const material = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    color: '#aaaaaa'
})

// Modify the material's shaders
material.onBeforeCompile = (shader) => {
    // Add our uniforms
    shader.uniforms.uTime = customUniforms.uTime
    
    // Modify vertex shader
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        
        uniform float uTime;
        
        mat2 get2dRotateMatrix(float _angle) {
            return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
        }
        `
    )
    
    // Twist the model based on elevation
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        
        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        
        transformed.xz = rotateMatrix * transformed.xz;
        `
    )
    
    // Also need to rotate normals for correct lighting
    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>
        
        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        
        objectNormal.xz = rotateMatrix * objectNormal.xz;
        `
    )
}

// Fix shadow (needs same modifications)
const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
})

depthMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = customUniforms.uTime
    
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        
        uniform float uTime;
        
        mat2 get2dRotateMatrix(float _angle) {
            return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
        }
        `
    )
    
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        
        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        
        transformed.xz = rotateMatrix * transformed.xz;
        `
    )
}

/**
 * Test objects
 */
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15, 15),
    new THREE.MeshStandardMaterial()
)
plane.rotation.y = Math.PI
plane.position.y = -5
plane.position.z = 5
scene.add(plane)

// Load model and apply custom material
gltfLoader.load('/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
    const mesh = gltf.scene.children[0]
    mesh.material = material
    mesh.customDepthMaterial = depthMaterial // for shadows
    mesh.rotation.y = Math.PI * 0.5
    scene.add(mesh)
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, -2.25)
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
camera.position.set(4, 1, -4)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update uniform
    customUniforms.uTime.value = elapsedTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
