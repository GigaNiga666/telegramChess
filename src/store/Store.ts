import {makeAutoObservable} from "mobx";
import {Player} from "../models/Player";
import {Cell} from "../models/Cell";
import {Colors} from "../models/Colors";

const BACKEND_URL = "https://0888-79-172-16-96.ngrok-free.app"

class Store {

    firstStepIsDone = false
    currentFigure : HTMLImageElement | null = null
    takeDownCell : Cell | null = null
    gameIsEnd : null | (() => void) = null

    constructor() {
        makeAutoObservable(this)
    }

    setGameIsEnd(callback : () => void) {
        this.gameIsEnd = callback
    }

    onGameEnd(LosePlayer : Colors) {
        console.log('Win: ', LosePlayer)
        if (this.gameIsEnd) this.gameIsEnd()
        this.firstStepIsDone = false
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