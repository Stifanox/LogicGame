import { PerspectiveCamera, Vector3 } from 'three';


export default class Camera extends PerspectiveCamera {
    constructor(fov, width, height) {        
        super(fov, width / height, 0.1, 10000)    
        
        this.width = width
        this.height = height

        this.position.set(100,100,100)
        this.lookAt(0,0,0)

        this.updateSize();
        window.addEventListener('resize', () => this.updateSize(window.innerWidth,window.innerHeight), false);
        document.addEventListener('DOMContentLoaded', () => this.updateSize(window.innerWidth,window.innerHeight), false);
    }

    updateSize(width,heigth) {
        this.aspect = width / heigth
        this.updateProjectionMatrix();
    }


}