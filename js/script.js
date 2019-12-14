const BOARD_SIZE = 9;
const EMPTY = ' ';
const HUMAN_PLAYER = 'O';
const COMPUTER_PLAYER = 'X';

var playerImage = new Image();
playerImage.src = "img/o.png";
var computerImage = new Image();
computerImage.src = "img/x.png";

var board = new Array();
var active_turn = "HUMAN";
var choice;
var searchTimes = new Array();

function NewGame() {
  for (i = 0; i < BOARD_SIZE; i++) {
    board[i] = EMPTY;
    document.images[i].src = "img/empty.png";
  }

  // MakeComputerMove();
  active_turn = "HUMAN";
  document.getElementById("turnInfo").innerHTML = "Your turn!";
}

function MakeMove(pos) {
  if (!GameOver(board) && board[pos] === EMPTY) {
    board[pos] = HUMAN_PLAYER;
    document.images[pos].src = playerImage.src;
    if (!GameOver(board)) {
      var alert = document.getElementById("turnInfo");
      active_turn = "COMPUTER";
      alert.innerHTML = "Computer's turn.";
      MakeComputerMove();
    }
  }
}

function MakeComputerMove() {
  AlphaBetaMinimax(board, 0, -Infinity, +Infinity);

  var move = choice;
  board[move] = COMPUTER_PLAYER;
  document.images[move].src = computerImage.src;
  choice = [];
  active_turn = "HUMAN";
  if (!GameOver(board)) {
    var alert = document.getElementById("turnInfo");
    alert.innerHTML = "Your turn!";
  }
}

function GameScore(game, depth) {
  var score = CheckForWinner(game);
  if (score === 1)
    return 0;
  else if (score === 2)
    return depth - 10;
  else if (score === 3)
    return 10 - depth;
}

function AlphaBetaMinimax(node, depth, alpha, beta) {
  if (CheckForWinner(node) !== 0)
    return GameScore(node, depth);

  depth += 1;
  var availableMoves = GetAvailableMoves(node);
  var move, result, possible_game;
  if (active_turn === "COMPUTER") {
    for (var i = 0; i < availableMoves.length; i++) {
      move = availableMoves[i];
      possible_game = GetNewState(move, node);
      result = AlphaBetaMinimax(possible_game, depth, alpha, beta);
      node = UndoMove(node, move);
      if (result > alpha) {
        alpha = result;
        if (depth == 1)
          choice = move;
      } else if (alpha >= beta) {
        return alpha;
      }
    }
    return alpha;
  } else {
    for (var i = 0; i < availableMoves.length; i++) {
      move = availableMoves[i];
      possible_game = GetNewState(move, node);
      result = AlphaBetaMinimax(possible_game, depth, alpha, beta);
      node = UndoMove(node, move);
      if (result < beta) {
        beta = result;
        if (depth == 1)
          choice = move;
      } else if (beta <= alpha) {
        return beta;
      }
    }
    return beta;
  }
}

function UndoMove(game, move) {
  game[move] = EMPTY;
  ChangeTurn();
  return game;
}

function GetNewState(move, game) {
  var piece = ChangeTurn();
  game[move] = piece;
  return game;
}

function ChangeTurn() {
  if (active_turn === "COMPUTER") {
    active_turn = "HUMAN";
    return 'X';
  } else {
    active_turn = "COMPUTER";
    return 'O';
  }
}

function GetAvailableMoves(game) {
  var possibleMoves = new Array();
  for (var i = 0; i < BOARD_SIZE; i++) {
    if (game[i] === EMPTY)
      possibleMoves.push(i);
  }
  return possibleMoves;
}

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN_PLAYER won
//   3 if COMPUTER_PLAYER won
function CheckForWinner(game) {
  // Check for horizontal wins
  for (i = 0; i <= 6; i += 3) {
    if (game[i] === HUMAN_PLAYER && game[i + 1] === HUMAN_PLAYER && game[i + 2] === HUMAN_PLAYER)
      return 2;
    if (game[i] === COMPUTER_PLAYER && game[i + 1] === COMPUTER_PLAYER && game[i + 2] === COMPUTER_PLAYER)
      return 3;
  }

  // Check for vertical wins
  for (i = 0; i <= 2; i++) {
    if (game[i] === HUMAN_PLAYER && game[i + 3] === HUMAN_PLAYER && game[i + 6] === HUMAN_PLAYER)
      return 2;
    if (game[i] === COMPUTER_PLAYER && game[i + 3] === COMPUTER_PLAYER && game[i + 6] === COMPUTER_PLAYER)
      return 3;
  }

  // Check for diagonal wins
  if (CheckDiagonalWin(HUMAN_PLAYER, game))
    return 2;

  if (CheckDiagonalWin(COMPUTER_PLAYER, game))
    return 3;

  // Check for tie
  for (i = 0; i < BOARD_SIZE; i++) {
    if (game[i] !== HUMAN_PLAYER && game[i] !== COMPUTER_PLAYER)
      return 0;
  }
  return 1;
}

function CheckDiagonalWin(player, game) {
  return (game[0] === player && game[4] === player && game[8] === player) ||
    (game[2] === player && game[4] === player && game[6] === player);
}

function GameOver(game) {
  let state = CheckForWinner(game);
  let alert = document.getElementById("turnInfo");

  switch (state) {
    case 0: return false;
    case 1: alert.innerHTML = "It is a tie."; break;
    case 2: alert.innerHTML = "You have won! Congratulations!"; break;
    case 3: alert.innerHTML = "The computer has won."; break;
    default: throw Error("Unexpected Error!");
  }

  return true;
}
