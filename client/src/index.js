import Main from "./components/Main"

function init() {
    //div
    const container = document.getElementById('root');
    const loadingText = document.getElementById("loading")
    const loadingScreen = document.getElementById("overlayer")
    const playerInfo = document.getElementById("playerinfo")
    const instructionDiv = document.getElementById("towin")
    const endLevelScreen = document.getElementById('endlevel')
    const endLevelBt = document.getElementById('nextlvl')
    const endLevelText = document.getElementById('text')
    const nextLevelCount = document.getElementById('playersReady')

    //main class object
    new Main(container, loadingScreen, loadingText, playerInfo, instructionDiv, endLevelScreen, endLevelText, endLevelBt, nextLevelCount);
}

init();