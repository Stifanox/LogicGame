import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import keyMapper from "./KeyMapper"
import KeyPressed from './KeyPressed';
import test from "../model/rp_nathan_animated_003_walking.fbx"
import { Ray, Raycaster, Vector3 } from 'three';

/*
Klasa Player służąca jak podstawa do tworzenia graczy na planszy. 
Wykorzystuje modele FBX.
Model jest automatycznie ładowany po wywołaniu klasy
@param scene: THREE.Scene
@param this.inAir: Boolean
@param this.scene: THREE.Scene
@param this.jumpVelocity: Int
@param this.doneJumping: Boolean
@param this.domElement: DOMElement
@param this.loader: THREE.FBXLoader
@param this.model: THREE.Model
@param this.raycaster: THREE.Raycaster
@param this.sceneObjects: Object<THREE.Mesh>
*/

//TODO: kolizja występuje poprzez hitbox z dużym boxem który jest nałożony na cały model
export default class Player{
    constructor(scene) {
        //inAir służy do sprawdzenia czy postać jest w powietrzu
        this.corretion = true
        this.scene = scene
        this.jumpVelocity = 0
        this.doneJumping = false
        this.domElement = window
        this.onSurface = true
        this.loader = new FBXLoader()
        this.model = null
        this.raycaster = new Raycaster(new Vector3(0,0,0),new Vector3(0,-1,0))
        this.sceneObjects = this.scene.children
        this.init()
    }

    init(){
        this.modelLoad()
        this.domElement.addEventListener("keydown", (e) => this.eventMapper(e.keyCode,"down"))
        this.domElement.addEventListener("keyup", (e) => this.eventMapper(e.keyCode,"up"))
    }

    eventMapper(keyCode,origin){
            if(origin == "up"){
                switch(keyCode){
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
            }
            if(origin == "down"){
                switch(keyCode){
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
            } 
    }

   

    movePlayer(){
        let upDown = null
        let leftRight = null

        if(KeyPressed.up){
            upDown = Math.PI
        }
        if(KeyPressed.down){
            upDown = 0
        }
        if(KeyPressed.left){
            leftRight = Math.PI * 1.5
        }
        if(KeyPressed.right){
            leftRight = Math.PI / 2 
        }
        if(KeyPressed.jump){
            if(!this.doneJumping){
                this.jumpUp()
            }
        }

        //ustawienie rotacji modelu na podstawie jego ruchu
        if(upDown != null || leftRight != null){
            this.model.rotation.y = getRotation(upDown,leftRight)
            this.model.translateZ(2)
        }
    }

    

    jumpUp(){
            this.jumpVelocity += 3
            this.model.translateY(this.jumpVelocity)
            if(this.jumpVelocity > 10){
                this.doneJumping = true
                KeyPressed.jump = false
            }
                
    }
    fallDown(){
            if(this.jumpVelocity > -17){
            this.jumpVelocity -= 0.8
            }
            this.model.translateY(this.jumpVelocity)

            if(this.model.position.y < 0){
                this.model.position.y = 0
            }
    }
    //bierze model w formacie .fbx
    modelLoad(model = null){
        this.loader.load(test, (obj) =>{
            this.scene.add(obj)
            this.model= obj
            //placeholder albo nie XD
            this.model.rotation.y = Math.PI
            this.sceneObjects = this.scene.children
            this.model.position.set(0,500,0)
        })
    }

    checkFloor(){
        if(this.model){
            const ray = new Ray(this.model.position.clone().add(new Vector3(0,50,0)),new Vector3(0,-1,0))
            this.raycaster.ray = ray
            const intersects = this.raycaster.intersectObjects(this.sceneObjects)

            if(intersects[0]){
                if(intersects[0].distance < 55){
                    this.doneJumping = false
                    this.jumpVelocity = 0
                    if(this.corretion){
                       this.model.position.y += 50 - intersects[0].distance
       
                    }
                    this.corretion = false
                   }
                   else{

                       this.corretion = true
                       this.fallDown()
                   }
       }
            }
        }
        
   
}

function getRotation(...value){
    if((value[0] || value[0]==0) && value[1]){
        if(value[0]== 0 && value[1]==Math.PI*1.5){
            return (Math.PI *2  + Math.PI * 1.5) /2
        }else{
            return (value[0]+value[1])/2
        }
    }
    else if(value[0] || value[0] == 0){
        return value[0]
    } 
    else if(value[1]){
        return value [1]
    }

}