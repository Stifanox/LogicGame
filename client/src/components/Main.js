import { Scene, Vector3, GridHelper, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide, AmbientLight, LoadingManager } from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import Floor from './floor/Floor'
import Box from './objects/Box'
import Wall from './objects/Wall'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import DashPlayer from './assets/player/DashPlayer'
import JumpPlayer from './assets/player/JumpPlayer'
import JumpTeamPlayer from './assets/player/JumpTeamPlayer'
import DashTeamPlayer from './assets/player/DashTeamPlayer'

import Spikes from './objects/Spikes';
import Platform from './objects/Platform';
import Button from "./objects/Button"
import Door from "./objects/Door"
import ButtonWin from "./objects/ButtonWin"

import connection from './shared/connectWithSocket'
import dataEmit from './shared/dataEmit'

import MapGenerator from './MapGenerator';


export default class Main {
    constructor(container, loadingScreen, loadingAnim, playerInfo) {
        //Divy z loadingiem
        this.loadingScreen = loadingScreen
        this.loadingAnim = loadingAnim
        this.playerInfo = playerInfo
        this.loading = true
        console.log("klasa", this.loadingAnim)
        let helpCounter = 0
        this.loadingAnimation = setInterval(() => {
            this.loadingAnim.innerText = "Loading in progress" + ".".repeat(helpCounter)
            console.log(helpCounter)
            if (helpCounter == 3) {
                helpCounter = 0
            } else {
                helpCounter++
            }
        }, 200)
        this.manager = new LoadingManager()
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75, window.screen.width, window.screen.height);

        //Zmienna do sprawdzenia czy oboje graczy się załadowało
        this.gameStart = false

        const gridHelper = new GridHelper(3000, 30);
        this.scene.add(gridHelper);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        //Wywołanie podłogi
        // this.floorInstructions = {
        //     size: "15x5",
        //     holes: true,
        //     holePos: ["6/1x12/5",],
        //     levelY: 0,
        // }
        // this.floorInstructions2 = {
        //     size: "15x5",
        //     holes: true,
        //     holePos: ["6/1x12/5",],
        //     levelY: 500,
        // }

        this.floorInstructions = [
            {
                size: "15x5",
                holes: true,
                holePos: ["6/1x12/5"],
                levelY: 0,
            },
            {
                size: "15x5",
                holes: true,
                holePos: ["6/1x12/5",],
                levelY: 500,
            },
            {
                size: "15x5",
                holes: false,
                holePos: ["6/1x12/5",],
                levelY: 1000,
            }
        ]

        // this.floor = new Floor(this.floorInstructions, this.camera, this.scene)

        // this.floor2 = new Floor(this.floorInstructions2, this.camera, this.scene)
        this.floorInstructions.forEach(floor => {
            new Floor(floor, this.scene)
        })

        this.walls = new Wall(this.floorInstructions[this.floorInstructions.length - 1], this.scene)

        let planeSize = this.floorInstructions[0].size.split("x")
        this.plane = new PlaneGeometry(parseInt(planeSize[0]) * 100, parseInt(planeSize[1]) * 100)
        this.planeMesh = new Mesh(this.plane, new MeshBasicMaterial({ color: 0x00fa00, side: DoubleSide }))
        this.planeMesh.rotation.x += Math.PI / 2
        this.scene.add(this.planeMesh)
        //propy boxów
        this.boxes = [
            // [x (tak jak podłoga), y (na czym ma leżeć box), z (tak jak podłoga), rozmiar w px, rotacja w czymkolwiek chcesz],
        ]

        this.boxes.forEach(box => {
            let kloc = new Box(...box)
            this.scene.add(kloc)
        })

        this.scene.add(new AmbientLight(0xffffff))

        this.platform = null

        this.renderer.setClearColor(0xffffff)

        this.objects = [
            {
                type: "platform",
                pos: [100, 50, 100],
                size: 1,
                axis: "X",
                color: 0xa4a4a4,
                move: true,
                ceiling: 150,
                floor: -150,
                buttons: [
                    {
                        pos: [-650, 50, -200],
                        color: 0xa4a4a4,
                    }
                ]
            },
            {
                type: "platform",
                pos: [-150, 50, -100],
                size: 1,
                axis: "Y",
                color: 0x181818,
                move: true,
                ceiling: 550,
                floor: 50,
                buttons: [
                    {
                        pos: [600, 50, 100],
                        color: 0x181818,
                    }
                ]
            },
            {
                type: "door",
                pos: [-300, 100, 0],
                color: 0xD9AE3B,
                ceiling: 700,
                floor: 300,
                speed: 5,
                buttons: [
                    {
                        pos: [-500, 50, -200],
                        color: 0xD9AE3B,
                    },
                    {
                        pos: [600, 50, -200],
                        color: 0xD9AE3B,
                    }
                ]
            },
            {
                type: "spikes",
                pos: [100, 0, 0],
            },
            {
                type: "win",
                pos: [-650, 550, -200],
                color: 0x34ff34
            }
        ]

