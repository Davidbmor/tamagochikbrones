import { Board } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    
    constructor() {
        this.board = {
            bush:5,
            size: 10,
            bushes: [],
            players: []
        }
        const map : Array<number[]> = [
            [9,0,0,0,0,0,0,0,0,9],
            [0,0,0,0,0,0,5,0,0,0],
            [0,5,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,5,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,5,0],
            [0,0,5,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,5,0,0],
            [9,0,0,0,0,0,0,0,0,9]
        ]
        for(let i = 0; i < this.board.size; i++)
            for(let j = 0; j < this.board.size; j++)
                if(map[i][j] === 5) {
                    this.board.bushes.push({x : i, y : j})
                }
        for(let i = 0; i < this.board.size; i++)
            for(let j = 0; j < this.board.size; j++)
                if(map[i][j] === 9) {
                    this.board.players.push({x : i, y : j})
                }
    }

    public getBoard() : Board {
        return this.board;
    }
}