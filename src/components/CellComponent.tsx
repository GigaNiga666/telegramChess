import React, {FC, useRef} from 'react';
import {Cell} from "../models/Cell";
import Store from "../store/Store";
import {Colors} from "../models/Colors";
import {useTelegram} from "../hooks/useTelegram";
import {FiguresName} from "../models/figures/Figure";

interface ICellComponentProps {
    cell: Cell,
    selected: boolean,
    click: (cell: Cell, selected?: boolean) => void,
    clickIsPossible: (cell: Cell) => boolean,
    currentPlayer: Colors | null,
    coordsCell: string,
    selectedCell : Cell | null
}


const CellComponent: FC<ICellComponentProps> = ({cell, selected, click, clickIsPossible, currentPlayer, coordsCell, selectedCell}) => {

    const figure = useRef<HTMLImageElement>(null)
    const {tg} = useTelegram()

    let clicksOnFigure = 0
    let startX = 0, startY = 0

    function onMouseDown(e: React.MouseEvent) {
        if (!clickIsPossible(cell) || cell.figure?.color !== currentPlayer || e.button !== 0 || tg.platform !== 'tdesktop') return false

        click(cell)

        document.onmousemove = moveAt
        Store.setFigure(figure.current)

        if (figure.current) {
            startX = figure.current.getBoundingClientRect().x + figure.current.getBoundingClientRect().width / 2
            startY = figure.current.getBoundingClientRect().y + figure.current.getBoundingClientRect().height / 2
            figure.current.style.position = 'relative'
            figure.current.style.zIndex = '1000'
            moveAt(e)
            figure.current.style.pointerEvents = 'none'
        }
    }

    function onMouseUp(e: any) {
        document.onmouseover = null
        document.onmousemove = null

        if (e.target.closest('.available-figure') || (e.target.firstChild && e.target.firstChild.classList?.contains('available'))) {
            click(cell)
        }

        if (Store.currentFigure) {
            if (!e.target.classList.contains('selected')) {
                click(cell, true)
            } else if (clicksOnFigure === 1) {
                clicksOnFigure = 0
                click(cell, true)
            } else {
                clicksOnFigure += 1
            }
            Store.currentFigure.style.zIndex = '1'
            Store.currentFigure.style.pointerEvents = 'unset'
            Store.currentFigure.style.transform = `translate(0px, 0px)`;

            Store.setFigure(null)
        }
    }

    function moveAt(e: MouseEvent | React.MouseEvent) {
        if (figure.current) {
            figure.current.style.transform = `translate(${e.clientX - startX}px, ${e.clientY - startY}px)`;
        }
    }

    function onTouchStart(e : any) {
        if (!clickIsPossible(cell) || cell.figure?.color !== currentPlayer) return false

        click(cell)

        document.ontouchmove = touchMoveAt

        if (figure.current) {
            startX = figure.current.getBoundingClientRect().x + figure.current.getBoundingClientRect().width / 2
            startY = figure.current.getBoundingClientRect().y + figure.current.getBoundingClientRect().height / 2
            figure.current.style.position = 'relative'
            figure.current.style.zIndex = '1000'
            touchMoveAt(e)
            figure.current.style.pointerEvents = 'none'
        }
    }

    function touchMoveAt(e : any) {
        if (figure.current) {
            figure.current.style.transform = `translate(${e.touches[0].clientX - startX}px, ${e.touches[0].clientY - startY}px)`;
        }
    }

    function onTouchEnd(e : any) {
        document.ontouchmove = null

        const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)

        if (target?.closest('.available-figure') || (target?.firstChild && target?.children[0].classList.contains('available'))) {
            click(cell.board.getCell(parseInt(target?.closest('.cell')?.id[0] as string, 10), parseInt(target?.closest('.cell')?.id[2] as string, 10)))
        }

        if (figure.current) {
            if (!target?.closest('.selected')) {
                click(cell, true)
            } else if (clicksOnFigure === 1) {
                clicksOnFigure = 0
                click(cell, true)
            } else {
                clicksOnFigure += 1
            }
            figure.current.style.zIndex = '1'
            figure.current.style.pointerEvents = 'unset'
            figure.current.style.transform = `translate(0px, 0px)`;

            Store.setFigure(null)
        }
    }


    function onTouchCancel(e : any) {
        if (figure.current) {
            click(cell, true)
            figure.current.style.zIndex = '1'
            figure.current.style.pointerEvents = 'unset'
            figure.current.style.transform = `translate(0px, 0px)`;
            Store.setFigure(null)
        }
    }

    return (
        <div
            id={coordsCell}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
            className={`cell ${cell.color}${selected ? ' selected' : ''}${cell.available && (cell.figure || (cell.takedown && selectedCell?.figure?.name === FiguresName.PAWN)) ? ' available-figure' : ''}`}>

            {cell.available && !cell.takedown && <div className='available'/>}
            {cell.figure?.logo &&
            <img
                ref={figure}
                className='cell__img'
                draggable={false}
                src={cell.figure.logo}
                alt=""
            />}

        </div>
    );
};

export default CellComponent;