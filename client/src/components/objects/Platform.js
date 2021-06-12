import { Box3, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export default class Platform extends Mesh{
    constructor(posX,posY,posZ,size,scene,movingAxis,player) {
        super(new PlaneGeometry(200*size,200*size),new MeshBasicMaterial({side:DoubleSide,color:0xf2a3d4}))
        this.geometry.computeBoundingBox()

        this.enable = true
        this.player = player
        this.movingAxis = movingAxis
        this.box3 = new Box3()
        this.player = player
        this.positive = true
        this.speed = 2
        this.rotation.x = Math.PI /2
        this.position.set(posX*100 - 50, posY * 50,posZ *100 - 50)
        scene.add(this)
        this.name = "Platform"
    }

    move(){
        if(!this.enable){
            return 0
        }

        if(this.movingAxis == "Y"){
            this.position.y > 100 ? this.positive = true : null;
            this.position.y < 0 ? this.positive = false : null;
    
            if(this.positive){
                this.translateZ(this.speed)
            }
            else{
                this.translateZ(-this.speed)
            }
    
    
            if(this.player.box3){
                if(this.box3.intersectsBox(this.player.box3)){
                   this.positive ? this.player.model.position.y -= this.speed: this.player.model.position.y += this.speed
                }   
            }
        }
        else if (this.movingAxis == "X"){
            this.position.x > 300 ? this.positive = false : null;
            this.position.x < -200 ? this.positive = true : null;

            if(this.positive){
                this.translateX(this.speed)
            }
            else{
                this.translateX(-this.speed)
            }
            if(this.player.box3){
                if(this.box3.intersectsBox(this.player.box3)){
                    
                   this.positive ? this.player.model.position.x += this.speed: this.player.model.position.x -= this.speed
                }   
            }

        }
        this.box3.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld)
        
    }
}