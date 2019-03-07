const colors = [`#077187`,`#f0707f`,`#e4e295`,`#9ECE9A`,`#444054`];
const moves = document.querySelector('.moves');
let board = document.getElementById("board");
let board_width = 0;
let board_height = 0;
let number_of_tiles = 0;
let total_moves = 0;
let flood_color = ``;
let flooded_tiles = [];

// Creates a table, adds background to each cell, each cell listens for a click event
function CreateBoard(width, height) {
  let board = document.getElementById("board");
  for (let i=0; i < height; i++) {
    let tr = document.createElement("tr");
    for (let j=0; j < width; j++) {
      let td = document.createElement("td");
      td.style.background = RandomColor();
      td.addEventListener('click', Flood);
      tr.appendChild(td);
    }
    board.appendChild(tr);
  }
  // Tile in the top left corner should be black and starts as flooded.
  board.rows[0].cells[0].style.background = `#000000`;
  flooded_tiles.push(board.rows[0].cells[0]);
  board.rows[0].cells[0].classList.add('flooded');
  number_of_tiles = width * height;
  board_width = width;
  board_height = height;
}

function IsFlooded(tile)  {
  return tile.classList.contains('flooded');
}

function MatchesFloodColor(tile) {
  return tile.style.background == flood_color;
}

function ChangeColor(tile, color) {
  tile.style.background = flood_color;
}

function RandomColor(){
  random_color = Math.floor(Math.random() * 5);
  return colors[random_color];
}

// When a tile is clicked, if the tile is touching a flooded tile, it will change the color of all flooded tiles to that tile's 
// color, and absorb any surrounding tiles of the same color.
function Flood(e) {
  if (!IsFlooded(this) && NeighborIsFlooded(this)) {
    total_moves++;
    moves.textContent = "Total Moves: " + total_moves;
    flood_color = this.style.background;
    FloodTile(this);

    if (number_of_tiles == flooded_tiles.length) moves.textContent = "You finished!! in " + total_moves + " moves";
  } else {
    return;
  }
}

// Returns whether or not a given tile is surrounded by any flooded tiles.
function NeighborIsFlooded(tile) {
  col = tile.cellIndex;
  row = tile.parentNode.rowIndex;
  let right = board.rows[row].cells[col+1];
  let left = board.rows[row].cells[col-1];
  
  if (row != 0) {
    let up = board.rows[row-1].cells[col];
    if (IsFlooded(up)) return true;
  }
  if (row != board_height - 1) {
    let down = board.rows[row+1].cells[col];
    if (IsFlooded(down)) return true;
  }
  if (col != 0) {
    if (IsFlooded(left)) return true;

  }
  if (col != board_width -1) {
    if (IsFlooded(right)) return true;
  }
}

// Checks if a given tile can be flooded.
function CheckNeighbors(tile) {
  col = tile.cellIndex;
  row = tile.parentNode.rowIndex;

  let right = board.rows[row].cells[col+1];
  let left = board.rows[row].cells[col-1];
  
  if (row != 0) {
    let up = board.rows[row-1].cells[col];
    CheckIfFloodable(up);
  }
  if (row != board_height - 1) {
    let down = board.rows[row+1].cells[col];
    CheckIfFloodable(down);
  }
  if (col != 0) {
    CheckIfFloodable(left);
  }
  if (col != board_width -1) {
    CheckIfFloodable(right);
  }
}

// Checks if tile can be flooded, and if it can, floods it.
function CheckIfFloodable(tile) {
  if (!IsFlooded(tile) && MatchesFloodColor(tile)) {
    FloodTile(tile);
  }
}

function FloodTile(tile) {
  tile.classList.add('flooded');
  flooded_tiles.forEach(tile => ChangeColor(tile, flood_color));
  flooded_tiles.push(tile);
  flooded_tiles.forEach(flooded_tile => CheckNeighbors(flooded_tile));
}

CreateBoard(15, 15);
