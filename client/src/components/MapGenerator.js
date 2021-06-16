import Renderer from './Renderer';
import Camera from './Camera';
import Floor from './floor/Floor'
import Box from './objects/Box'
import Wall from './objects/Wall'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Spikes from './objects/Spikes';
import Platform from './objects/Platform';
import Button from "./objects/Button"
import Door from "./objects/Door"
import ButtonWin from "./objects/ButtonWin"

export default class MapGenerator {
    constructor(instructions, player, teamPlayer, camera, scene, endLevelScreen, endLevelText, endLevelBt) {
        this.instructions = instructions
        this.player = player
        this.teamPlayer = teamPlayer
        this.camera = camera
        this.scene = scene

        this.endLevelScreen = endLevelScreen
        this.endLevelText = endLevelText
        this.endLevelBt = endLevelBt

        this.buttons = []
        this.platforms = []
        this.doors = []
        this.spikes = []
        this.buttonWins = []

        this.init()
    }

    init() {
        //Tworzenie obiektów wg określonych instrukcji
        //FIXME: W razie wprowadzenia nowych obiektów do levela, trzeba dopisać case w tym miejscu
        let sbutton
        let door
        let platform
        let winBt
        let spikes
        this.instructions.forEach(object => {
            switch (object.type) {
                case "platform":
                    platform = new Platform(...object.pos, object.size, this.scene, object.axis, this.player, object.move, object.color, object.floor, object.ceiling)
                    object.buttons.forEach(button => {
                        sbutton = new Button(...button.pos, this.scene, platform, this.player, this.teamPlayer, button.color)
                        this.buttons.push(sbutton)
                    })
                    this.platforms.push(platform)
                    break;
                case "door":
                    door = new Door(...object.pos, this.scene, object.color, object.speed, object.floor, object.ceiling)
                    object.buttons.forEach(button => {
                        sbutton = new Button(...button.pos, this.scene, door, this.player, this.teamPlayer, button.color)
                        this.buttons.push(sbutton)
                    })
                    this.doors.push(door)
                    break;
                case "win":
                    winBt = new ButtonWin(...object.pos, this.scene, this.player, this.teamPlayer, this.endLevelScreen, this.endLevelText, this.endLevelBt)
                    this.buttonWins.push(winBt)
                    break;
                case "spikes":
                    spikes = new Spikes(...object.pos, this.scene, this.player, object.size, ...object.respownPoint)
                    this.spikes.push(spikes)
                    break;
                case "camera":
                    this.camera.setBaseHeight(object.posY)
                    this.camera.position.y = object.posY

                    this.camera.lookAt(-600, 150, 150)
                    break;
            }
        })
        this.addtoscene()
    }

    addtoscene() {
        this.platforms.forEach(platform => {
            this.scene.add(platform)
        })
        this.doors.forEach(door => {
            this.scene.add(door)
        })
        this.buttons.forEach(button => {
            this.scene.add(button)
            console.log(button.position)
        })
        this.spikes.forEach(spike => {
            this.scene.add(spike)
        })
        this.buttonWins.forEach(button => {
            this.scene.add(button)
        })
    }

    checkInRender() {
        this.platforms.forEach(platform => {
            platform.move()
        })
        this.doors.forEach(door => {
            door.changeDoorState()
        })
        this.buttons.forEach(button => {
            button.checkAction()
        })
        this.spikes.forEach(spike => {
            spike.checkForCollision()
        })
        this.buttonWins.forEach(button => {
            button.checkWin()
        })
    }

    getButtons() {
        return this.buttons
    }

    getPlatforms() {
        return this.platforms
    }

    getDoors() {
        return this.doors
    }

    getSpikes() {
        return this.spikes
    }

    getWinButton() {
        return this.buttonWins
    }
}