import { Box3, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";

export default class PlayerSwap extends Mesh {
    constructor(scene) {
        super(new SphereGeometry(50, 8, 6), new MeshBasicMaterial({ color: 0xff0000 }))
        this.scene = scene
        this.position.set(-300, 100, 0)
        this.scene.add(this)
        this.name = "Swap"
        this.geometry.computeBoundingBox()
        this.box3 = new Box3()
        this.getNewBox3 = true
    }

    checkForSwap(player, teamPlayer) {
        if (this.getNewBox3) {
            this.box3 = this.box3.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld)
        }


        if (this.getNewBox3) {
            if (this.box3.intersectsBox(player.box3)) {
                this.scene.remove(this)
                this.getNewBox3 = false

                const playerPos = new Vector3().copy(player.model.position)
                const teamPlayerPos = new Vector3().copy(teamPlayer.model.position)


                player.model.position.set(teamPlayerPos.x, teamPlayerPos.y, teamPlayerPos.z)

                console.log(player.model.position, playerPos, teamPlayerPos);

                teamPlayer.model.position.set(playerPos.x, playerPos.y, playerPos.z)


                setTimeout(() => {
                    this.getNewBox3 = true
                    this.scene.add(this)
                }, 5000)
            }
        }

    }
}