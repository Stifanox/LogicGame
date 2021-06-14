export default function dataEmit(socket, data, name) {
    //Emitowanie danych do pokoju co render
    socket.emit(name, data)
}