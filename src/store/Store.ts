import {makeAutoObservable} from "mobx";
import {Player} from "../models/Player";
import {Cell} from "../models/Cell";
import {Colors} from "../models/Colors";
import useSound from "use-sound";
import moveSound from "../assets/audio/move.mp3";
import captureSound from "../assets/audio/capture.mp3";
import {PlayFunction} from "use-sound/dist/types";


class Store {

    firstStepIsDone = false
    currentFigure : HTMLImageElement | null = null
    takeDownCell : Cell | null = null
    gameIsEnd : null | ((winnerColor : string) => void) = null
    blockTimer : boolean = false
    playMove : PlayFunction = useSound(moveSound)[0]
    playCapture : PlayFunction = useSound(captureSound)[0]

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