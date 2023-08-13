import React, {FC, useRef} from 'react';
import {Cell} from "../models/Cell";
import Store from "../store/Store";
import {Colors} from "../models/Colors";

interface ICellComponentProps {
    cell: Cell,
    selected: boolean,
    click: (cell: Cell, selected?: boolean) => void,
    clickIsPossible: (cell: Cell) => boolean,
    currentPlayer: Colors | null
}


const CellComponent: FC<ICellComponentProps> = ({cell, selected, click, clickIsPossible, currentPlayer}) => {

    const figure = useRef<HTMLImageElement>(null)

    let clicksOnFigure = 0
    let startX = 0, startY = 0

    function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        if (!clickIsPossible(cell) || cell.figure?.color !== currentPlayer) return false

        click(cell)

        document.onmouseover = onMouseOver
        document.onmouseout = onMouseOut
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

    function moveAt(e: any) {
        if (figure.current) {
            figure.current.style.transform = `translate(${e.clientX - startX}px, ${e.clientY - startY}px)`;
        }
    }

    function onMouseOut(e: any) {
        if (e.target.classList.contains('highlighted')) {
            e.target.classList.remove('highlighted')
        }
    }

    function onMouseOver(e: any) {
        if (!e.target.closest('.cell')) {
            onMouseUp(e)
            return
        }

        const availableCell = e.target.firstChild
        const targetCell = e.target.closest('.cell')

        if (targetCell && (e.target.closest('.available-figure') || (availableCell && availableCell.classList.contains('available')))) {
            targetCell.classList.add('highlighted')
        }
    }


    return (
        <div
            onMouseDown={e => onMouseDown(e)}
            onMouseUp={onMouseUp}
            className={`cell ${cell.color}${selected ? ' selected' : ''}${cell.available && (cell.figure || cell.takedown) ? ' available-figure' : ''}`}>

            {cell.available && !cell.takedown && !cell.figure && <div className='available'/>}
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