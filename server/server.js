const express = require('express')
const app = express();
const http = require('http').Server(app);
const cors = require('cors')
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

//TODO: Naprawić sesje

var gameRooms = []
const handleUser = require('./components/handleUser').handleUser;
const { type } = require('os');


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
    socket.on('player', function (e) {
        socket.emit('player', e)
    })
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    socket.on('joined', function(e){
            socket.in(socket.request.session.room).emit('gameStart', true)
            socket.emit("gameStart",true)
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});