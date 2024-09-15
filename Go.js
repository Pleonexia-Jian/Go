const COLORS = ["transparent", "black", "white"];
let board = [];
let boardStates = new Set();
let selfCapture = true;

const sizeMap = new Map([
    [5, 580],
    [9, 630],
    [13, 650],
    [19, 665]
])
let turn = 0;

let boardSize = 0;

//===================================UI METHODS===========================================//

const hover = (turn, id) => {
    const stone = document.getElementById("s" + id);
    if (board[id[0]][id[1]] == 0) {
        stone.style.background = COLORS[(turn % 2) + 1];
        stone.style.opacity = 0.5;
    }
}

const hoverLeave = (id) => {
    const stone = document.getElementById("s" + id);
    if (board[id[0]][id[1]] == 0) {
        stone.style.background = COLORS[0];
        stone.style.opacity = 1;
    }
}

const passTurn = () => {
    turn += 1;
}
//===================================HELPER FUNCTIONS======================================//

const boardToString = (board) => {
    let boardString = "";
    for (const column of board) {
        for (const position of column) {
            boardString += position.toString();
        }
    }
    return boardString;
}

const idToString = (id) => {
    return (id[0] + "," + id[1]);
}

const fetchNeighbors = (id, color) => {
    let neighbors = [];
    let foundEmpty = false;
    if (id[0] > 0) {
        const leftID = [id[0] - 1, id[1]];
        const leftState = board[leftID[0]][leftID[1]];
        if (leftState == color) {
            neighbors.push(leftID);
        }
        else if (leftState == 0) {
            foundEmpty = true;
        }
    }
    if (id[1] > 0) {
        const upID = [id[0], id[1] - 1];
        const upState = board[upID[0]][upID[1]];
        if (upState == color) {
            neighbors.push(upID);
        }
        else if (upState == 0) {
            foundEmpty = true;
        }
    }
    if (id[0] < boardSize - 1) {
        const rightID = [id[0] + 1, id[1]];
        const rightState = board[rightID[0]][rightID[1]];
        if (rightState == color) {
            neighbors.push(rightID);
        }
        else if (rightState == 0) {
            foundEmpty = true;
        }
    }
    if (id[1] < boardSize - 1) {
        const downID = [id[0], id[1] + 1];
        const downState = board[downID[0]][downID[1]];
        if (downState == color) {
            neighbors.push(downID);
        }
        else if (downState == 0) {
            foundEmpty = true;
        }
    }
    return {
        foundEmpty: foundEmpty,
        neighbors: neighbors
    }
}

//try BFS first as long chain not as likely?
const selfCapturedCheck = (id, color) => {
    let queue = [id];
    let pointer = 0;
    let explored = new Set();

    explored.add(idToString(id));
    console.log(color);
    while ((pointer < queue.length)) {
        const neighborMap = fetchNeighbors(queue[pointer], color);
        const foundEmpty = neighborMap.foundEmpty;
        const neighbors = neighborMap.neighbors;
        console.log(neighbors, color)
        if (foundEmpty) {
            return [];
        }
        else {
            for (const neighbor of neighbors) {
                //console.log(neighbor);
                if (!explored.has(idToString(neighbor))) {
                    console.log("explored", explored, "pushing", neighbor);
                    queue.push(neighbor);
                    explored.add(idToString(neighbor));
                }
            }
        }
        pointer = pointer + 1;
        console.log("im here", queue, pointer);
    }
    //if surrounded, return chain to be captured, else return empty array.
    return queue;
}

//===================================SET UP===========================================//
const go_board = (size) => {
    const edge = sizeMap.get(size);
    const spacing = edge / size;
    
    document.getElementById("boardLines").remove();
    const canvas = document.createElement("canvas");
    const div = document.createElement("div");
    document.body.appendChild(div);
    div.id = "boardLines";
    div.style.height = (edge - spacing) + "px";
    div.style.width = (edge - spacing) + "px";
    div.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    ctx.canvas.height = edge + 5;
    ctx.canvas.width = edge + 5;
    ctx.beginPath();
    for (i = 0; i < size; i++) {
        ctx.moveTo(i * spacing + 2, 2);
        ctx.lineTo(i * spacing + 2, edge - spacing + 2);
        ctx.moveTo(2, i * spacing + 2);
        ctx.lineTo(edge - spacing + 2, i * spacing + 2);
    }
    ctx.stroke();
};

