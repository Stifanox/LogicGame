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

import dataEmit from './shared/dataEmit';

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
        //FIXME: CZYSZCZENIE TABLICY NA SERWERZE
        this.instructions.forEach((object, id) => {
            switch (object.type) {
                case "platform":
                    platform = new Platform(...object.pos, object.size, this.scene, object.axis, this.player, object.move, object.color, object.floor, object.ceiling, id)
                    object.buttons.forEach(button => {
                        sbutton = new Button(...button.pos, this.scene, platform, this.player, this.teamPlayer, button.color)
                        this.buttons.push(sbutton)
                    })
                    this.platforms.push(platform)
                    break;
                case "door":
                    door = new Door(...object.pos, this.scene, object.color, object.speed, object.floor, object.ceiling, id)
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
        })
        this.spikes.forEach(spike => {
            this.scene.add(spike)
        })
        this.buttonWins.forEach(button => {
            this.scene.add(button)
        })
    }
    //Atkualnie poruszanie sie drzwi i platform dzieje się w pliku main wraz z pomocą socketów
    checkInRender() {
        // this.platforms.forEach(platform => {
        //     platform.move()
        // })
        // this.doors.forEach(door => {
        //     door.move()
        // })
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

    /**
     * 
     * @param {number} id 
     */
    getObjectById(id){
        const doorObject = this.doors.find(el => el.srvId == id)
        const platformObject = this.platforms.find(el => el.srvId == id)

        if (doorObject != undefined) return doorObject
        else if (platformObject != undefined) return platformObject

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

    getMovable() {
        return [...this.doors, ...this.platforms]
    }
}