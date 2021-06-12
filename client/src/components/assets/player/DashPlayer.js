import Player from "./Player";
import KeyPressed from "./KeyPressed"
import alberto from "../model/Alberto jump test.fbx"
import Importer from "./Importer"


export default class DashPlayer extends Player {
    constructor(scene,playerHelper) {
        super(scene,playerHelper)

        this.blockDash = false
        this.dashDistance = 200
        this.initDash()
    }

    initDash() {
        if(!this.playerHelper){
            this.domElement.addEventListener("keydown", (e) => this.dash(e.keyCode))
        }
        this.modelLoad(alberto)
    }

    dash(code) {
        if (code == 16 && !this.blockDash && !this.blockMove) {

            if (KeyPressed.up) {
                const currentPosition = this.model.position.z
                this.blockDash = true
                new Promise((resolve, reject) => {
                    const n = setInterval(() => {
                        this.model.translateZ(10)
                        if (this.model.position.z < currentPosition - this.dashDistance || this.blockMove) {
                            resolve(true)
                            this.changeDashState()
                            clearInterval(n)
                        }
                    }, 5)

                })
            }

            if (KeyPressed.down) {
                const currentPosition = this.model.position.z
                this.blockDash = true
                new Promise((resolve, reject) => {
                    const n = setInterval(() => {
                        this.model.translateZ(10)
                        if (this.model.position.z > currentPosition + this.dashDistance || this.blockMove) {
                            clearInterval(n)
                            this.changeDashState()
                            resolve()
                        }
                    }, 5)
                })
            }
            if (KeyPressed.left) {
                const currentPosition = this.model.position.x
                this.blockDash = true
                new Promise((resolve, reject) => {
                    const n = setInterval(() => {
                        this.model.translateZ(10)
                        if (this.model.position.x < currentPosition - this.dashDistance || this.blockMove) {
                            clearInterval(n)
                            this.changeDashState()
                            resolve()
                        }
                    }, 5)
                })
            }
            if (KeyPressed.right) {
                const currentPosition = this.model.position.x
                this.blockDash = true
                new Promise((resolve, reject) => {
                    const n = setInterval(() => {
                        this.model.translateZ(10)
                        if (this.model.position.x > currentPosition + this.dashDistance || this.blockMove) {
                            clearInterval(n)
                            this.changeDashState()
                            resolve()
                        }
                    }, 5)
                })
            }


        }
    }

    changeDashState() {
        return new Promise((resolve, reject) => {
            if (this.blockDash && !this.inAir) {
                setTimeout(() => {
                    this.blockDash = false
                    resolve()
                }, 1000)
            }
            else {
                setTimeout(() => {
                    this.changeDashState()
                    resolve()
                }, 50)
            }

        })
    }
    updatePlayer() {
        if(this.box3){
            this.box3 = this.box3.copy(this.model.children[0].geometry.boundingBox).applyMatrix4(this.model.matrixWorld)
        }
        
        if(this.mixer){
            this.mixer.checkAnim(this.running,this.jumped)
            this.mixer.update()
        }
        this.movePlayer()
        this.checkFloor()
        this.checkWall()
    }

}