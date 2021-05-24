import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import keyMapper from "./KeyMapper"
import KeyPressed from './KeyPressed';

export default class Player{
    constructor(mesh,domElement) {
        this.jumpVelocity = 0
        this.doneJumping = false
        this.domElement = domElement
        this.mesh = mesh
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
            this.mesh.translateZ(-2)
        }
        if(KeyPressed.down){
            this.mesh.translateZ(2)
        }
        if(KeyPressed.left){
            this.mesh.translateX(-2)
        }
        if(KeyPressed.right){
            this.mesh.translateX(2)
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
            this.mesh.translateY(this.jumpVelocity)
            if(this.jumpVelocity > 4){
                this.doneJumping = true
            }
        
    }
    //TODO: w warunku z lini 98 dać żeby jump velocity było zmieniane na 0 w momencie jak wykryje podłogę 
    fallDown(){
            this.jumpVelocity -= 0.1
            if(this.jumpVelocity < -5){
                this.jumpVelocity = -5
            }
            this.mesh.translateY(this.jumpVelocity)
            if(this.mesh.position.y <= 26 ){
                this.doneJumping = false
                KeyPressed.jump = false
                this.jumpVelocity =0
            }
    }
}