import { Scene, Vector3, GridHelper, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide, AmbientLight } from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import Floor from './floor/Floor'
import Box from './objects/Box'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import DashPlayer from './assets/player/DashPlayer'
import JumpPlayer from './assets/player/JumpPlayer'
import DashTeamPlayer from "./assets/player/DashTeamPlayer"
import JumpTeamPlayer from "./assets/player/JumpTeamPlayer"

import connection from './shared/connectWithSocket'
import dataEmit from './shared/dataEmit'

import Button from './objects/Button';
import Door from './objects/Door';
import Platform from './objects/Platform';

export default class Main {
    constructor(container) {
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75, window.screen.width, window.screen.height);

        const gridHelper = new GridHelper(3000, 30);
        this.scene.add(gridHelper);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        //Wywołanie podłogi
        this.floorInstructions = {
            size: "10x5",
            holes: true,
            holePos: ["5/3x5/5", "7/3x8/5"]
        }
        this.floor = new Floor(this.floorInstructions, this.camera, this.scene)

        //propy boxów
        this.boxes = [
            // [x (tak jak podłoga), y (na czym ma leżeć box), z (tak jak podłoga), rozmiar w px, rotacja w czymkolwiek chcesz],
            [1, 0, 1, 100, 1],
            [3, 70, 4, 100, 2],
            [1, 100, 1, 50, 0],
        ]

        this.boxes.forEach(box => {
            let kloc = new Box(...box)
            this.scene.add(kloc)
        })

        this.scene.add(new AmbientLight(0xffffff))

        this.plane = new PlaneGeometry(1000, 1000)
        this.planeMesh = new Mesh(this.plane, new MeshBasicMaterial({ color: 0x00fa00, side: DoubleSide }))
        this.planeMesh.rotation.x += Math.PI / 2
        this.scene.add(this.planeMesh)

        


        this.renderer.setClearColor(0xffffff)
        this.init();



    }
    //Wywołanie graczy zależne od responsa z serewera i przypisaanie socketu do zmiennej
    async init() {
        let playerId
        this.socket = await connection(playerId)
        this.socket.on('player', (e) => {
            switch (e) {
                case 1:
                    this.player = new DashPlayer(this.scene,false)
                    this.teamPlayer = new JumpTeamPlayer(this.scene,true)
                    this.door = new Door(1,2,3,this.scene)
                    this.button = new Button(3,2,1,this.scene,this.door,this.player)
                    break;
                case 2:
                    this.player = new JumpPlayer(this.scene,false)
                    this.teamPlayer = new DashTeamPlayer(this.scene)
                    this.door = new Door(1,2,3,this.scene)
                    this.button = new Button(3,2,1,this.scene,this.door,this.player)
                    break;
            }

            this.render();
        })

    }

    render() {
        //Emitowanie i przyjmowanie danych o pozycji teammate'a i jego rotacji
        if (this.player.model) {
            dataEmit(this.socket, { pos: this.player.model.position, rot: this.player.model.rotation.y })
        }
        if (this.teamPlayer.model) {
            this.socket.on("position", (e) => {
                this.teamPlayer.model.position.set(e.pos.x, e.pos.y, e.pos.z)
                this.teamPlayer.model.rotation.y = e.rot
               
            })
            this.teamPlayer.mixer.checkAnim(this.teamPlayer.running,this.teamPlayer.jumped)
            this.teamPlayer.mixer.update()
        }
        
        this.player.updatePlayer()
        this.button.checkAction()
        this.door.changeDoorState()
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }
}