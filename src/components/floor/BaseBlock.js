import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
    TextureLoader
} from 'three'

import BoxTexture from './../images/BasicBlock.png'

export default class BaseBlock extends Mesh {
    constructor(posX, posY, posZ, size) {
        super(new BoxGeometry(100 * size, 100, 100 * size), new MeshBasicMaterial({
            //FIXME: DoubleSide - może się dupcyć
            side: DoubleSide,
            map: new TextureLoader().load(BoxTexture),
            transparent: true,
            opacity: 1
        }))
        this.position.set(posX, posY, posZ)
    }
}