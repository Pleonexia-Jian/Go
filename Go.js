const COLORS = ["transparent", "black", "white"];
let board = [];

const make_board = (size) => {
    board = [];
    board = Array.from({ length: size }, () =>
        new Array(size).fill(0));
}

const sizeMap = new Map([
    [5, 580],
    [9, 630],
    [13, 650],
    [19, 665]
])
let turn = 0;

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

const update_board = (id) => {
    console.log(id);
    if (board[id[0]][id[1]] == 0) {
        board[id[0]][id[1]] = (turn % 2) + 1;
        turn++;
    }
    update_draw(id); 
};

const update_draw = (id) => {
    const stone = document.getElementById("s" + id);
    stone.style.opacity = 1;
    stone.style.background = COLORS[board[id[0]][id[1]]];
}

const layout_stones = (size) => {
    for (let id = 0; id < size * size; id++) {
        make_stone(id % size, Math.floor(id / size), [id % size, Math.floor(id / size)], size);
    }
};

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



//go_board(19);
document.getElementById("5x5").onclick = () => {
    go_board(5);
    layout_stones(5);
    make_board(5);
};

document.getElementById("9x9").onclick = () => {
    go_board(9);
    layout_stones(9);
    make_board(9);

};

document.getElementById("13x13").onclick = () => {
    go_board(13);
    layout_stones(13);
    make_board(13);

};

document.getElementById("19x19").onclick = () => {
    go_board(19);
    layout_stones(19);
    make_board(19);
};