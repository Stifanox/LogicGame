const uniqid = require('uniqid')
const Room = require('./newRoom').Room

module.exports.handleUser = function (gameRooms) {
    let result = {}
    if (gameRooms.length == 0) {
        let tempRoom = uniqid("room")
        let newRoom = new Room(tempRoom)
        newRoom.addPlayer()
        gameRooms.push(newRoom)
        result.room = tempRoom
        result.player = 1
    } else {
        if (gameRooms[gameRooms.length - 1].players < 2) {
            gameRooms[gameRooms.length - 1].addPlayer()
            result.room = gameRooms[gameRooms.length - 1].getId()
            result.player = 2
        } else {
            let tempRoom = uniqid("room")
            let newRoom = new Room(tempRoom)
            newRoom.addPlayer()
            gameRooms.push(newRoom)
            result.room = tempRoom
            result.player = 1
        }
    }
    return result
}