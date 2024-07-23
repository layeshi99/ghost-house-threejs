import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { depth, metalness, roughness } from 'three/examples/jsm/nodes/Nodes.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//textures
const textureLoader = new THREE.TextureLoader()

//floor texture
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/forest_leaves_04_1k/color.jpg')
const floorARMTexture = textureLoader.load('./floor/forest_leaves_04_1k/arm.jpg')
const floorNormalTexture = textureLoader.load('./floor/forest_leaves_04_1k/normal.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/forest_leaves_04_1k/displacemnt.jpg')

floorColorTexture.colorSpace=THREE.SRGBColorSpace

floorColorTexture.repeat.set(8,8)
floorARMTexture.repeat.set(8,8)
floorNormalTexture.repeat.set(8,8)
floorDisplacementTexture.repeat.set(8,8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

//wall texture
const wallColorTexture = textureLoader.load('./floor/brick_wall_08_1k/color.jpg')
const wallARMTexture = textureLoader.load('./floor/brick_wall_08_1k/arm.jpg')
const wallNormalTexture = textureLoader.load('./floor/brick_wall_08_1k/normal.jpg')

wallColorTexture.colorSpace=THREE.SRGBColorSpace

//bush texture
const bushColorTexture = textureLoader.load('./floor/bushes/color.jpg')
const bushARMTexture = textureLoader.load('./floor/bushes/arm.jpg')
const bushNormalTexture = textureLoader.load('./floor/bushes/normal.jpg')
const bushDisplacementTexture = textureLoader.load('./floor/bushes/displacemnt.jpg')

bushColorTexture.colorSpace=THREE.SRGBColorSpace

//roof texture
const roofColorTexture = textureLoader.load('./floor/clay_roof_tiles_03_1k/color.jpg')
const roofARMTexture = textureLoader.load('./floor/clay_roof_tiles_03_1k/arm.jpg')
const roofNormalTexture = textureLoader.load('./floor/clay_roof_tiles_03_1k/normal.jpg')

roofColorTexture.colorSpace=THREE.SRGBColorSpace

roofColorTexture.repeat.set(3,1)
roofARMTexture.repeat.set(3,1)
roofNormalTexture.repeat.set(3,1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

//grave texture
const graveColorTexture = textureLoader.load('./floor/grave/color.jpg')
const graveARMTexture = textureLoader.load('./floor/grave/arm.jpg')
const graveNormalTexture = textureLoader.load('./floor/grave/normal.jpg')
const graveDisplacementTexture = textureLoader.load('./floor/grave/displacemnt.jpg')

graveColorTexture.colorSpace=THREE.SRGBColorSpace


//door texture
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace


/**
 * House
 */
// const houseMeasurements={
//     width:4,
//     height:4,
//     depth:4
// }

//floor
const floor=new THREE.Mesh(
    new THREE.PlaneGeometry(20,20,100,100),
    new THREE.MeshStandardMaterial({
        transparent:true,
        alphaMap:floorAlphaTexture,
        map:floorColorTexture,
        displacementMap:floorDisplacementTexture,
        displacementScale:0.3,
        displacementBias:-0.2
    })
)
floor.rotation.x=- Math.PI * 0.5
scene.add(floor)

gui.add(floor.material,'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')

//house container
const house = new THREE.Group()
scene.add(house)

//walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map:wallColorTexture,
        aoMap:wallARMTexture,
        roughnessMap:wallARMTexture,
        metalnessMap:wallARMTexture,
        normalMap:wallNormalTexture,
    })
)
walls.position.y =2.5/2
house.add(walls)

//roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1.5,4),
    new THREE.MeshStandardMaterial({
        map:roofColorTexture,
        aoMap:roofARMTexture,
        roughnessMap:roofARMTexture,
        metalnessMap:roofARMTexture,
        normalMap:roofNormalTexture
    })
)
roof.position.y = 2.5 + (1.5/2)
roof.rotation.y= Math.PI /4
house.add(roof)

//door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({
        color:'gray',
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale:0.15,
         
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.y=1
door.position.z=2 + 0.01
house.add(door)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

//bushes
const bushGeometry =new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color:'#ccffcc',
    map:bushColorTexture,
     
})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)

house.add(bush1,bush2,bush3,bush4)

//graves
const graveGeometry = new THREE.BoxGeometry(0.6,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map:graveColorTexture,
    aoMap:graveARMTexture,
        roughnessMap:graveARMTexture,
        metalnessMap:graveARMTexture,
        normalMap:graveNormalTexture,
})

const graves  = new THREE.Group()
scene.add(graves)

for(let i =0;i<30;i++){
    const angle = Math.random()*Math.PI*2
    const radius = 3 + Math.random()*4
    const x = Math.sin(angle)*radius
    const z = Math.cos(angle)*radius 

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.x=x
    grave.position.y=Math.random()*0.4
    grave.position.z=z
    grave.rotation.x=(Math.random() - 0.5)*0.4
    grave.rotation.y=(Math.random() - 0.5)*0.4
    grave.rotation.z=(Math.random() - 0.5)*0.4

    graves.add(grave)
}

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()