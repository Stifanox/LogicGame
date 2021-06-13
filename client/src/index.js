import Main from "./components/Main"

function init() {
    //div
    const container = document.getElementById('root');
    const loadingText = document.getElementById("loading")
    const loadingScreen = document.getElementById("overlayer")
    const playerInfo = document.getElementById("playerinfo")
    //main class object
    new Main(container, loadingScreen, loadingText, playerInfo);
}

init();