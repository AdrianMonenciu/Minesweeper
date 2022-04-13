const rows = 8;
const columns = 8;
const minesCount = 10;

var board = [];
var minesLocation = []; // "2-2", "3-4", "2-1"
var tilesClicked = 0; //goal to click all tiles except the ones containing mines
var gameOver = false;

window.onload = function() {
    startGame();
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("reset-button").addEventListener("click", resetGame);
    setMines();
    //populate the board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            tile.oncontextmenu = function(e) {
                e.preventDefault();
                toggleFlag(tile);
            }
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function toggleFlag(tile) {
    if (gameOver || tile.classList.contains("tile-clicked")) {
        return;
    }
    if (tile.innerText == "") {
        tile.innerText = "🚩";
    }
    else if (tile.innerText == "🚩") {
        tile.innerText = "";
    }
}

function resetGame() {
    location.reload(); 
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }
    let tile = this;
    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        document.getElementById("mines-count").innerText = minesCount + ". You Lost!";
        return;
    }
    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkSurroundingMines(r, c);
}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkSurroundingMines(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;
    let minesFound = 0;
    //top 3
    minesFound += checkClickedTile(r-1, c-1);      //top left
    minesFound += checkClickedTile(r-1, c);        //top 
    minesFound += checkClickedTile(r-1, c+1);      //top right
    //left and right
    minesFound += checkClickedTile(r, c-1);        //left
    minesFound += checkClickedTile(r, c+1);        //right
    //bottom 3
    minesFound += checkClickedTile(r+1, c-1);      //bottom left
    minesFound += checkClickedTile(r+1, c);        //bottom 
    minesFound += checkClickedTile(r+1, c+1);      //bottom right
    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        //top 3
        checkSurroundingMines(r-1, c-1);    //top left
        checkSurroundingMines(r-1, c);      //top
        checkSurroundingMines(r-1, c+1);    //top right
        //left and right
        checkSurroundingMines(r, c-1);      //left
        checkSurroundingMines(r, c+1);      //right
        //bottom 3
        checkSurroundingMines(r+1, c-1);    //bottom left
        checkSurroundingMines(r+1, c);      //bottom
        checkSurroundingMines(r+1, c+1);    //bottom right
    }
    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared. You Won!";
        gameOver = true;
    }

}

function checkClickedTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}