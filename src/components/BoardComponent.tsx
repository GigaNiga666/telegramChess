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

interface IBoardComponentProps {
    board: Board,
    setBoard: (board: Board) => void,
    currentPlayer: Colors,
    setCurrentPlayer: (color: Colors) => void
    playerColor: Colors | null
}

interface IMoveProps {
    to: { x: number; y: number; },
    from: { x: number; y: number; },
    color: Colors,
    figure: string
}

const BoardComponent: FC<IBoardComponentProps> = ({board, currentPlayer, setCurrentPlayer, playerColor, setBoard}) => {


    const [modal, setModal] = useState<boolean>(false)
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const [prevMoveCell, setPrevMoveCell] = useState<Cell | null>(null)
    const [targetMoveCell, setTargetMoveCell] = useState<Cell | null>(null)
    const [passedPawn, setPassedPawn] = useState<Cell | null>(null)


    useEffect(() => {
        socketStore.addListener('newMove', (props: IMoveProps) => {
            if (!Store.firstStepIsDone) Store.setFirstStep(true)
            const targetCell = board.getCell(props.to.x, props.to.y)
            moveFigure(targetCell, board.getCell(props.from.x, props.from.y), props.figure)
            setCurrentPlayer(props.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE)
            setTargetMoveCell(targetCell)
        })
    }, [])

    useEffect(() => {
        highLightCells()
    }, [selectedCell])

    function clickIsPossible(cell: Cell): boolean {
        if (modal || currentPlayer !== playerColor) return false
        return true
    }

    function click(cell: Cell, selected: boolean = false) {
        if (selected && !selectedCell?.isPassedPawn(cell)) {
            setSelectedCell(null)
            return
        }

        if (!clickIsPossible(cell)) return


        else if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
            if (selectedCell.isPassedPawn(cell)) {
                setModal(true)
                setPassedPawn(cell)
            } else {
                socketStore.socket?.emit('newMove', {
                    to: {x: cell.x, y: cell.y},
                    from: {x: selectedCell.x, y: selectedCell.y},
                    color: playerColor,
                    figure: FiguresName.FIGURE
                })
                setPrevMoveCell(selectedCell)
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
        <>
            <ModalChoice currentPlayer={currentPlayer} visible={modal} onClick={spendAPawn}/>
            <div className={`board ${playerColor === Colors.BLACK ? 'reverse' : ''}`}>
                {boardMapBasedOnColorPlayer().map((row, index) =>
                    <React.Fragment key={index}>
                        {row.map((cell, i) =>
                            <CellComponent
                                targetMove={targetMoveCell?.x === cell.x && targetMoveCell?.x === cell.x}
                                selectedCell={selectedCell}
                                prevMove={prevMoveCell?.y === cell.y && prevMoveCell?.x === cell.x}
                                currentPlayer={currentPlayer}
                                clickIsPossible={clickIsPossible}
                                click={click}
                                selected={selectedCell?.y === cell.y && selectedCell.x === cell.x}
                                key={cell.id}
                                cell={cell}
                                coordsCell={`${i} ${playerColor === Colors.BLACK ? boardMapBasedOnColorPlayer().length - index - 1 : index}`}
                            />
                        )}
                    </React.Fragment>
                )}
            </div>
        </>

    )
};

export default observer(BoardComponent)