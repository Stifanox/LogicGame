
/**
 * 
 * @param {number} posY 
 * @param {number} speed 
 * @param {number} ceiling 
 * @param {number} floor 
 * @param {Array} buttonBinded
 */
function doorLogic(posY,speed,ceiling,floor,buttonBinded){
    let newPosY = posY
    if(!buttonBinded.includes(true)){
        if(posY > floor){
            newPosY -= speed
        }
    }
    else{
        if(posY < ceiling){
            newPosY += speed
        }
    }
    
    return newPosY
}

module.exports = doorLogic