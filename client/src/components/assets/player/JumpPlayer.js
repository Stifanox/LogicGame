import Player from "./Player";
import astra from "../model/Kate animated.fbx"

export default class JumpPlayer extends Player{
    constructor(scene,playerHelper) {
        super(scene,playerHelper)

        this.doubleJumpAvailable = true

        this.jumpInit()
    }


    jumpInit(){
        if(!this.playerHelper){
            this.domElement.addEventListener("keydown", (e) => this.doubleJump(e.keyCode))
        }
        this.modelLoad(astra)
    }
    
    doubleJump(code){
        if(code == 32 && this.doubleJumpAvailable && this.jumped){
                this.doneJumping = false
                this.jumpVelocity = 0
                this.doubleJumpAvailable = false 
                this.changeDoubleJumpState()
        }
    }

    changeDoubleJumpState(){
        return new Promise((resolve,reject) =>{
            //!this.correction służy aby określić czy jesteśmy na ziemi (dla tej metody)
            if(!this.doubleJumpAvailable && !this.corretion){
                setTimeout(() =>{
                    this.doubleJumpAvailable = true
                    resolve()
                },10)
            }
            else{
                setTimeout(()=>{
                    this.changeDoubleJumpState()
                    resolve()
                },50)
            }
            
        })
    }

    updatePlayer(){
        
        if(this.box3){
            this.box3 = this.box3.copy(this.model.children[0].geometry.boundingBox).applyMatrix4(this.model.matrixWorld)
        }
        const delta = this.clock.getDelta()
if(this.mixer){
    this.mixer.update(delta)

}
        this.movePlayer()
        this.checkFloor()
        this.checkWall()
    }
}