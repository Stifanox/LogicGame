module.exports.Room = class {
    constructor(id) {
        this.id = id
        this.players = 0
    }

    addPlayer() {
        this.players++
    }

    getId() {
        return this.id
    }
}