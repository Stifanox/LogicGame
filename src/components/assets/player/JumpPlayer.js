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
    
    //zakłada że pierwszy skok się wykonał
    doubleJump(code){
        if(code == 32 && this.doubleJumpAvailable){
            if(this.inAir){
               this.doubleJumpAvailable = false 
               this.changeDoubleJumpState()
            }
            this.jumpVelocity = 0
            this.doneJumping = false
        }
    }

    changeDoubleJumpState(){
        return new Promise((resolve,reject) =>{
            if(!this.doubleJumpAvailable && !this.inAir){
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
        // this.checkFloor()
    }
}