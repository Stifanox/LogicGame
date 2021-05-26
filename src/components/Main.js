import { Scene, Vector3, GridHelper } from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import Floor from './floor/Floor'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


export default class Main {
    constructor(container) {



        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75, window.screen.width, window.screen.height);

        const gridHelper = new GridHelper(3000, 30);
        this.scene.add(gridHelper);

        //const controls = new OrbitControls(this.camera, this.renderer.domElement);

        //Wywołanie podłogi
        this.floorInstructions = {
            size: "10x12",
            holes: true,
            holePos: ["5/3x5/5", "7/3x8/5"]
        }
        this.floor = new Floor(this.floorInstructions, this.camera)
        this.scene.add(this.floor)

        this.renderer.setClearColor(0xffffff)
        this.render();

    }

    render() {


        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }
}