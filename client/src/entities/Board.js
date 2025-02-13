export const ELEMENTS = {
    bush: 5,
    players: 1,
};

export class Board {
    #map = null;
    #states = {
        NO_BUILD: 0,
        BUILD: 1
    }
    #state = null;
    #corners = [];
    #players = [];

    constructor() {
        this.#state = this.#states.NO_BUILD;
    }

    build(payload , players) {
        
        const { size, elements } = payload;
        this.#map = new Array(size).fill().map(() => new Array(size).fill(0));
        elements.forEach(element => {
            if (element.type === ELEMENTS.bush) this.#map[element.x][element.y] = ELEMENTS.bush;
            else if (element.type === ELEMENTS.players) {
                this.#map[element.x][element.y] = ELEMENTS.players;
                this.#corners.push({ x: element.x, y: element.y });
                }
        });
        this.#state = this.#states.BUILD;       
    }

    assingPlayerPosition(players) {
     
        const availableCorners = [...this.#corners];
        players.forEach(jugadores => {
            if (availableCorners.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCorners.length);
                const corner = availableCorners.splice(randomIndex, 1)[0];
                jugadores.x = corner.x;
                jugadores.y = corner.y;
            }
        });
    }

    get map() {
        if (this.#state === this.#states.BUILD) {
            return this.#map;
        }
        return undefined;
    }

    get corners() {
        return this.#corners;
    }
}