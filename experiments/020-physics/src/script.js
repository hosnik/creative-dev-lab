import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'

/**
 * Physics with Cannon.js (cannon-es)
 * 
 * Concept: Create physics world, sync with Three.js meshes
 * 
 * Steps:
 * 1. Create CANNON.World with gravity
 * 2. Create CANNON.Body for each object (shape + mass)
 * 3. On each frame: world.step(), copy position/quaternion to mesh
 * 
 * Libraries: cannon-es, ammo.js, rapier, oimo.js
 */

const gui = new GUI()
const debugObject = {}

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Physics World
 */
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

// Broadphase (optimization for collision detection)
world.broadphase = new CANNON.SAPBroadphase(world)

// Allow sleep (don't calculate static bodies)
world.allowSleep = true

// Materials for friction/bounce
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7 // bounciness
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

/**
 * Floor
 */
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0, // static
    shape: floorShape
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: '#777777', metalness: 0.3, roughness: 0.4 })
)
floorMesh.rotation.x = -Math.PI * 0.5
floorMesh.receiveShadow = true
scene.add(floorMesh)

/**
 * Objects array to sync
 */
const objectsToUpdate = []

/**
 * Create sphere function
 */
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.4 })

const createSphere = (radius, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape
    })
    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

/**
 * Create box function
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.4 })

const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape
    })
    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

// Initial objects
createSphere(0.5, { x: 0, y: 3, z: 0 })
createBox(1, 1, 1, { x: 2, y: 3, z: 0 })

/**
 * GUI
 */
debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}
debugObject.createBox = () => {
    createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
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
camera.position.set(-3, 3, 3)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
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
let oldElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics world
    world.step(1 / 60, deltaTime, 3)

    // Sync Three.js meshes with Cannon.js bodies
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
