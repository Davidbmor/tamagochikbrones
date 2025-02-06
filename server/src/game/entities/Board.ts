import { Player } from "../../player/entities/Player";
export interface Element {
    x : number;
    y : number; 
}

export interface Board {
    bush: number;
    size: number;
    bushes: Array<Element>;
    players: Array<Element>;
}