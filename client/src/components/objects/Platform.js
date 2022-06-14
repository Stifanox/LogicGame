import { Box3, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

//TODO:Zrobić dynamiczne ustawianie obiektów
export default class Platform extends Mesh {
    constructor(posX, posY, posZ, size, scene, movingAxis, player, type, color, floor, ceiling, id) {
        super(new PlaneGeometry(200 * size, 200 * size), new MeshBasicMaterial({ side: DoubleSide, color: color }))
        this.geometry.computeBoundingBox()
        this.player = player
        this.movingAxis = movingAxis
        this.type = type
        this.box3 = new Box3()
        this.player = player
        this.positive = true
        this.speed = 2
        this.rotation.x = Math.PI / 2
        this.position.set(posX, posY, posZ)
        scene.add(this)
        this.name = "Platform"
        this.floor = floor
        this.ceiling = ceiling
        this.buttonBinded = []
        this.srvId = id
        if (!this.type) {
            this.block = false
        }
        else {
            this.block = true
        }
    }

    move() {
        if (!this.block) {
            if (this.movingAxis == "Y") {
                if (this.position.y > this.ceiling) {
                    this.positive = true
                }

                if (this.position.y < this.floor) {
                    this.positive = false
                }

                if (this.positive) {
                    this.translateZ(this.speed)
                }
                else {
                    this.translateZ(-this.speed)
                }


                if (this.player.box3) {
                    if (this.box3.intersectsBox(this.player.box3)) {
                        this.positive ? this.player.model.position.y -= this.speed : this.player.model.position.y += this.speed
                    }
                }
            }
            //TODO:Ustawiać wartości w konstruktorze
            else if (this.movingAxis == "X") {
                this.position.x > this.ceiling ? this.positive = false : null;
                this.position.x < this.floor ? this.positive = true : null;
                if (this.positive) {
                    this.translateX(this.speed)
                }
                else {
                    this.translateX(-this.speed)
                }
                if (this.player.box3) {
                    if (this.box3.intersectsBox(this.player.box3)) {

                        this.positive ? this.player.model.position.x += this.speed : this.player.model.position.x -= this.speed
                    }
                }

            }
        }

        this.box3.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld)

        if (!this.type) {
            if (this.buttonBinded.includes(false)) {
                this.block = false
            } else {
                this.block = true
            }
        }
        else {
            if (this.buttonBinded.includes(true)) {
                this.block = false
            } else {
                this.block = true
            }
        }
    }


    setEnable(enable, index) {
        this.buttonBinded[index] = enable
    }

    addBind() {
        if (!this.type) {
            this.buttonBinded.push(true)
        }
        else {
            this.buttonBinded.push(false)
        }
    }

    getBindIndex() {
        return this.buttonBinded.length - 1
    }
}