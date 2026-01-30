import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Shaders
 * 
 * Shaders are programs that run on the GPU in GLSL (OpenGL Shading Language)
 * 
 * Two types:
 * - Vertex Shader: runs for each vertex, positions vertices
 * - Fragment Shader: runs for each pixel/fragment, colors pixels
 * 
 * Data types:
 * - float, int, bool
 * - vec2, vec3, vec4 (vectors)
 * - mat2, mat3, mat4 (matrices)
 * - sampler2D (textures)
 * 
 * Variables:
 * - attribute: per-vertex data (position, uv, normal) - vertex shader only
 * - uniform: same for all vertices/fragments (time, color, texture)
 * - varying: passed from vertex to fragment shader
 */

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/flag.jpg') // You'd need this texture

/**
 * Custom Shader Material
 */
const material = new THREE.ShaderMaterial({
    vertexShader: `
        uniform vec2 uFrequency;
        uniform float uTime;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Wave effect
            float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
            elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
            
            modelPosition.z += elevation;
            
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            
            // Pass to fragment shader
            vUv = uv;
            vElevation = elevation;
        }
    `,
    fragmentShader: `
        uniform vec3 uColor;
        uniform sampler2D uTexture;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
            vec4 textureColor = texture2D(uTexture, vUv);
            textureColor.rgb *= vElevation * 2.0 + 0.9; // darken valleys
            gl_FragColor = textureColor;
        }
    `,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: flagTexture }
    },
    side: THREE.DoubleSide
})

// GUI
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')

/**
 * Mesh
 */
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3
scene.add(mesh)

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
camera.position.set(0.25, -0.25, 1)
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

    // Update shader uniform
    material.uniforms.uTime.value = elapsedTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
