import { Box3 } from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import alberto from "../model/Alberto jump test.fbx"
import astra from "../model/Kate animated.fbx"
import Animate from "./Animate"

export default class DashPlayerPlayer {
    constructor(scene) {
        this.scene = scene
        this.jumped = false
        this.running = false
        this.loader = new FBXLoader()
        this.mixer = null
        this.model = null
        this.box3 = new Box3()
        this.init()
    }

    init() {
        this.loader.load(astra, (obj) => {
            this.scene.add(obj)

            this.model = obj

            this.mixer = new Animate(this.model)
            this.model.children[0].material[1].alphaMap = null
            this.model.children[0].geometry.computeBoundingBox()
            this.box3 = this.box3.copy(this.model.children[0].geometry.boundingBox).applyMatrix4(this.model.matrixWorld)
            this.model.position.set(2000, 100, 150)
        })
    }

    updateBox() {
        if (this.model) {
            this.box3 = this.box3.copy(this.model.children[0].geometry.boundingBox).applyMatrix4(this.model.matrixWorld)
        }
    }
}