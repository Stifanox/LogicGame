import { Box3, CylinderGeometry, Mesh, MeshBasicMaterial } from "three"

export default class Button extends Mesh{
    constructor(posX,posY,posZ,scene,bindObject,player) {
        super(new CylinderGeometry(50,50,20,30,1),new MeshBasicMaterial({color:0xff0000}))
        this.position.set(posX*100-50,posY*50+10,posZ*100-50)
        this.player = player
        this.geometry.computeBoundingBox()
        this.box3 = new Box3()
        this.bindObject = bindObject
        this.scene = scene

        this.scene.add(this)
    }

    checkAction(){
        this.box3.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld)

        switch(this.bindObject.name){
            case "Platform":
                if(this.player.box3){
                    if(this.box3.intersectsBox(this.player.box3)){
                        this.bindObject.enable = false
                    }else{
                        this.bindObject.enable = true
                    }
                }
            break

            case "Door":
                if(this.player.box3){
                    if(this.box3.intersectsBox(this.player.box3)){
                        this.bindObject.enable = true
                    }else{
                        this.bindObject.enable = false
                    }
                }
        }
        
        
    }

}