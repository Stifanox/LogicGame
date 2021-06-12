import { Mesh, BoxGeometry, MeshBasicMaterial, DoubleSide } from "three";

//TODO: Zrobić dynamiczne ustawianie danych dla pozycji oraz celling i floor
export default class Door extends Mesh{
    constructor(posX,posY,posZ,scene) {
        super(new BoxGeometry(500,500,30), new MeshBasicMaterial({color:0x523c02,side:DoubleSide}))
        this.scene = scene
        this.rotation.y = Math.PI /2
        this.position.set(50,250,100)
        this.scene.add(this)
        this.name = "Door"
        this.enable = false
        this.ceiling = 700
        this.floor =  250
    }

    changeDoorState(){
        if(!this.enable){
            if(this.position.y > this.floor){
                this.translateY(-2)
            }
        }
        else{
            if(this.position.y < this.ceiling){
                this.translateY(2)
            }
        }
    }

}