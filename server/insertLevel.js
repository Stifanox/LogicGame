const Database = require('nedb')

var levels = new Database({
    filename: 'levels.db',
    autoload: true
});

const obj = {
    floors: [
        {
            size: "15x5",
            holes: true,
            holePos: ["6/1x12/5",],
            levelY: 0,
        },
        {
            size: "15x5",
            holes: true,
            holePos: ["6/1x12/5",],
            levelY: 500,
        },
        {
            size: "15x5",
            holes: false,
            holePos: ["6/1x12/5",],
            levelY: 1000,
        }
    ]
}