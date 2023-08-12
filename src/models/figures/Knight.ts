import {Figure, FiguresName} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from '../../assets/images/figures/black-knight.svg'
import whiteLogo from '../../assets/images/figures/white-knight.svg'

export class Knight extends Figure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.name = FiguresName.KNIGHT
        this.logo = color === Colors.WHITE ? whiteLogo : blackLogo
    }

    canMove(target: Cell, testCheck = false): boolean {
        if(!super.canMove(target))
            return false
        else {
            const dx = Math.abs(this.cell.x - target.x)
            const dy = Math.abs(this.cell.y - target.y)

            if ((dx === 1 && dy === 2) || (dx === 2 && dy === 1)) {
                if (testCheck) return true
                return !this.cell.shahIsPossible(target)
            }

            return false

        }
    }
}