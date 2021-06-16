import { io } from '../../../node_modules/socket.io/client-dist/socket.io.js'

//funkcja do łączenia się z socketem i przydzielenia gracza do pokoju
export default function connection(id) {
    const socket = io('/')
    return new Promise((resolve, reject) => {
        socket.on('connect', function () {
            console.log(sessionStorage)
            if (!sessionStorage.getItem('room')) {
                fetch("/handleUser", {
                    method: "GET",
                }).then(res => res.json()).then(res => {
                    sessionStorage.setItem("room", res.room)
                    sessionStorage.setItem("player", res.player)
                    socket.emit('join', res.room)
                    //res składa się z roomu, który jest id pokoju i tmpuser który jest numerem gracza czyli instrukcją do renderowania playerów
                    socket.emit('player', res.player)
                    resolve(socket)
                })
            } else {
                socket.emit('join', sessionStorage.getItem("room"))
                socket.emit('player', sessionStorage.getItem('player'))
                resolve(socket)
            }
        })
    })

}