import {Colors} from "../Colors";
import {Cell} from "../Cell";
import logo from '../../assets/images/figures/black-bishop.svg'

export enum FiguresName {
    FIGURE = 'figure',
    BISHOP = 'bishop',
    KNIGHT = 'knight',
    ROOK = 'rook',
    QUEEN = 'queen',
    KING = 'king',
    PAWN = 'pawn'
}

export class Figure {
    readonly color : Colors;
    name : FiguresName;
    cell : Cell;
    logo : typeof logo | undefined;
    id : number;


    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = undefined;
        this.name = FiguresName.FIGURE;
        this.id = Math.random();
    }

    canMove(target: Cell, testCheck : boolean = false) : boolean {
        if (target.figure?.color === this.color) {
            return false
        }

        return true
    }

    moveFigure() {}
}