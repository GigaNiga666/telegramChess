import {makeAutoObservable} from "mobx";
import {Player} from "../models/Player";
import {Cell} from "../models/Cell";
import {Colors} from "../models/Colors";


class Store {

    firstStepIsDone = false
    currentFigure : HTMLImageElement | null = null
    takeDownCell : Cell | null = null
    gameIsEnd : null | ((winnerColor : string) => void) = null
    blockTimer : boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    setBlockTimer(bool : boolean) {
        this.blockTimer = bool
    }

    setGameIsEnd(callback : (winnerColor : string) => void) {
        this.gameIsEnd = callback
    }

    onGameEnd(WinPlayer : Colors) {
        if (this.gameIsEnd) this.gameIsEnd(WinPlayer)
    }

    setFirstStep(bool : boolean) {
        this.firstStepIsDone = bool
    }

    setFigure(figure : HTMLImageElement | null) {
        this.currentFigure = figure
    }

    setTakeDownCell(value : Cell | null) {
        this.takeDownCell = value
    }
}

export default new Store()