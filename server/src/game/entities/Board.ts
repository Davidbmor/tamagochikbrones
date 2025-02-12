import { Player } from "../../player/entities/Player";
export interface Element {
    x : number;
    y : number; 
    type : number;
}

export interface Board {
    bush: number;
    size: number;
    elements: Array<Element>;
}