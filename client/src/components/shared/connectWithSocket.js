import { io } from '../../../node_modules/socket.io/client-dist/socket.io.js'

//funkcja do łączenia się z socketem i przydzielenia gracza do pokoju
export default function connection(id) {
    const socket = io('http://localhost:3000')
    return new Promise((resolve, reject) => {
        socket.on('connect', function () {
            fetch("http://localhost:3000/handleUser", {
                method: "GET",
            }).then(res => res.json()).then(res => {
                socket.emit('join', res.room)
                //res składa się z roomu, który jest id pokoju i tmpuser który jest numerem gracza czyli instrukcją do renderowania playerów
                socket.emit('player', res.tmpuser)
                resolve(socket)
            })
        })
    })

}