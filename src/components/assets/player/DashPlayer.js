import Player from "./Player";
import KeyPressed from "./KeyPressed"

export default class DashPlayer extends Player{
    constructor(scene){
        super(scene)

        this.blockDash = false

        this.initDash()
    }

    initDash(){
        this.domElement.addEventListener("keydown", (e) => this.dash(e.keyCode))
    }

    //FIXME: Może się dupcyć później ze stroną świata naprawić
    dash(code){
       if(code == 17 && !this.blockDash){
       
        if(KeyPressed.up){
            const currentPosition = this.model.position.z
            this.blockDash = true
            new Promise((resolve, reject) =>{
                const n = setInterval(() =>{
                    this.model.translateZ(10)
                    if(this.model.position.z < currentPosition -150){
                        resolve(true)
                        this.changeDashState()
                        clearInterval(n)
                    }
                },5)
                
            })
        }
        
        if(KeyPressed.down){
            const currentPosition = this.model.position.z
            this.blockDash = true
            new Promise((resolve, reject) =>{
                const n = setInterval(() =>{
                    this.model.translateZ(10)
                    if(this.model.position.z > currentPosition +150){
                        clearInterval(n)
                        this.changeDashState()
                        resolve()
                    }
                },5)
            })
        }
        if(KeyPressed.left){
            const currentPosition = this.model.position.x
            this.blockDash = true
            new Promise((resolve, reject) =>{
                const n = setInterval(() =>{
                    this.model.translateZ(10)
                    if(this.model.position.x < currentPosition - 150){
                        clearInterval(n)
                        this.changeDashState()
                        resolve()
                    }
                },5)
            })
        }
        if(KeyPressed.right){
            const currentPosition = this.model.position.x
            this.blockDash = true
            new Promise((resolve, reject) =>{
                const n = setInterval(() =>{
                    this.model.translateZ(10)
                    if(this.model.position.x > currentPosition + 150){
                        clearInterval(n)
                        this.changeDashState()
                        resolve()
                    }
                },5)
            })
        }


       }
    }

    changeDashState(){
        return new Promise((resolve,reject) =>{
            if(this.blockDash && !this.inAir){
                setTimeout(() =>{
                    this.blockDash = false
                    resolve()
                },1000)
            }
            else{
                setTimeout(()=>{
                    this.changeDashState()
                    resolve()
                },50)
            }
            
        })
    }
    updatePlayer(){
        this.movePlayer()
        this.dash()
        this.checkFloor()
    }

}