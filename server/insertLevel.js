const Database = require('nedb')

var levels = new Database({
    filename: 'levels.db',
    autoload: true
});

const obj = {
    level:3,
    "floorInstructions": [
        {
            size: "25x5",
            holes: false,
            holePos: ["5/1x14/10"],
            levelY: 0,
        },
       
        {
            size: "25x5",
            holes: true,
            holePos: ["4/1x12/10"],
            levelY: 1000,
        },
    ],


    "objects":[
        {
         
             type: "door",
             pos: [-700, 100, 0],
             color: 0xD9AE3B,
             ceiling: 700,
             floor: 300,
             speed: 4,
             buttons: [
                 {
                     pos: [-400, 50, -100],
                     color: 0xD9AE3B,
                 },
                
             ]
         },
         {
         
             type: "door",
             pos: [0, 100, 0],
             color: 0x61f268,
             ceiling: 1000,
             floor: 300,
             speed: 2,
             buttons: [
                 {
                     pos: [-1100, 50, -100],
                     color: 0x61f268,
                 },
                 {
                     pos: [500, 50, 150],
                     color: 0x61f268,
                 },                   
             ]
         },
         {
         
             type: "door",
             pos: [1000, 100, 0],
             color: 0x646ef5,
             ceiling: 1200,
             floor: 300,
             speed: 1,
             buttons: [
                 {
                     pos: [-400, 50, 150],
                     color: 0x646ef5,
                 },
                
             ]
         },
         {
             type:"win",
             pos:[1100,100,0],
             color:0x34ff34
         }
     ]

}
function insertLevelIntoDatabase(){
levels.insert(obj,function(err,data){
    console.log("dodane");
})
}
module.exports =  insertLevelIntoDatabase