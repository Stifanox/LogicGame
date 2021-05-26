import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import keyMapper from "./KeyMapper"
import KeyPressed from './KeyPressed';
import test from "../model/rp_nathan_animated_003_walking.fbx"

export default class Player{
    constructor(scene) {
        this.scene = scene
        this.jumpVelocity = 0
        this.doneJumping = false
        this.domElement = window
        this.loader = new FBXLoader()
        this.model = null
        this.init()
    }

    init(){
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
        if(KeyPressed.up){
            this.model.translateZ(2)
        }
        if(KeyPressed.down){
            this.model.translateZ(-2)
        }
        if(KeyPressed.left){
            this.model.translateX(2)
        }
        if(KeyPressed.right){
            this.model.translateX(-2)
        }
        if(KeyPressed.jump){
            this.jump()
        }
    }

    jump(){
        if(!this.doneJumping){
           this.jumpUp()
        }else{
         this.fallDown()
        }
    }

    jumpUp(){
            this.jumpVelocity += 0.3
            this.model.translateY(this.jumpVelocity)
            if(this.jumpVelocity > 4){
                this.doneJumping = true
            }
        
    }
    //TODO: w warunku z lini 104 dać żeby jump velocity było zmieniane na 0 w momencie jak wykryje podłogę 
    fallDown(){
            if(this.jumpVelocity > -5){
            this.jumpVelocity -= 0.1
            }
            this.model.translateY(this.jumpVelocity)
            if(this.model.position.y <= 0 ){
                this.doneJumping = false
                KeyPressed.jump = false
                this.jumpVelocity =0
            }
    }

    modelLoad(model = null){
        this.loader.load(test, (obj) =>{
            this.scene.add(obj)
            this.model= obj
            //placeholder
            this.model.rotation.y = Math.PI
        })
    }
}