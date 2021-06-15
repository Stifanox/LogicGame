import {
    Group
} from 'three'

import BaseBlock from './BaseBlock'

export default class Floor extends Group {
    //instructions - object
    //{
    //  size: "10x5"
    //  levelY: "0"
    //  holes: true
    //  holePos: [ "5/3x5/5", etc.. ]
    //}
    constructor(instructions, scene) {
        super()
        this.instructions = instructions
        this.scene = scene
        this.boxes = []
        this.init(instructions)
    }

    init(instructions) {
        if (instructions.size) {
            this.coords = instructions.size.split("x")
            this.coords[0] = parseInt(this.coords[0])
            this.coords[1] = parseInt(this.coords[1])

            //Zmienne do wyśrodkowania podłogi na planszy
            this.offsetX = 50 - (this.coords[0] / 2) * 100
            this.offsetZ = 50 - (this.coords[1] / 2) * 100

            this.createFullArray(instructions)
        }
    }

    createFullArray(instructions) {
        for (let x = 0; x < this.coords[0]; x++) {
            let tempArray = []
            for (let z = 0; z < this.coords[1]; z++) {
                tempArray.push(1)
            }
            this.boxes.push(tempArray)
        }
        if (instructions.holes) {
            this.makeHoles(instructions)
        } else {
            this.collapseBoxes()
        }
    }

    makeHoles(instructions) {
        instructions.holePos.forEach(pos => {
            let corners = pos.split("x")
            let firstCorner = corners[0].split("/")
            let secondCorner = corners[1].split("/")
            for (let x = parseInt(firstCorner[0]); x <= parseInt(secondCorner[0]); x++) {
                for (let y = parseInt(firstCorner[1]); y <= parseInt(secondCorner[1]); y++) {
                    this.boxes[x - 1][y - 1] = 0
                }
            }
        })
        this.collapseBoxes()
    }

    collapseBoxes() {
        this.boxesToCreate = []
        let freeSpace
        let size
        for (let x = 0; x < this.coords[0]; x++) {
            for (let z = 0; z < this.coords[1]; z++) {
                if (this.boxes[x][z] == 1) {
                    size = 1
                    freeSpace = true
                    while (freeSpace) {
                        for (let i = size; i >= 0; i--) {
                            for (let j = size; j >= 0; j--) {
                                if (i == size || j == size) {
                                    if (this.boxes[x + i] == undefined || this.boxes[x + i][z + j] != 1) {
                                        this.boxesToCreate.push({ x: x, z: z, size: size })
                                        freeSpace = false
                                        break
                                    }
                                }
                            }
                            if (!freeSpace) {
                                break
                            }
                        }
                        for (let i = size - 1; i >= 0; i--) {
                            for (let j = size - 1; j >= 0; j--) {
                                this.boxes[x + i][z + j] = 2
                                this.boxes[x + i][z + j] = 2
                                this.boxes[x + i][z + j] = 2
                            }
                        }
                        size++
                    }
                }
            }
        }
        this.addBoxes()
    }

    addBoxes() {
        this.boxesToCreate.forEach(box => {
            let tempOffX = this.offsetX + (box.size - 1) * 50
            let tempOffZ = this.offsetZ + (box.size - 1) * 50
            this.add(new BaseBlock(tempOffX + (box.x * 100), this.instructions.levelY, tempOffZ + (box.z * 100), box.size))
        })
        this.scene.add(this)
    }
}