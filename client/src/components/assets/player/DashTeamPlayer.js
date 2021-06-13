import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import alberto from "../model/Alberto jump test.fbx"

import Animate from "./Animate"

export default class DashPlayerPlayer {
    constructor(scene) {
        this.scene = scene
        this.jumped = false
        this.running = false
        this.loader = new FBXLoader()
        this.mixer = null
        this.model = null
        this.init()
    }

    init() {
        this.loader.load(alberto, (obj) => {
            this.scene.add(obj)

            this.model = obj

            this.mixer = new Animate(this.model)


            this.model.position.set(0, 500, 0)
        })
    }
}