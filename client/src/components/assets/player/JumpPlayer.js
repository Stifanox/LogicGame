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
        this.movePlayer()
        this.doubleJump()
        this.checkFloor()
        this.checkWall()
    }
}