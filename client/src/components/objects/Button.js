import { Box3, CylinderGeometry, Mesh, MeshBasicMaterial } from "three"

export default class Button extends Mesh {
    constructor(posX, posY, posZ, scene, bindObject, player, teamPlayer, color) {
        super(new CylinderGeometry(50, 50, 20, 30, 1), new MeshBasicMaterial({ color: color }))
        this.position.set(posX, posY, posZ)
        this.x = posX
        this.player = player
        this.teamPlayer = teamPlayer
        this.geometry.computeBoundingBox()
        this.box3 = new Box3()
        this.bindObject = bindObject
        this.scene = scene
        this.state = null
        this.scene.add(this)

        if (this.bindObject.name == "Door") {
            this.state = false
            this.bindObject.addBind()
            this.bindIndex = this.bindObject.getBindIndex()
        }
    }

    checkAction() {
        this.box3.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld)

        switch (this.bindObject.name) {
            case "Platform":
                if (this.player.box3) {
                    if (this.box3.intersectsBox(this.player.box3) || this.box3.intersectsBox(this.teamPlayer.box3)) {
                        if (!this.bindObject.type) {
                            this.bindObject.setEnable(true)
                        }
                        else {
                            this.bindObject.setEnable(false)
                        }
                    } else {
                        if (!this.bindObject.type) {
                            this.bindObject.setEnable(false)
                        }
                        else {
                            this.bindObject.setEnable(true)
                        }
                    }
                }
                break

            case "Door":
                if (this.player.box3) {
                    if (this.box3.intersectsBox(this.player.box3) || this.box3.intersectsBox(this.teamPlayer.box3)) {
                        this.state = true
                    } else {
                        this.state = false
                    }
                    this.bindObject.setEnable(this.state, this.bindIndex)
                }
        }


    }

}