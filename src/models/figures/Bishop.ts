import {Figure, FiguresName} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from '../../assets/images/figures/black-bishop.svg'
import whiteLogo from '../../assets/images/figures/white-bishop.svg'

export class Bishop extends Figure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.name = FiguresName.BISHOP
        this.logo = color === Colors.WHITE ? whiteLogo : blackLogo
    }

    canMove(target: Cell, testCheck= false): boolean {
        if(!super.canMove(target))
            return false
        if (this.cell.isEmptyDiagonal(target)){
            if (testCheck) return true
            return !this.cell.shahIsPossible(target)
        }
        return false
    }
}