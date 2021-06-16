import { Box3, BoxGeometry, ConeGeometry, Mesh, MeshBasicMaterial, Vector2, Vector3 } from "three"


export default class Spikes extends Mesh{
    constructor(posX,posY,posZ,scene,player,size,resX,resY,resZ) {
        super(new BoxGeometry(size,50,size), new MeshBasicMaterial({color:0xf23212,transparent:true,opacity:0.5}))

        this.player = player
        this.x= posX
        this.y= posY
        this.z= posZ
        this.resX = resX
        this.resY = resY
        this.resZ = resZ
        this.box3= new Box3()
        this.scene = scene
        this.init()
    }

    init(){
        this.geometry.computeBoundingBox()
        this.position.set(this.x,this.y,this.z)

        
        this.scene.add(this)

    }

    checkForCollision(){
        this.box3 = this.box3.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld)
        this.box3.expandByVector(new Vector3(-10,0,-10))
        if(this.player.box3){
        const intersect = this.box3.intersectsBox(this.player.box3)

        if(intersect){
           this.player.model.position.set(this.resX,this.resY,this.resZ)
        }
    }
    }
}