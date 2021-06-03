const uniqid = require('uniqid')
const Room = require('./newRoom').Room

module.exports.handleUser = function (gameRooms, session) {
    if (gameRooms.length == 0) {
        let tempRoom = uniqid("room")
        let newRoom = new Room(tempRoom)
        newRoom.addPlayer()
        gameRooms.push(newRoom)
        session.room = tempRoom
        session.player = 1
    } else {
        if (gameRooms[gameRooms.length - 1].players < 2) {
            gameRooms[gameRooms.length - 1].addPlayer()
            session.room = gameRooms[gameRooms.length - 1].getId()
            session.player = 2
        } else {
            let tempRoom = uniqid("room")
            let newRoom = new Room(tempRoom)
            newRoom.addPlayer()
            gameRooms.push(newRoom)
            session.room = tempRoom
            session.player = 1
        }
    }
    return gameRooms[gameRooms.length - 1].players
}