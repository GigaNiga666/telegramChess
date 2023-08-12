import React, {FC, useEffect, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {Colors} from "../models/Colors";
import {observer} from "mobx-react-lite";
import ModalChoice from "./Modal-Choice";
import {FiguresName} from "../models/figures/Figure";
import socketStore from "../store/SocketStore";
import Store from "../store/Store";
import LostFiguresComponent from "./LostFiguresComponent";

interface IBoardComponentProps {
    board: Board,
    setBoard: (board: Board) => void,
    currentPlayer: Colors,
    setCurrentPlayer : (color : Colors) => void
    playerColor: Colors | null
}

interface IMoveProps {
    to: { x: number; y: number; },
    from: { x: number; y: number; },
    color: Colors,
    figure : string
}

const BoardComponent: FC<IBoardComponentProps> = ({board, currentPlayer, setCurrentPlayer, playerColor, setBoard}) => {


    const [modal, setModal] = useState<boolean>(false)
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const [passedPawn, setPassedPawn] = useState<Cell | null>(null)

    useEffect(() => {
        socketStore.addListener('newMove', (props: IMoveProps) => {
            if (!Store.firstStepIsDone) Store.setFirstStep(true)
            moveFigure(board.getCell(props.to.x, props.to.y), board.getCell(props.from.x, props.from.y), props.figure)
            setCurrentPlayer(props.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE)
        })
    }, [])

    useEffect(() => {
        highLightCells()
    }, [selectedCell])

    function clickIsPossible(cell: Cell) : boolean {
        if (modal || currentPlayer !== playerColor) return false
        return true
    }

    function click(cell: Cell, selected : boolean = false) {
        if (selected && !selectedCell?.isPassedPawn(cell)){
            setSelectedCell(null)
            return
        }

        if (!clickIsPossible(cell)) return


        else if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
            if (selectedCell.isPassedPawn(cell)) {
                setModal(true)
                setPassedPawn(cell)
            }
            else
            {
                socketStore.socket?.emit('newMove', {
                    to: {x: cell.x, y: cell.y},
                    from: {x: selectedCell.x, y: selectedCell.y},
                    color: playerColor,
                    figure: FiguresName.FIGURE
                })
            }

        } else if (cell.figure)
            if (currentPlayer === cell.figure.color)
                setSelectedCell(cell)
    }



    function highLightCells() {
        board.highLightCells(selectedCell)
        updateBoard()
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

    function moveFigure(target: Cell, fromCell: Cell, targetFigure: string) {
        fromCell.moveFigure(target, targetFigure)
        setSelectedCell(null)
        updateBoard()
    }

    function spendAPawn(figure: FiguresName) {
        setModal(false)
        if (passedPawn)
            socketStore.socket?.emit('newMove', {
                to: {x: passedPawn.x, y: passedPawn.y},
                from: {x: selectedCell?.x, y: selectedCell?.y},
                color: playerColor,
                figure: figure
            })
    }

    function boardMapBasedOnColorPlayer() {
        return playerColor === Colors.WHITE ? board.cells : board.cells.slice(0).reverse()
    }

    return (
        <div className='board__main'>
            <ModalChoice currentPlayer={currentPlayer} visible={modal} onClick={spendAPawn}/>
            <LostFiguresComponent position='left' lostFigures={playerColor === Colors.WHITE ? board.lostWhiteFigures : board.lostBlackFigures}/>
            <div className="board__wrapper">
                    <div className="board__notice">
                        <ul className="board__list">
                            <li className="board__item board__item--word">
                                <span className="board__word">A</span>
                                <span className="board__word">B</span>
                                <span className="board__word">C</span>
                                <span className="board__word">D</span>
                                <span className="board__word">E</span>
                                <span className="board__word">F</span>
                                <span className="board__word">G</span>
                                <span className="board__word">H</span>
                            </li>
                            <li className="board__item board__item--num">
                                <span className="board__num">8</span>
                                <span className="board__num">8</span>
                            </li>
                            <li className="board__item board__item--num">
                                <span className="board__num">7</span>
                                <span className="board__num">7</span>
                            </li>
                            <li className="board__item board__item--num">
                                <span className="board__num">6</span>
                                <span className="board__num">6</span>
                            </li>
                            <li className="board__item board__item--num">
                                <span className="board__num">5</span>
                                <span className="board__num">5</span>
                            </li>
                            <li className="board__item board__item--num">
                                <span className="board__num">4</span>
                                <span className="board__num">4</span>
                            </li>
                            <li className="board__item board__item--num">
                                <span className="board__num">3</span>
                                <span className="board__num">3</span>
                            </li>
                            <li className="board__item board__item--num">
                                <span className="board__num">2</span>
                                <span className="board__num">2</span>
                            </li>
                            <li className="board__item board__item--num">
                                <span className="board__num">1</span>
                                <span className="board__num">1</span>
                            </li>
                            <li className="board__item board__item--word">
                                <span className="board__word">A</span>
                                <span className="board__word">B</span>
                                <span className="board__word">C</span>
                                <span className="board__word">D</span>
                                <span className="board__word">E</span>
                                <span className="board__word">F</span>
                                <span className="board__word">G</span>
                                <span className="board__word">H</span>
                            </li>
                        </ul>
                    </div>
                    <div className={`board ${playerColor === Colors.BLACK ? 'reverse' : ''}`}>
                        {boardMapBasedOnColorPlayer().map((row, index) =>
                            <React.Fragment key={index}>
                                {row.map((cell, i) =>
                                    <CellComponent
                                        currentPlayer={currentPlayer}
                                        clickIsPossible={clickIsPossible}
                                        click={click}
                                        selected={selectedCell?.y === cell.y && selectedCell.x === cell.x}
                                        key={cell.id}
                                        cell={cell}
                                    />
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            <LostFiguresComponent position='right' lostFigures={playerColor === Colors.BLACK ? board.lostWhiteFigures : board.lostBlackFigures}/>
        </div>

    )
};

export default observer(BoardComponent)