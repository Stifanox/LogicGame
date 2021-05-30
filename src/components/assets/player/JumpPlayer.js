import Player from "./Player";

export default class JumpPlayer extends Player{
    constructor(scene) {
        super(scene)

        this.doubleJumpAvailable = true

        this.jumpInit()
    }


    jumpInit(){
        this.domElement.addEventListener("keydown", (e) => this.doubleJump(e.keyCode))
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
            if(!this.doubleJumpAvailable){
                setTimeout(() =>{
                    this.doubleJumpAvailable = true
                    resolve()
                },1000)
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
        this.movePlayer()
        this.doubleJump()
        this.checkFloor()
    }
}