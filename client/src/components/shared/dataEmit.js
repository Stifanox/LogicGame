export default function dataEmit(socket, data) {
    //Emitowanie danych do pokoju co render
    socket.emit("position", data)
}