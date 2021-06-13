import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    DoubleSide,
    TextureLoader
} from 'three'

import BoxTexture1 from './textures/txt1.png'
import BoxTexture2 from './textures/txt2.png'
import BoxTexture3 from './textures/txt3.png'
import BoxTexture4 from './textures/txt4.png'
import BoxTexture5 from './textures/txt5.png'
import BoxTexture6 from './textures/txt6.png'
import BoxTexture7 from './textures/txt7.png'
const txtrs = [BoxTexture1, BoxTexture2, BoxTexture3, BoxTexture4, BoxTexture5, BoxTexture6, BoxTexture7]

export default class BaseBlock extends Mesh {
    constructor(posX, posY, posZ, size) {
        let nr = Math.floor(Math.random() * 7)
        super(new BoxGeometry(100 * size, 100, 100 * size), new MeshBasicMaterial({
            //FIXME: DoubleSide - może się dupcyć
            side: DoubleSide,
            map: new TextureLoader().load(BoxTexture5),
            transparent: true,
            opacity: 1
        }))
        this.position.set(posX, posY, posZ)
    }
}