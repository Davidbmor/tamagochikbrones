import { Board } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    
    constructor() {
        this.board = {
            bush:5,
            size: 10,
           
            elements: []
        }
        const map : Array<number[]> = [
            [1,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,5,0,0,0],
            [0,5,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,5,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,5,0],
            [0,0,5,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,5,0,0],
            [1,0,0,0,0,0,0,0,0,1]
        ]
        
        for(let i = 0; i < this.board.size; i++)
            for(let j = 0; j < this.board.size; j++)
                if(map[i][j] !== 0) {
                    this.board.elements.push({x : i, y : j , type : map[i][j]})
                }
    }

    public getBoard() : Board {
        return this.board;
    }
}