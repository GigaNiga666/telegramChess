import {Figure, FiguresName} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from '../../assets/images/figures/black-rook.svg'
import whiteLogo from '../../assets/images/figures/white-rook.svg'

export class Rook extends Figure {
    firstStep = true

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.name = FiguresName.ROOK
        this.logo = color === Colors.WHITE ? whiteLogo : blackLogo
    }

    canMove(target: Cell, testCheck = false): boolean {
        if (!super.canMove(target))
            return false
        if (this.cell.isEmptyVertical(target) || this.cell.isEmptyHorizontal(target)) {
            if (testCheck) return true
            return !this.cell.shahIsPossible(target)
        }

        return false
    }

    moveFigure() {
        if (this.firstStep) this.firstStep = false
    }
}