import {Figure, FiguresName} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from '../../assets/images/figures/black-king.svg'
import whiteLogo from '../../assets/images/figures/white-king.svg'
import {Rook} from "./Rook";

export class King extends Figure {

    firstStep = true

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.name = FiguresName.KING
        this.logo = color === Colors.WHITE ? whiteLogo : blackLogo
    }

    checkCellOnAttack(target: Cell) {
        const virtualBoard = this.cell.createVirtualBoard()
        const kingCell = virtualBoard.getCell(this.cell.x, this.cell.y)
        const kingTargetCell = virtualBoard.getCell(target.x, target.y)
        if (kingCell.figure !== null) {
            if (kingTargetCell.figure !== null)
                virtualBoard.figures = virtualBoard.figures.filter(figure => figure.id !== target.figure?.id)
            kingTargetCell.setFigure(kingCell.figure)
        }
        kingCell.figure = null

        for (const figure of virtualBoard.figures) {
            if (figure.color === (this.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE) && figure.canMove(kingTargetCell)) {
                return false
            }
        }

        return true
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target))
            return false

        if (this.firstStep && (target.x === 2 || target.x === 6) && this.cell.isEmptyHorizontal(target) && !this.cell.checkShah(this.color)) {

            for (const figure of this.cell.board.figures) {
                if (figure.color === this.color && figure instanceof Rook && figure.firstStep) {
                    if (target.x === 2 && figure.cell.x === 0)
                        return this.checkCellOnAttack(target) && this.checkCellOnAttack(this.cell.board.getCell(target.x + 1, target.y))
                    else if (target.x === 6 && figure.cell.x === 7)
                        return this.checkCellOnAttack(target) && this.checkCellOnAttack(this.cell.board.getCell(target.x - 1, target.y))
                }
            }
            return false
        }

        const enemyKing = this.cell.getEnemyKing() as King

        const absX = Math.abs(target.x -  enemyKing.cell.x)
        const absY = Math.abs(target.y -  enemyKing.cell.y)

        const canMoveY = (target.y === this.cell.y + 1 || target.y === this.cell.y - 1) && target.x == this.cell.x
        const canMoveX = (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) && target.y === this.cell.y
        const canMoveDiagonal = (target.y === this.cell.y + 1 || target.y === this.cell.y - 1) && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
        const canMoveEnemyKingOnThisCell: boolean =
            (absX === 1 && absY === 1) ||
            (absY === 0 && absX === 1) ||
            (absY === 1 && absX === 0)

        if (canMoveEnemyKingOnThisCell) return false

        if (canMoveY || canMoveX || canMoveDiagonal) {
            return this.checkCellOnAttack(target)
        }

        return false
    }

    moveFigure() {
        if (this.firstStep) this.firstStep = false
    }
}