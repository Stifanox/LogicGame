import { Box3, CylinderGeometry, Mesh, MeshBasicMaterial } from "three"

export default class Button extends Mesh {
    constructor(posX, posY, posZ, scene, player, teamPlayer, endLevelScreen, endLevelText, endLevelBt) {
        super(new CylinderGeometry(50, 50, 20, 30, 1), new MeshBasicMaterial({ color: 0xff0000 }))
        this.position.set(posX, posY, posZ)
        this.player = player
        this.teamPlayer = teamPlayer
        this.geometry.computeBoundingBox()
        this.box3 = new Box3()
        this.scene = scene
        this.scene.add(this)
        this.oneFrameDiffrence = false
        this.woned = false
        this.endLevelScreen = endLevelScreen
        this.endLevelText = endLevelText
        this.endLevelBt = endLevelBt
    }

    checkWin() {
        this.box3.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld)

        if (this.box3.intersectsBox(this.player.box3) && this.oneFrameDiffrence) {
            this.player.doesWin = true
        }
        else {
            this.player.doesWin = false
        }

        if (this.box3.intersectsBox(this.teamPlayer.box3) && this.oneFrameDiffrence) {
            this.teamPlayer.doesWin = true
        }
        else {
            this.teamPlayer.doesWin = false
        }

        if (this.teamPlayer.doesWin && this.player.doesWin) {
            if (!this.woned) {
                this.endLevelScreen.style.display = "flex"
                if (parseInt(sessionStorage.getItem("currentLevel")) < 3) {
                    this.endLevelText.innerText = "Congratulations, you've finished level " + sessionStorage.getItem("currentLevel")
                } else {
                    this.endLevelText.innerText = "Congratulations, you've finished a whole game.\n Play again if you want :D"
                    this.endLevelBt.innerText = "Restart game"
                }
                this.woned = true
            }
        }
        this.oneFrameDiffrence = true


    }

}