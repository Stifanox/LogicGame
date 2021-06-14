import { Mesh, BoxGeometry, MeshBasicMaterial, DoubleSide } from "three";

//TODO: Zrobić dynamiczne ustawianie danych dla pozycji oraz celling i floor
export default class Door extends Mesh{
    constructor(posX,posY,posZ,scene) {
        super(new BoxGeometry(500,500,30), new MeshBasicMaterial({color:0x523c02,side:DoubleSide}))
        this.scene = scene
        this.rotation.y = Math.PI /2
        this.position.set(posX,300,posZ)
        this.scene.add(this)
        this.name = "Door"
        this.ceiling = 700
        this.floor =  299
        this.buttonBinded = []
    }

    changeDoorState(){
        if(!this.buttonBinded.includes(true)){
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
    getEnable(){
        return this.enable
    }

    setEnable(enable,index){
        this.buttonBinded[index] = enable
    }

    addBind(){
        this.buttonBinded.push(false)
    }

    getBindIndex(){
        return this.buttonBinded.length-1
    }
}