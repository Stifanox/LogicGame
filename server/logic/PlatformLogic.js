
/**
 * 
 * @param {number} posX 
 * @param {number} posY 
 * @param {number} movingAxis 
 * @param {string} type 
 * @param {Array} bindingButtons 
 * @param {number} ceiling
 * @param {number} floor
 * @param {number} speed
 */
function platformLogic(posX,posY,movingAxis,speed,ceiling,floor,bindingButtons,positive){
    let positiveState = positive
    let newPosX = posX
    let newPosY = posY
    
    if (!bindingButtons.includes(true)) return {x:newPosX,y:newPosY}

    //TODO:naprawić osie aby poruszało się góra/dół
    if(movingAxis == "Y"){
        posY > ceiling ? positiveState = false : null
        posY < floor ? positiveState = true : null
        
        if(positiveState){
             newPosY += speed
        }
        else{
            newPosY -= speed
        }
        
    }
    else if (movingAxis == "X"){
        posX > ceiling ? positiveState = false : null;
        posX < floor ? positiveState = true : null;
        if (positiveState) {
            newPosX += speed
        }
        else {
            newPosX -= speed
        }
    }
    return {x:newPosX,y:newPosY,positive:positiveState}
}

module.exports = platformLogic