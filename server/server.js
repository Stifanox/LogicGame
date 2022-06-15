const express = require('express')
const app = express();
const http = require('http').Server(app);
const cors = require('cors')
const Database = require('nedb')
const io = require('socket.io')(http,
    {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"]
        }
    });
const session = require('express-session')
const cookieParser = require('cookie-parser')
app.use(cors())
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json())

const port = process.env.PORT || 3000
const insertLevel = require("./insertLevel")

//TODO: Naprawić sesje
var levels = new Database({
    filename: 'levels.db',
    autoload: true
});


var gameRooms = []
const handleUser = require('./components/handleUser').handleUser;
const { type } = require('os');
const insertLevelIntoDatabase = require('./insertLevel');
const doorLogic = require('./logic/DoorLogic');
const platformLogic = require('./logic/PlatformLogic');


app.use(cookieParser())

const sessionMiddleware = session({ secret: 'sheeesh', saveUninitialized: true, resave: true })
app.use(sessionMiddleware)
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
})

app.use(express.static("dist"))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html")
})

//Wywołanie funkcji do przydzielania pokojów
app.get('/handleUser', function (req, res) {
    const data = handleUser(gameRooms)
    res.end(JSON.stringify(data))
})

app.post("/getBase", function (req, res) {
    levels.find({ level: req.body.level }, function (err, docs) {
        res.end(JSON.stringify(docs))
    })
})


//Cały socket
io.on('connection', function (socket) {
    socket.on('join', function (room) {
        socket.join(room)
        socket.request.session.room = room
        console.log('Jesteś w pokoju', room)
        console.log(socket.rooms)

    });
    socket.on('position', function (e) {
        socket.in(socket.request.session.room).emit('position', e)
    });
    socket.on('map-objects', function (e) {
        const moveableObjects = e
        const newMoveableObjects = []
        moveableObjects.objects.forEach((object,index) =>{
            if (object.name == "Door"){
                const newPosForDoor = doorLogic(
                    object.pos.y,
                    object.speed,
                    object.ceiling,
                    object.floor,
                    object.buttonBinded
                )
                const newObject = {...object}
                newObject.pos.y = newPosForDoor
                newMoveableObjects.push(newObject)
            }
            else if(object.name == "Platform"){
                const newPositions = platformLogic(
                    object.pos.x,
                    object.pos.y,
                    object.movingAxis,
                    object.speed,
                    object.ceiling,
                    object.floor,
                    object.buttonBinded,
                    object.positive
                )
                const newObject = {...object}
                newObject.pos.y = newPositions.y
                newObject.pos.x = newPositions.x
                newObject.positive = newPositions.positive
                
                newMoveableObjects.push(newObject)
            }
        })
        // socket.in(socket.request.session.room).emit('new-map-objects',{objects:newMoveableObjects})
        io.in(socket.request.session.room).emit('new-map-objects',{objects:newMoveableObjects})
        // socket.emit()
    })
    socket.on('player', function (e) {
        socket.emit('player', e)
    })
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    socket.on('joined', function (e) {
        socket.in(socket.request.session.room).emit('gameStart', true)
        socket.emit("gameStart", true)
    });
    socket.on("playerReady", function (e) {
        socket.in(socket.request.session.room).emit('playerReady', true)
        socket.emit("playerReady", true)
    });
    socket.on("changeLevel", function (e) {
        socket.in(socket.request.session.room).emit('changeLevel', e)
    })
});


http.listen(port, function () {
    console.log('Server running');
});