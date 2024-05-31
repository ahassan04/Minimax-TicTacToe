class GameBoard {
    constructor() {
        this.cells = Array.from({ length: 9 }, (_, i) => document.getElementById((i + 1).toString()));
        this.X = [];
        this.O = [];
        this.playerOne = true;
    }

    cellFree(cell) {
        return !this.X.includes(cell) && !this.O.includes(cell);
    }

    move(cell) {
        if (this.cellFree(cell)) {
            this.playerOne ? this.X.push(cell) : this.O.push(cell);
            const c = this.cells[cell - 1];
            c.className = this.playerOne ? "X" : "O";
            c.textContent = this.playerOne ? "X" : "O";
            this.playerOne = !this.playerOne;
            return this.gameOver();
        }
        return 0;
    }

    gameOver() {
        const winPatterns = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9],
            [1, 5, 9], [3, 5, 7]
        ];
        for (const pattern of winPatterns) {
            if (pattern.every(pos => this.X.includes(pos))) return 'X';
            if (pattern.every(pos => this.O.includes(pos))) return 'O';
        }
        return this.X.length + this.O.length === 9 ? 'Draw' : null;
    }

    reset() {
        this.cells.forEach(cell => {
            cell.className = 'cell';
            cell.textContent = '';
        });
        this.X = [];
        this.O = [];
        this.playerOne = true;
    }
}