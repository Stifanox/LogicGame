import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
    TextureLoader
} from 'three'

import BoxTexture from './../images/whiteBoxTexture.png'

export default class Box extends Mesh {
    constructor(posX, posY, posZ, size, rot) {
        super(new BoxGeometry(size, size, size), new MeshBasicMaterial({
            map: new TextureLoader().load(BoxTexture),
            transparent: true,
            opacity: 1
        }))
        this.rotation.y += rot
        this.position.set(posX, posY, posZ)
    }
}