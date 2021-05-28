import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
    TextureLoader
} from 'three'

import BoxTexture from './../images/whiteBoxTexture.png'

export default class Box extends Mesh {
    constructor(posX, posY, posZ, size, rot = 0) {
        super(new BoxGeometry(size, size, size), new MeshBasicMaterial({
            map: new TextureLoader().load(BoxTexture),
            transparent: true,
            opacity: 1
        }))
        this.rotation.y += rot
        this.position.set((posX * 100) - 50, posY+50+size/2, posZ * 100-50)
    }
}