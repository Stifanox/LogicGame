import { AnimationMixer, Clock } from "three"

export default class Animate{
    constructor(model) {
        this.model = model
        this.cloak = new Clock()
        this.needUpdate = true
        this.mixer = new AnimationMixer(this.model)

        this.runningPrev = false
        this.jumpingPrev = false
    }

    playAnim(animName){
        this.mixer.uncacheRoot(this.model)
        this.mixer.clipAction(animName).play()
    }

    update(){
        const delta = this.cloak.getDelta()
        this.mixer.update(delta)
    }

    checkAnim(running,jumping){
        if(this.runningPrev != running || this.jumpingPrev != jumping){
            this.needUpdate = true
            this.runningPrev = running
            this.jumpingPrev = jumping
        }
        if(this.needUpdate){
            if(running && jumping){
                this.playAnim("Armature|Jump")
            }
            else if(running){
                this.playAnim("Armature|Run")
            }
            else if(jumping){
                this.playAnim("Armature|Jump")
            }
            else if(!running && !jumping){
                this.playAnim("Armature|Idle")
            }
            this.needUpdate = false
        }
    }
}