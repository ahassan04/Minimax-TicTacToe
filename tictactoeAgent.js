class Agent {
    constructor() {}

    minimax(board, depth, isMaximizing) {
        const winner = board.gameOver();
        if (winner) {
            if (winner === 'X') return { score: 10 - depth };
            if (winner === 'O') return { score: depth - 10 };
            if (winner === 'Draw') return { score: 0 };
        }

        if (isMaximizing) {
            let maxEval = { score: -Infinity };
            for (let i = 1; i <= 9; i++) {
                if (board.cellFree(i)) {
                    board.X.push(i);
                    let val = this.minimax(board, depth + 1, false);
                    board.X.pop();
                    if (val.score > maxEval.score) maxEval = { score: val.score, move: i };
                }
            }
            return maxEval;
        } else {
            let minEval = { score: Infinity };
            for (let i = 1; i <= 9; i++) {
                if (board.cellFree(i)) {
                    board.O.push(i);
                    let val = this.minimax(board, depth + 1, true);
                    board.O.pop();
                    if (val.score < minEval.score) minEval = { score: val.score, move: i };
                }
            }
            return minEval;
        }
    }

    getBestMove(board) {
        return this.minimax(board, 0, board.playerOne).move;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const playerXScoreElement = document.getElementById('playerXScore');
    const playerOScoreElement = document.getElementById('playerOScore');
    const playAgainButton = document.getElementById('play-again');

    let gb = new GameBoard();
    let ai = new Agent();
    let playerMode = document.getElementById('mode').value;
    let currentPlayer = 'X';
    let gameActive = true;
    let playerXScore = 0;
    let playerOScore = 0;

    function renderBoard() {
        gb.cells.forEach((cell, i) => {
            cell.onclick = () => handleCellClick(i + 1);
        });
        updateBoardState();
    }

    function handleCellClick(index) {
        if (!gameActive || !gb.cellFree(index)) return;
        gb.move(index);
        updateBoardState();
        let winner = gb.gameOver();
        if (winner) {
            endGame(winner);
        } else if (currentPlayer === 'O' && playerMode === 'pva') {
            let aiMove = ai.getBestMove(gb);
            gb.move(aiMove);
            updateBoardState();
            winner = gb.gameOver();
            if (winner) endGame(winner);
        }
    }

    function updateBoardState() {
        gb.cells.forEach((cell, index) => {
            cell.textContent = gb.X.includes(index + 1) ? 'X' : gb.O.includes(index + 1) ? 'O' : '';
            cell.className = 'cell ' + (cell.textContent || '');
        });
        currentPlayer = gb.playerOne ? 'X' : 'O';
        statusElement.textContent = `Turn: Player ${currentPlayer}`;
    }

    function endGame(winner) {
        gameActive = false;
        let message = winner === 'Draw' ? 'Draw!' : `${winner} Wins!`;
        statusElement.textContent = message;
        if (winner === 'X') playerXScore++;
        if (winner === 'O') playerOScore++;
        updateScore();
    }

    function updateScore() {
        playerXScoreElement.textContent = `X: ${playerXScore}`;
        playerOScoreElement.textContent = `O: ${playerOScore}`;
    }

    playAgainButton.onclick = () => {
        gb.reset();
        gameActive = true;
        statusElement.textContent = 'Game in progress...';
        renderBoard();
    };

    renderBoard();
});