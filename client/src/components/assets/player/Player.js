import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import keyMapper from "./KeyMapper"
import KeyPressed from './KeyPressed';
import { Box3, Ray, Raycaster, Vector3, LoadingManager } from 'three';
import Animate from './Animate';

/*
Constructor:
@param scene: THREE.Scene
@param playerHelper: Boolean
*/


/*
Klasa Player służąca jak podstawa do tworzenia graczy na planszy. 
Wykorzystuje modele FBX.
Model jest automatycznie ładowany po wywołaniu klasy
@param scene: THREE.Scene
@param this.corretion: Boolean
@param this.onSurface: Boolean
@param this.jumped: Boolean
@param this.scene: THREE.Scene
@param this.jumpVelocity: Int
@param this.doneJumping: Boolean
@param this.domElement: `DOMElement`
@param this.loader: THREE.FBXLoader
@param this.model: THREE.Group<Model>
@param this.raycaster: THREE.Raycaster
@param this.sceneObjects: Object<THREE.Mesh>
@param this.blockMove: Boolean
*/

/*
Player wymaga w main => 
- stworzenia instancji gracza 
- w render() musi być wywoływana funkcja updatePlayer()
*/

//TODO: Zrobić aby model ładowały się w klasach podrzędnych 
export default class Player {
    constructor(scene, manager, camera) {
        //Animacja
        this.running = false
        //Animacja
        this.camera = camera
        this.blockMove = false
        this.corretion = true
        this.scene = scene
        this.jumpVelocity = 0
        this.doneJumping = false
        this.jumped = false
        this.domElement = window
        this.onSurface = true
        this.loader = new FBXLoader(manager)
        this.model = null
        this.box3 = null
        this.raycasterFloor = new Raycaster(new Vector3(0, 0, 0), new Vector3(0, -1, 0))
        this.raycasterWallUp = new Raycaster(new Vector3(0, 0, 0), new Vector3(0, 0, -1))
        this.raycasterWallDown = new Raycaster(new Vector3(0, 0, 0), new Vector3(0, 0, -1))
        this.raycasterCelling = new Raycaster(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
        this.sceneObjects = this.scene.children
        this.excludeMesh = ["Swap"]
        this.mixer = null
        this.doesWon = false
        this.init()
    }

    init() {
        this.domElement.addEventListener("keydown", (e) => this.eventMapper(e.keyCode, "down"))
        this.domElement.addEventListener("keyup", (e) => this.eventMapper(e.keyCode, "up"))

    }

    eventMapper(keyCode, origin) {
        if (origin == "up") {

            switch (keyCode) {
                case keyMapper.up:
                    KeyPressed.up = false
                    break
                case keyMapper.down:
                    KeyPressed.down = false
                    break
                case keyMapper.left:
                    KeyPressed.left = false
                    break
                case keyMapper.right:
                    KeyPressed.right = false
                    break
            }

            if (!KeyPressed.right && !KeyPressed.left && !KeyPressed.down && !KeyPressed.up) {
                this.running = false
            }
        }
        if (origin == "down") {

            switch (keyCode) {
                case keyMapper.up:
                    KeyPressed.up = true
                    break
                case keyMapper.down:
                    KeyPressed.down = true
                    break
                case keyMapper.left:
                    KeyPressed.left = true
                    break
                case keyMapper.right:
                    KeyPressed.right = true
                    break
                case keyMapper.jump:
                    KeyPressed.jump = true
                    break
            }

            if (KeyPressed.right || KeyPressed.left || KeyPressed.down || KeyPressed.up) {
                this.running = true
            }
        }
    }



    movePlayer() {
        let upDown = null
        let leftRight = null

        if (KeyPressed.up) {
            upDown = Math.PI
        }
        if (KeyPressed.down) {
            upDown = 0
        }
        if (KeyPressed.left) {
            leftRight = Math.PI * 1.5
        }
        if (KeyPressed.right) {
            leftRight = Math.PI / 2
        }
        if (KeyPressed.jump) {
            if (!this.doneJumping) {
                this.jumpUp()
            }
        }

        //ustawienie rotacji modelu na podstawie jego ruchu
        if (upDown != null || leftRight != null) {
            this.model.rotation.y = getRotation(upDown, leftRight)
            if (!this.blockMove) {
                this.model.translateZ(4)
            }

        }
    }



    jumpUp() {
        this.jumped = true
        this.jumpVelocity += 3
        this.model.translateY(this.jumpVelocity)
        if (this.jumpVelocity > 10 || this.doneJumping == true) {
            this.doneJumping = true
            KeyPressed.jump = false
        }

    }
    fallDown() {
        if (this.jumpVelocity > -17) {
            this.jumpVelocity -= 0.8
        }
        this.model.translateY(this.jumpVelocity)

        if (this.model.position.y < 0) {
            this.model.position.y = 0
        }
    }
    //bierze model w formacie .fbx
    modelLoad(model) {
        this.loader.load(model, (obj) => {
            this.scene.add(obj)

            this.model = obj
            this.model.name = "playerModel"

            //usuwa alpha mapę dla kate (jumpPlayer) oraz oblicza boudingbox
            if (this.model.children[0].material[1] != undefined) {
                this.model.children[0].material[1].alphaMap = null
                this.model.children[0].geometry.computeBoundingBox()
                this.box3 = new Box3().copy(this.model.children[0].geometry.boundingBox).applyMatrix4(this.model.matrixWorld)
                this.mixer = new Animate(this.model)
            }
            else {
                this.mixer = new Animate(this.model)
                this.model.children[0].geometry.computeBoundingBox()
                this.box3 = new Box3().copy(this.model.children[0].geometry.boundingBox).applyMatrix4(this.model.matrixWorld)
            }


            //placeholder albo nie XD
            this.model.rotation.y = Math.PI
            this.sceneObjects = this.scene.children
            this.sceneObjects = this.sceneObjects.filter(el => el != obj)
            this.sceneObjects = this.sceneObjects.filter(el => {
                if (!this.excludeMesh.includes(el.name)) {
                    return el
                }
            })
            this.createIntersection()

            this.model.position.set(-600, 100, 150)
            this.camera.position.set(-600, 500, 950)
            this.camera.lookAt(new Vector3(-600, 150, 150))
        })
    }

    createIntersection() {

        const deconstructedData = { arr: [] }

        this.sceneObjects.forEach((el, index) => {
            if (el.type == "Group") {
                deconstructedData[index] = el
                deconstructedData.arr.push(...el.children)
            }
        })

        this.sceneObjects.push(...deconstructedData.arr)
        for (let el in deconstructedData) {
            if (el == "arr") {
                continue
            }
            else {
                this.sceneObjects.splice(this.sceneObjects.indexOf(deconstructedData[el]), 1)
            }
        }
    }

    checkFloor() {
        if (this.model) {
            const ray = new Ray(this.model.position.clone().add(new Vector3(0, 50, 0)), new Vector3(0, -1, 0))
            this.raycasterFloor.ray = ray
            const intersects = this.raycasterFloor.intersectObjects(this.sceneObjects)

            if (intersects[0]) {
                if (intersects[0].distance < 55) {
                    this.jumped = false
                    this.doneJumping = false
                    this.jumpVelocity = 0
                    if (this.corretion) {
                        this.model.position.y += 50 - intersects[0].distance
                    }
                    this.corretion = false
                }
                else {
                    this.corretion = true
                    this.fallDown()
                }
            }
        }
    }

    checkCelling() {
        if (this.model) {
            const ray = new Ray(this.model.position.clone().add(new Vector3(0, 50, 0)), new Vector3(0, 1, 0))
            this.raycasterCelling.ray = ray
            const intersects = this.raycasterCelling.intersectObjects(this.sceneObjects)

            if (intersects[0]) {
                if (intersects[0].distance < 125) {
                    this.jumpVelocity = 0
                    this.doneJumping = true
                    KeyPressed.jump = false
                }
            }
        }
    }
    checkWall() {
        if (this.model) {
            const rotatedVector = new Vector3(0, 0, 1).applyAxisAngle(new Vector3(0, 1, 0), this.model.rotation.y)
            const rayDown = new Ray(this.model.position.clone().add(new Vector3(0, 5, 0)), rotatedVector)
            const rayUp = new Ray(this.model.position.clone().add(new Vector3(0, 120, 0)), rotatedVector)

            this.raycasterWallUp.ray = rayUp
            this.raycasterWallDown.ray = rayDown

            const intersectionDown = this.raycasterWallDown.intersectObjects(this.sceneObjects)
            const intersectionUp = this.raycasterWallUp.intersectObjects(this.sceneObjects)
            //console.log(intersectionDown, intersectionUp)
            if (intersectionDown[0] || intersectionUp[0]) {
                if ((intersectionDown[0] != undefined && intersectionDown[0].distance < 50) || (intersectionUp[0] != undefined && intersectionUp[0].distance < 50)) {
                    this.blockMove = true
                } else {
                    this.blockMove = false
                }
            } else {
                this.blockMove = false
            }

        }
    }

    updateCam() {
        let posX = this.model.position.x
        let posY = this.model.position.y
        this.camera.position.x = posX
        this.camera.position.y = posY + 500
    }
}

function getRotation(...value) {
    if ((value[0] || value[0] == 0) && value[1]) {
        if (value[0] == 0 && value[1] == Math.PI * 1.5) {
            return (Math.PI * 2 + Math.PI * 1.5) / 2
        } else {
            return (value[0] + value[1]) / 2
        }
    }
    else if (value[0] || value[0] == 0) {
        return value[0]
    }
    else if (value[1]) {
        return value[1]
    }

}