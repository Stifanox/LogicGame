import Player from "./Player";
import KeyPressed from "./KeyPressed"

export default class DashPlayer extends Player{
    constructor(scene){
        super(scene)

        this.initDash()
    }

    initDash(){
        this.domElement.addEventListener("keydown", (e) => this.dash(e.keyCode))
    }

    //FIXME: Może się dupcyć później ze stroną świata naprawić
    dash(code){
       if(code == 17){
           console.log("przycisk");
        if(KeyPressed.up){
            const currentPosition = this.model.position.z
            new Promise((resolve, reject) =>{
                const n = setInterval(() =>{
                    this.model.translateZ(10)
                    if(this.model.position.z < currentPosition -150){
                        resolve(true)
                        clearInterval(n)
                    }
                },5)
                
            })
        }
        
        if(KeyPressed.down){
            const currentPosition = this.model.position.z
            new Promise((resolve, reject) =>{
                const n = setInterval(() =>{
                    this.model.translateZ(-10)
                    if(this.model.position.z > currentPosition +150){
                        clearInterval(n)
                        resolve()
                    }
                },5)
            })
        }
        if(KeyPressed.left){
            const currentPosition = this.model.position.x
            new Promise((resolve, reject) =>{
                const n = setInterval(() =>{
                    this.model.translateX(10)
                    if(this.model.position.x < currentPosition -150){
                        clearInterval(n)
                        resolve()
                    }
                },5)
            })
        }
        if(KeyPressed.right){
            const currentPosition = this.model.position.x
            new Promise((resolve, reject) =>{
                const n = setInterval(() =>{
                    this.model.translateX(-10)
                    if(this.model.position.x > currentPosition +150){
                        clearInterval(n)
                        resolve()
                    }
                },5)
            })
        }

       console.log("działa po");

       }
    }

    moveCheck(){
        this.movePlayer()
        this.dash()
    }

}