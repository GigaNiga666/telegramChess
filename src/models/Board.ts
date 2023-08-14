import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Pawn} from "./figures/Pawn";
import {Queen} from "./figures/Queen";
import {King} from "./figures/King";
import {Knight} from "./figures/Knight";
import {Bishop} from "./figures/Bishop";
import {Rook} from "./figures/Rook";
import {Figure} from "./figures/Figure";

export class Board {
    cells: Cell[][] = []
    figures: Array<King | Pawn | Queen | Knight | Rook | Bishop> = []
    lostWhiteFigures: Figure[] = []
    lostBlackFigures: Figure[] = []

    public initCells() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = []
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    row.push(new Cell(j, i, Colors.BLACK, null, this))
                } else {
                    row.push(new Cell(j, i, Colors.WHITE, null, this))
                }
            }
            this.cells.push(row)
        }
    }

    public highLightCells(selectedCell: Cell | null) {
        for (let i = 0; i < this.cells.length; i++) {
            const row: Cell[] = this.cells[i]
            for (let j = 0; j < row.length; j++) {
                const target = row[j]
                target.available = !!selectedCell?.figure?.canMove(target)
            }
        }
    }

    public getCopyBoard(): Board {
        const newBoard = new Board()
        newBoard.cells = this.cells
        newBoard.figures = this.figures
        newBoard.lostBlackFigures = this.lostBlackFigures
        newBoard.lostWhiteFigures = this.lostWhiteFigures
        return newBoard
    }

    private addPawns() {
        for (let i = 0; i < 8; i++) {
            this.figures.push(new Pawn(Colors.BLACK, this.getCell(i, 1)))
            this.figures.push(new Pawn(Colors.WHITE, this.getCell(i, 6)))
        }
    }

    private addKings() {
        this.figures.push(new King(Colors.BLACK, this.getCell(4, 0)))
        this.figures.push(new King(Colors.WHITE, this.getCell(4, 7)))
    }

    private addBishops() {
        this.figures.push(new Bishop(Colors.BLACK, this.getCell(2, 0)))
        this.figures.push(new Bishop(Colors.BLACK, this.getCell(5, 0)))
        this.figures.push(new Bishop(Colors.WHITE, this.getCell(2, 7)))
        this.figures.push(new Bishop(Colors.WHITE, this.getCell(5, 7)))
    }

    private addRooks() {
        this.figures.push(new Rook(Colors.BLACK, this.getCell(0, 0)))
        this.figures.push(new Rook(Colors.BLACK, this.getCell(7, 0)))
        this.figures.push(new Rook(Colors.WHITE, this.getCell(0, 7)))
        this.figures.push(new Rook(Colors.WHITE, this.getCell(7, 7)))
    }

    private addKnights() {
        this.figures.push(new Knight(Colors.WHITE, this.getCell(1, 7)))
        this.figures.push(new Knight(Colors.WHITE, this.getCell(6, 7)))
        this.figures.push(new Knight(Colors.BLACK, this.getCell(1, 0)))
        this.figures.push(new Knight(Colors.BLACK, this.getCell(6, 0)))
    }

    private addQueens() {
        this.figures.push(new Queen(Colors.BLACK, this.getCell(3, 0)))
        this.figures.push(new Queen(Colors.WHITE, this.getCell(3, 7)))
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x]
    }

    public addFigures() {
        this.addPawns();
        this.addBishops();
        this.addKnights();
        this.addRooks();
        this.addQueens();


        this.addKings()
    }
}