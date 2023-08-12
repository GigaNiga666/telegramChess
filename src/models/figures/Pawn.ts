import {Figure, FiguresName} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from '../../assets/images/figures/black-pawn.svg'
import whiteLogo from '../../assets/images/figures/white-pawn.svg'

export class Pawn extends Figure{
    firstStep = true

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.name = FiguresName.PAWN
        this.logo = color === Colors.WHITE ? whiteLogo : blackLogo
    }

    canMove(target: Cell, testCheck= false): boolean {
        if(!super.canMove(target))
            return false

        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1
        const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2

        if ((target.y === this.cell.y + direction || (this.firstStep && target.y === this.cell.y + firstStepDirection))
            && target.x === this.cell.x
            && this.cell.board.getCell(target.x, target.y).isEmpty()) {
            if (testCheck) return true
            return !this.cell.shahIsPossible(target)
        }

        if (target.y === this.cell.y + direction && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) && (this.cell.isEnemy(target))) {
            if (testCheck) return true
            return !this.cell.shahIsPossible(target)
        }

        return false
    }

    moveFigure() {
        if (this.firstStep) this.firstStep = false
    }
}