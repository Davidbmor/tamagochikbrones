import { Player } from "../entities/Player.js";

export class PlayerService {
    #players = [];

    constructor() {}

    addPlayer(playerData, boardSize) {
        const corners = [
            { x: 0, y: 0 },
            { x: 0, y: boardSize - 1 },
            { x: boardSize - 1, y: 0 },
            { x: boardSize - 1, y: boardSize - 1 }
        ];
        const availableCorners = corners.filter(corner => !this.#players.some(p => p.x === corner.x && p.y === corner.y));
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            playerData.x = randomCorner.x;
            playerData.y = randomCorner.y;
        }
        const player = new Player(playerData.x, playerData.y, playerData.status, playerData.direction, playerData.visibility);
        this.#players.push(player);
        return player;
    }

    getPlayers() {
        return this.#players;
    }
}