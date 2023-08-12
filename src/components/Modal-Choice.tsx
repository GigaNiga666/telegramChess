import React, {FC} from 'react';
import {Colors} from "../models/Colors";
import whiteBishop from '../assets/images/figures/white-bishop.svg'
import blackBishop from '../assets/images/figures/black-bishop.svg'
import whiteKnight from '../assets/images/figures/white-knight.svg'
import blackKnight from '../assets/images/figures/black-knight.svg'
import whiteRook from '../assets/images/figures/white-rook.svg'
import blackRook from '../assets/images/figures/black-rook.svg'
import whiteQueen from '../assets/images/figures/white-queen.svg'
import blackQueen from '../assets/images/figures/black-queen.svg'
import {FiguresName} from "../models/figures/Figure";

interface IModalProps {
    currentPlayer: Colors,
    visible: boolean,
    onClick: (figure: FiguresName) => void
}

const ModalChoice: FC<IModalProps> = ({currentPlayer, visible, onClick}) => {

    if (!visible)
        return null

    function click(figure: FiguresName) {
        onClick(figure)
    }

    return (
        <div className="modal-choice">
            <div className="modal-choice__window">
                <ul className="modal-choice__list">
                    <li>
                        <button className="modal-choice__btn" onClick={e => click(FiguresName.BISHOP)}>
                            <img src={currentPlayer === Colors.WHITE ? whiteBishop : blackBishop} alt=""
                                 className="modal-choice__img"/>
                        </button>
                    </li>
                    <li>
                        <button className="modal-choice__btn" onClick={e => click(FiguresName.KNIGHT)}>
                            <img src={currentPlayer === Colors.WHITE ? whiteKnight : blackKnight} alt=""
                                 className="modal-choice__img"/>
                        </button>
                    </li>
                    <li>
                        <button className="modal-choice__btn" onClick={e => click(FiguresName.QUEEN)}>
                            <img src={currentPlayer === Colors.WHITE ? whiteQueen : blackQueen} alt=""
                                 className="modal-choice__img"/>
                        </button>
                    </li>
                    <li>
                        <button className="modal-choice__btn" onClick={e => click(FiguresName.ROOK)}>
                            <img src={currentPlayer === Colors.WHITE ? whiteRook : blackRook} alt=""
                                 className="modal-choice__img"/>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ModalChoice;