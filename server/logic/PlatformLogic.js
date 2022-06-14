
/**
 * 
 * @param {number} posX 
 * @param {number} posZ 
 * @param {number} movingAxis 
 * @param {string} type 
 * @param {Array} bindingButtons 
 * @param {number} ceiling
 * @param {number} floor
 * @param {number} speed
 */
function platformLogic(posX,posZ,movingAxis,speed,ceiling,floor,bindingButtons,positive){
    let positiveState = positive
    let newPosX = posX
    let newPosZ = posZ
    
    if (!bindingButtons.includes(true)) return {x:newPosX,z:newPosZ}

    //TODO:naprawić osie aby poruszało się góra/dół
    if(movingAxis == "Y"){
        posZ > ceiling ? positiveState = true : null
        posZ < floor ? positiveState = false : null
        positive ? newPosZ += speed:newPosZ -= speed
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
    return {x:newPosX,z:newPosZ,positive:positiveState}
}

module.exports = platformLogic