import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import astra from "../model/Kate animated.fbx"
import Animate from "./Animate"

export default class JumpPlayerPlayer{
    constructor(scene) {
        this.scene =scene
        this.jumped = false
        this.running = false
        this.loader = new FBXLoader()
        this.mixer = null
        this.model = null
        this.init()
    }

    init(){
        this.loader.load(astra, (obj) =>{
            this.scene.add(obj)

            this.model= obj
            this.model.children[0].material[1].alphaMap = null
            this.mixer = new Animate(this.model)


            this.model.position.set(0,500,0)
        })
    }
}