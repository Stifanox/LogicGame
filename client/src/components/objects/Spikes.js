import { Box3, BoxGeometry, ConeGeometry, Mesh, MeshBasicMaterial, Vector2, Vector3 } from "three"


export default class Spikes extends Mesh{
    constructor(posX,posY,posZ,scene,player) {
        super(new BoxGeometry(700,50,500), new MeshBasicMaterial({color:0xf23212,transparent:true,opacity:0.5}))

        this.player = player
        this.coneDimensions = [30,this.geometry.parameters.height,30]
        this.x= posX
        this.y= posY
        this.z= posZ
        this.box3= new Box3()
        this.scene = scene
        this.init()
    }

    init(){
        this.geometry.computeBoundingBox()
        this.position.set(this.x,this.y,this.z)

        for(let i=1; i<4; i++){
            for(let j=1; j<4; j++){
                const cone = new Mesh(new ConeGeometry(...this.coneDimensions))
             this.children.push(cone)

             cone.position.set(-70+this.position.x+j*30,this.position.y,-60+this.position.z+i*30)
            }
     }
        this.scene.add(this)

    }

    checkForCollision(){
        this.box3 = this.box3.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld)
        this.box3.expandByVector(new Vector3(-10,0,-10))
        if(this.player.box3){
        const intersect = this.box3.intersectsBox(this.player.box3)

        if(intersect){
           this.player.model.position.set(-600,150,150)
        }
    }
    }
}