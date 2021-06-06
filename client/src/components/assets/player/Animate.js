import { AnimationMixer } from "three"

export default class Animate{
    constructor(model) {
        this.model = model

        this.mixer = new AnimationMixer(this.model)
    }

    playAnim(animName){
        this.mixer.uncacheRoot(this.model)
        this.mixer.clipAction(animName).play()
    }

    update(delta){
        this.mixer.update(delta)
    }
}