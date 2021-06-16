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

        

        this.init();



    }
    //Wywołanie graczy zależne od responsa z serwera i przypisaanie socketu do zmiennej
    async init() {
        let playerId
        this.socket = await connection(playerId)

        if(!sessionStorage.getItem("currentLevel")){
            sessionStorage.setItem("currentLevel","1")
        }
        const temp = await fetch("http://localhost:3000/getBase",{method:"POST",
        headers:{"Content-type": "application/json"},
        body:JSON.stringify({level:parseInt(sessionStorage.getItem("currentLevel"))})
    })

        this.objectsToRender = await temp.json()
        console.log(this.objectsToRender);

        this.objectsToRender[0].floorInstructions.forEach(floor => {
            new Floor(floor, this.scene)
        })

        this.walls = new Wall(this.objectsToRender[0].floorInstructions[this.objectsToRender[0].floorInstructions.length - 1], this.scene)

        let planeSize = this.objectsToRender[0].floorInstructions[0].size.split("x")
        this.plane = new PlaneGeometry(parseInt(planeSize[0]) * 100, parseInt(planeSize[1]) * 100)
        this.planeMesh = new Mesh(this.plane, new MeshBasicMaterial({ color: 0x00fa00, side: DoubleSide }))
        this.planeMesh.rotation.x += Math.PI / 2
        this.scene.add(this.planeMesh)

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
                this.mapgenerator = new MapGenerator(this.objectsToRender[0].objects, this.player, this.teamPlayer, this.camera, this.scene)
                break;
            case "2":
                this.playerInfo.innerText = "You are 2nd player - Kate"
                this.player = new JumpPlayer(this.scene, this.manager, this.camera)
                this.teamPlayer = new DashTeamPlayer(this.scene)
                this.mapgenerator = new MapGenerator(this.objectsToRender[0].objects, this.player, this.teamPlayer, this.camera, this.scene)
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

            this.mapgenerator.checkInRender()

            this.renderer.render(this.scene, this.camera);

        }

        requestAnimationFrame(this.render.bind(this));

    }
}