        this.init();



    }
    //Wywołanie graczy zależne od responsa z serwera i przypisaanie socketu do zmiennej
    async init() {
        let playerId
        this.socket = await connection(playerId)

        this.scene.children.forEach(child => {
            if (child.name == "playerModel") {
                child.removeFromParent()
            }
        })
        switch (sessionStorage.getItem("player")) {
            case "1":
                this.playerInfo.innerText = "You are 1st player - Alberto"
                this.player = new DashPlayer(this.scene, this.manager, this.camera)
                this.teamPlayer = new JumpTeamPlayer(this.scene)
                this.mapgenerator = new MapGenerator(this.objects, this.player, this.teamPlayer, this.camera, this.scene)
                // this.platform = new Platform(100, 2, 100, 1, this.scene, "X", this.player, true)
                // this.platform2 = new Platform(-250, 2, -100, 1, this.scene, "Y", this.player, true)
                // this.button = new Button(-650, 50, -200, this.scene, this.platform, this.player, this.teamPlayer)
                // this.door = new Door(-300, 100, 0, this.scene)
                // this.button2 = new Button(-500, 50, -200, this.scene, this.door, this.player, this.teamPlayer)
                // this.button3 = new Button(600, 60, 100, this.scene, this.platform2, this.player, this.teamPlayer)
                // this.button4 = new Button(600, 50, -250, this.scene, this.door, this.player, this.teamPlayer)
                // this.spikes = new Spikes(100, 0, 0, this.scene, this.player)
                // this.buttonWin = new ButtonWin(-650, 550, -200, this.scene, this.player, this.teamPlayer)
                break;
            case "2":
                this.playerInfo.innerText = "You are 2nd player - Kate"
                this.player = new JumpPlayer(this.scene, this.manager, this.camera)
                this.teamPlayer = new DashTeamPlayer(this.scene)
                this.mapgenerator = new MapGenerator(this.objects, this.player, this.teamPlayer, this.camera, this.scene)
                // this.platform = new Platform(100, 2, 100, 1, this.scene, "X", this.player, true)
                // this.platform2 = new Platform(-250, 2, -150, 1, this.scene, "Y", this.player, true)
                // this.button = new Button(-650, 50, -200, this.scene, this.platform, this.player, this.teamPlayer)
                // this.door = new Door(-300, 100, 0, this.scene)
                // this.button2 = new Button(-500, 50, -200, this.scene, this.door, this.player, this.teamPlayer)
                // this.button3 = new Button(600, 60, 100, this.scene, this.platform2, this.player, this.teamPlayer)
                // this.button4 = new Button(600, 50, -250, this.scene, this.door, this.player, this.teamPlayer)
                // this.spikes = new Spikes(100, 0, 0, this.scene, this.player)
                // this.buttonWin = new ButtonWin(-650, 550, -200, this.scene, this.player, this.teamPlayer)
                break;
        }
        this.manager.onLoad = () => {
            if (sessionStorage.getItem("player") == "2") {
                dataEmit(this.socket, sessionStorage.getItem("player"), "joined")
            }
        }

        this.socket.on("gameStart", e => {
            this.loadingScreen.style.display = "none"
            clearInterval(this.loadingAnimation)
            this.gameStart = true
        })


        this.render();

    }

    render() {
        if (this.gameStart) {
            if (this.player.model)
                //Emitowanie i przyjmowanie danych o pozycji teammate'a i jego rotacji
                if (this.player.model) {
                    dataEmit(this.socket, { pos: this.player.model.position, rot: this.player.model.rotation.y, animations: [this.player.running, this.player.jumped] }, "position")
                }
            if (this.teamPlayer.model) {
                this.socket.on("position", (e) => {
                    this.teamPlayer.model.position.set(e.pos.x, e.pos.y, e.pos.z)
                    this.teamPlayer.model.rotation.y = e.rot
                    this.teamPlayer.mixer.checkAnim(e.animations[0], e.animations[1])
                })
                this.teamPlayer.mixer.update()
            }
            this.player.updatePlayer()
            this.teamPlayer.updateBox()

            //FIXME:TEMP
            // this.button.checkAction()
            // this.platform.move()

            // this.platform2.move()
            // this.button2.checkAction()
            // this.button3.checkAction()
            // this.button4.checkAction()
            // this.door.changeDoorState()
            // this.spikes.checkForCollision()
            // this.buttonWin.checkWin()
            //FIXME: TEMP

            this.mapgenerator.checkInRender()



            this.renderer.render(this.scene, this.camera);

        }

        requestAnimationFrame(this.render.bind(this));

    }
}