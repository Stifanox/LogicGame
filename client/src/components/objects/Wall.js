import { BoxGeometry, Group, Mesh, MeshBasicMaterial, DoubleSide, TextureLoader } from "three";
import WallTexture from '../floor/textures/wall1.jpg'

//WALL WYWOLUJE SIE Z INSTRUKCJI SUFITU
export default class Wall extends Group {
    constructor(instructions, scene) {
        super()
        this.wallCount = 4
        this.instructions = instructions
        this.scene = scene
        this.size = this.instructions.size.split("x")

        this.init()
    }

    init() {
        this.posArray = [parseInt(this.size[1]), parseInt(this.size[0]), parseInt(this.size[1]), parseInt(this.size[0])]
        for (let i = 0; i < this.wallCount; i++) {
            let wall = new BoxGeometry(this.posArray[i] * 100, this.instructions.levelY, 5)
            let wallMesh = new Mesh(wall, new MeshBasicMaterial({
                map: new TextureLoader().load(WallTexture),
                transparent: true,
                opacity: 1
            }))
            switch (i) {
                case 0:
                    wallMesh.rotation.y -= Math.PI / 2 * 3
                    wallMesh.position.set(-(parseInt(this.size[0]) * 50), this.instructions.levelY / 2, 0)
                    break;
                case 1:
                    wallMesh.position.set(0, this.instructions.levelY / 2, -(parseInt(this.size[1]) * 50))
                    break;
                case 2:
                    wallMesh.rotation.y -= Math.PI / 2
                    wallMesh.position.set(parseInt(this.size[0]) * 50, this.instructions.levelY / 2, 0)
                    break;
                case 3:
                    wallMesh.visible = false
                    wallMesh.rotation.y -= Math.PI
                    wallMesh.position.set(0, this.instructions.levelY / 2, parseInt(this.size[1]) * 50)
                    break;
            }
            console.log(wallMesh)
            this.add(wallMesh)
        }
        this.addtoscene()
    }

    addtoscene() {
        this.scene.add(this)
    }
}