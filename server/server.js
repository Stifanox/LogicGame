const app = require('express')();
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
//const sharedsession = require('express-socket.io-session')
const cookieParser = require('cookie-parser')
app.use(cors())

//TODO: Naprawić sesje

var gameRooms = []
const handleUser = require('./components/handleUser').handleUser


app.use(cookieParser())

const sessionMiddleware = session({ secret: 'secret', saveUninitialized: true, resave: true })
app.use(sessionMiddleware)
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
})

//Wywołanie funkcji do przydzielania pokojów
app.get('/handleUser', function (req, res) {
    if (!req.session.room) {
        handleUser(gameRooms, req.session)
    }
    console.log(req.session.room)
    res.end(JSON.stringify({ room: req.session.room, tmpuser: req.session.player }))
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
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});