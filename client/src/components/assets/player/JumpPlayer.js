import Player from "./Player";
import astra from "../model/Kate animated.fbx"
import alberto from "../model/Alberto jump test.fbx"

export default class JumpPlayer extends Player {
    constructor(scene, manager, camera) {
        super(scene, manager, camera)

        this.doubleJumpAvailable = true

        this.jumpInit()
    }


    jumpInit() {
        this.domElement.addEventListener("keydown", (e) => this.doubleJump(e.keyCode))
        this.modelLoad(alberto)
    }

    doubleJump(code) {
        if (code == 32 && this.doubleJumpAvailable && this.jumped) {
            this.doneJumping = false
            this.jumpVelocity = 0
            this.doubleJumpAvailable = false
            this.changeDoubleJumpState()
        }
    }

    changeDoubleJumpState() {
        return new Promise((resolve, reject) => {
            //!this.correction służy aby określić czy jesteśmy na ziemi (dla tej metody)
            if (!this.doubleJumpAvailable && !this.corretion) {
                setTimeout(() => {
                    this.doubleJumpAvailable = true
                    resolve()
                }, 10)
            }
            else {
                setTimeout(() => {
                    this.changeDoubleJumpState()
                    resolve()
                }, 50)
            }

        })
    }

    updatePlayer(camera) {

        if (this.box3) {
            this.box3 = this.box3.copy(this.model.children[0].geometry.boundingBox).applyMatrix4(this.model.matrixWorld)
        }

        if (this.mixer) {
            this.mixer.checkAnim(this.running, this.jumped)
            this.mixer.update()
        }
        this.movePlayer(camera)
        this.checkFloor()
        this.checkWall()
        this.checkCelling()
        this.updateCam()
    }
}