const layout_stones = (size) => {
    for (let id = 0; id < size * size; id++) {
        make_stone(id % size, Math.floor(id / size), [id % size, Math.floor(id / size)], size);
    }
};

const make_board = (size) => {
    turn = 0;
    boardStates = new Set();
    board = [];
    board = Array.from({ length: size }, () =>
        new Array(size).fill(0));
}

const make_stone = (x, y, id, size) => {
    const edge = sizeMap.get(size);
    const spacing = edge / size;

    const div = document.createElement('div');
    const board = document.getElementById("boardLines");
    board.appendChild(div);
    div.className += "stone";
    div.id = "s" + id;
    div.style.position = "absolute";
    div.style.height = spacing + "px";
    div.style.width = spacing + "px";
    div.style.left = (x * spacing - (spacing / 2)) + "px";
    div.style.top = (y * spacing - (spacing / 2)) + "px";
    div.onmouseenter = () => {
        hover(turn, id);
    }
    div.onmouseleave = () => {
        hoverLeave(id);
    }
    div.onclick = () => update_board(id);
};

//===================================STUFFS===========================================//

const update_board = (id) => {
    let captured = []
    if (board[id[0]][id[1]] == 0) {
        const previousBoard = board.map(inner => inner.slice());
        board[id[0]][id[1]] = (turn % 2) + 1;
        //check for captures
        const neighborMap = fetchNeighbors(id, ((turn + 1) % 2) + 1);
        const captureCheck = neighborMap.neighbors; 
        console.log(captureCheck);
        for (const neighbor of captureCheck) {
            captured = captured.concat(selfCapturedCheck(neighbor, ((turn + 1) % 2) + 1));
        }
        if (captured.length == 0 && selfCapture) {
            //check for self capture
            captured = selfCapturedCheck(id, (turn % 2) + 1);
        }
        //remove all stones from captured
        if (captured.length > 0) {
            for (const capture of captured) {
                board[capture[0]][capture[1]] = 0;
            }
        }
        //check if final board state has been reached before and return to previous if yes.
        if (boardStates.has(boardToString(board))) {
            board = previousBoard;
            captured = [];
        }
        else {
            boardStates.add(boardToString(board));
            turn++;
        }
    }
    update_draw(id); 
    for (const capture of captured) {
        update_draw(capture);
    }
};

const update_draw = (id) => {
    const stone = document.getElementById("s" + id);
    stone.style.opacity = 1;
    stone.style.background = COLORS[board[id[0]][id[1]]];
}


//===================================ONCLICK EVENTS===========================================//
document.getElementById("5x5").onclick = () => {
    go_board(5);
    layout_stones(5);
    make_board(5);
    boardSize = 5;
};

document.getElementById("9x9").onclick = () => {
    go_board(9);
    layout_stones(9);
    make_board(9);
    boardSize = 9;
};

document.getElementById("13x13").onclick = () => {
    go_board(13);
    layout_stones(13);
    make_board(13);
    boardSize = 13;
};

document.getElementById("19x19").onclick = () => {
    go_board(19);
    layout_stones(19);
    make_board(19);
    boardSize = 19;
};

document.getElementById("Pass").onclick = () => {
    passTurn();
};

document.getElementById("Self Capture").onclick = () => {
    selfCapture = !selfCapture;
    const current = document.getElementById('Self Capture');
    if (selfCapture) {
        current.innerHTML = "Self Capture On";
    }
    else {
        current.innerHTML = "Self Capture Off";
    }
};

document.onkeydown = function (e) {
    if (e.code === "Space") {
        passTurn();
    }
};