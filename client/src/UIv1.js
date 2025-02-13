import { UI_BUILDER } from "./Ui.js";

export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.drawBoard = (board) => {

    console.log("dsadasd");
    console.log(board);
    if (board !== undefined) {
        console.log(board);
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        
        base.style.gridTemplateColumns = `repeat(${board.length}, 100px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 100px)`;
        board.forEach(element => element.forEach((element) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            if (element === 5) tile.classList.add("bush");
            if (element === 1) tile.classList.add("player");
            base.appendChild(tile);
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
        }));
    }
}

UIv1.showButtons = () => {
    const base = document.getElementById("buttons-container");
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const rotateButton = document.createElement("button");
    rotateButton.innerText = "Girar";
    rotateButton.onclick = () => {
     
    };

    const moveButton = document.createElement("button");
    moveButton.innerText = "Avanzar";
    moveButton.onclick = () => {
        
    };

    const killButton = document.createElement("button");
    killButton.innerText = "Matar";
    killButton.onclick = () => {
        
    };

    buttonsContainer.appendChild(rotateButton);
    buttonsContainer.appendChild(moveButton);
    buttonsContainer.appendChild(killButton);
    base.appendChild(buttonsContainer);
}

UIv1.drawBoard();

