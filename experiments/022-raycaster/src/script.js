import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Raycaster
 * 
 * Casts a ray and detects intersections with objects.
 * Uses:
 * - Mouse picking (click/hover detection)
 * - Collision detection
 * - Line of sight
 * - Physics (shooting)
 * 
 * Methods:
 * - raycaster.set(origin, direction): set ray manually
 * - raycaster.setFromCamera(coords, camera): ray from camera through mouse
 * - raycaster.intersectObject(object): test single object
 * - raycaster.intersectObjects(array): test multiple objects
 */

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Objects to test
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

// Manual ray (for testing)
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(1, 0, 0)
// rayDirection.normalize() // must be normalized!
// raycaster.set(rayOrigin, rayDirection)

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    // Convert to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('Clicked object 1')
                break
            case object2:
                console.log('Clicked object 2')
                break
            case object3:
                console.log('Clicked object 3')
                break
        }
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
let currentIntersect = null

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Animate objects (wave motion)
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Cast ray from camera through mouse
    raycaster.setFromCamera(mouse, camera)
    
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    // Reset colors
    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }

    // Highlight intersected objects
    for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    // Track hover state for events
    if (intersects.length) {
        if (!currentIntersect) {
            console.log('Mouse enter')
        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {
            console.log('Mouse leave')
        }
        currentIntersect = null
    }

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
