import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import keyMapper from "./KeyMapper"
import KeyPressed from './KeyPressed';
import test from "../model/rp_nathan_animated_003_walking.fbx"
import { Vector3 } from 'three';

/*
Klasa Player służąca jak podstawa do tworzenia graczy na planszy. 
Wykorzystuje modele FBX
*/

//TODO: raycaster wykrywający podłogę 
//TODO: raycaster wykrywa czy jest w powietrzu, jak jest to wtedy ustawia inAir na true jak nie to na false
//FIXME: usunąć zmianę zmiennej inAir na jump'ie po implementacji raycastera
//TODO: wykonywać obrót postaci w stronę którą idzie 

export default class Player{
    constructor(scene) {
        //inAir służy do sprawdzenia czy postać jest w powietrzu
        this.inAir = false
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
            this.jump()
        }

        if(upDown != null || leftRight != null){
            this.model.rotation.y = getRotation(upDown,leftRight)
            this.model.translateZ(2)
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
            this.inAir = true
            this.jumpVelocity += 3
            this.model.translateY(this.jumpVelocity)
            if(this.jumpVelocity > 10){
                this.doneJumping = true
            }
        
    }
    //TODO: w warunku z lini 104 dać żeby jump velocity było zmieniane na 0 w momencie jak wykryje podłogę 
    fallDown(){
            if(this.jumpVelocity > -5){
            this.jumpVelocity -= 0.8
            }
            this.model.translateY(this.jumpVelocity)
            if(this.model.position.y <= 0 ){
                this.inAir = false
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