import {Scene,Vector3} from 'three';
import Renderer from './Renderer';
import Camera from './Camera';


export default class Main {
    constructor(container) {
        
        
        
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75,window.screen.width,window.screen.height);

        this.renderer.setClearColor(0xff00ff)
        this.render();

    }

    render() {
       

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }
}