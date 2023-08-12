import {Figure, FiguresName} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from '../../assets/images/figures/black-queen.svg'
import whiteLogo from '../../assets/images/figures/white-queen.svg'

export class Queen extends Figure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.name = FiguresName.QUEEN
        this.logo = color === Colors.WHITE ? whiteLogo : blackLogo
    }

    canMove(target: Cell, testCheck : boolean = false): boolean {
        if(!super.canMove(target))
            return false
        if (this.cell.isEmptyVertical(target) || this.cell.isEmptyHorizontal(target) || this.cell.isEmptyDiagonal(target)){
            if (testCheck) return true
            return !this.cell.shahIsPossible(target)
        }
        return false
    }
}