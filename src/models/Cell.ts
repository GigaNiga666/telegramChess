import {Colors} from "./Colors";
import {Board} from "./Board";
import {Figure, FiguresName} from "./figures/Figure";
import {King} from "./figures/King";
import {Bishop} from "./figures/Bishop";
import {Rook} from "./figures/Rook";
import {Knight} from "./figures/Knight";
import {Queen} from "./figures/Queen";
import {Pawn} from "./figures/Pawn";
import Store from "../store/Store";

const clone = require('clone');

export class Cell {
    readonly x : number;
    readonly y : number;
    readonly color: Colors;
    figure : Figure | null;
    board : Board;
    available : boolean;
    takedown : boolean;
    id : number;

    constructor(x: number, y: number, color: Colors, figure: Figure | null,board: Board) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.board = board;
        this.available = false
        this.id = Math.random()
        this.takedown = false
    }

    setFigure(figure : Figure) {
        this.figure = figure
        this.figure.cell = this
    }

    isEmpty() : boolean {
        return this.figure === null
    }

    isEmptyVertical(target : Cell) : boolean {
        if (target === this) return false

        if (this.x !== target.x)
            return false

        const min = Math.min(this.y, target.y)
        const max = Math.max(this.y, target.y)

        for (let y = min + 1; y < max; y++) {
            if (!this.board.getCell(this.x, y).isEmpty()) {
                return false
            }
        }
        return true
    }

    isEmptyHorizontal(target : Cell) : boolean {
        if (target === this) return false

        if (this.y !== target.y)
            return false

        const min = Math.min(this.x, target.x)
        const max = Math.max(this.x, target.x)


        for (let x = min + 1; x < max; x++) {
                if (!this.board.getCell(x, this.y).isEmpty()) {
                    return false
            }
        }
        return true
    }

    isEmptyDiagonal(target : Cell) : boolean {
        if (target === this) return false

        const absX = Math.abs(target.x - this.x)
        const absY = Math.abs(target.y - this.y)

        if (absX !== absY)
            return false

        const dy = this.y < target.y ? 1 : -1
        const dx = this.x < target.x ? 1 : -1

        for (let i = 1; i < absY; i++) {
            if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty())
                return false
        }

        return true
    }

    isEnemy(target : Cell) : boolean {
        if (target.figure) {
            return this.figure?.color !== target.figure.color
        }
        return target.takedown
    }


    addLostFigure(figure : Figure) {
        figure.color === Colors.BLACK ? this.board.lostBlackFigures.push(figure) : this.board.lostWhiteFigures.push(figure)
    }

    getEnemyKing() : King | undefined{
        const enemyKing = this.board.figures.find(figure => figure.name === FiguresName.KING && figure.color !== this.figure?.color)
        if (enemyKing instanceof King) return enemyKing
    }

    createVirtualBoard() : Board {
        const newBoard = new Board()
        newBoard.cells = clone(this.board.cells)
        newBoard.figures = clone(this.board.figures)

        for (const figure of newBoard.figures) {
            figure.cell = newBoard.getCell(figure.cell.x, figure.cell.y)
        }
        return newBoard
    }

    checkShah(kingColor : Colors | undefined, board = this.createVirtualBoard()) : boolean {
        const virtualBoard = board
        const unionKing = virtualBoard.figures.find(figure => figure.name === FiguresName.KING && figure.color === kingColor)
        if (!unionKing) return false

        for (const figure of virtualBoard.figures) {
            if (figure.name !== FiguresName.KING && figure.color !== unionKing.color && figure.canMove(unionKing.cell, true)){
                return true
            }
        }

        return false
    }

    shahIsPossible(target : Cell) : boolean {
        const virtualBoard = this.createVirtualBoard()
        const startCell = virtualBoard.getCell(this.x, this.y)
        const targetCell = virtualBoard.getCell(target.x, target.y)

        if (startCell.figure) {
            if (targetCell.figure !== null)
                virtualBoard.figures = virtualBoard.figures.filter(figure => figure.id !== target.figure?.id)
            targetCell.setFigure(startCell.figure)
        }
        startCell.figure = null

        return this.checkShah(targetCell.figure?.color, virtualBoard)
    }

    isPassedPawn(target : Cell) {
        return this.figure?.name === FiguresName.PAWN && (target.y === 0 || target.y === 7)
    }

    attackOnEnemyKing(target : Cell) {
        const enemyColor = target.figure?.color === Colors.BLACK ? Colors.WHITE : Colors.BLACK
        let isMat = true

        if (target.figure?.cell.checkShah(enemyColor)) {
            console.log('Шах')

            for (let i = 0; i < this.board.cells.length; i++) {
                const row : Cell[] = this.board.cells[i]
                for (let j = 0; j < row.length; j++) {

                    for (const figure of this.board.figures) {
                        if (figure.color === enemyColor && figure.canMove(this.board.getCell(j, i))) {
                            isMat = false
                        }
                    }

                }
            }

            if (isMat) Store.onGameEnd(target.figure?.color)
        }
    }

    isRakishStep(target : Cell) {
        const isRakish = (target.x === 2 || target.x === 6) && this.figure instanceof King && this.figure.firstStep

        if (isRakish) {
            for (const figure of this.board.figures) {
                if (figure instanceof Rook && figure.color === this.figure?.color) {
                    if (figure.cell.x === 0 && target.x === 2) {
                        figure.cell.moveFigure(this.board.getCell(target.x + 1, target.y))
                        figure.moveFigure()
                        return
                    }
                    else if (figure.cell.x === 7 && target.x === 6) {
                        figure.cell.moveFigure(this.board.getCell(target.x - 1, target.y))
                        figure.moveFigure()
                        return
                    }
                }
            }
        }
    }

    isTakeDownPossible(target : Cell) {
        if (this.figure instanceof Pawn ) {
            if (target.takedown) {
                const pawn = this.board.getCell(target.x, target.y === 2 ? target.y + 1 : target.y - 1)
                target.takedown = false
                this.cutTheFigure(pawn.figure as Figure)
                pawn.figure = null
                Store.setTakeDownCell(null)
            }
            else if (this.figure.firstStep && (target.y === 3 || target.y === 4)) {
                const takeDownCell = this.board.getCell(target.x,target.y === 3 ? target.y - 1 : target.y + 1)
                takeDownCell.takedown = true
                if (Store.takeDownCell !== null) Store.takeDownCell.takedown = false
                Store.setTakeDownCell(takeDownCell)
            }
            else if (Store.takeDownCell !== null) {
                Store.takeDownCell.takedown = false
                Store.setTakeDownCell(null)
            }
        }
        else if (Store.takeDownCell !== null) {
            Store.takeDownCell.takedown = false
            Store.setTakeDownCell(null)
        }
    }

    cutTheFigure(targetFigure : Figure) {
        this.board.figures = this.board.figures.filter(figure => figure.id !== targetFigure.id)
        this.addLostFigure(targetFigure as Figure)
        Store.playCapture()
    }

    moveFigure(target : Cell, targetFigure : FiguresName | string = FiguresName.FIGURE) {
        if (this.figure) {

            this.isRakishStep(target)
            this.isTakeDownPossible(target)

            this.figure.moveFigure()
            if (target.figure){
                this.cutTheFigure(target.figure)
            }
            else {
                Store.playMove()
            }
            switch (targetFigure) {
                case FiguresName.FIGURE:
                    target.setFigure(this.figure)
                    break
                case FiguresName.BISHOP:
                    this.board.figures.push(new Bishop(this.figure.color, target))
                    break
                case FiguresName.ROOK:
                    this.board.figures.push(new Rook(this.figure.color, target))
                    break
                case FiguresName.KNIGHT:
                    this.board.figures.push(new Knight(this.figure.color, target))
                    break
                case FiguresName.QUEEN:
                    this.board.figures.push(new Queen(this.figure.color, target))
                    break
            }

            this.figure = null
            this.attackOnEnemyKing(target)
        }
    }
}