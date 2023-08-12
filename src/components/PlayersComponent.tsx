import React, {FC} from 'react';
import {Colors} from "../models/Colors";
import Timer from "./Timer";
import Store from "../store/Store";
import iconFlag from '../assets/images/icons/icon-flag.svg'
import iconHalf from '../assets/images/icons/icon-half.svg'

interface IPlayerComponentProps {
    currentPlayer: Colors,
    playerColor: Colors
}

const PlayersComponent: FC<IPlayerComponentProps> = ({currentPlayer, playerColor}) => {
    return (
        <div className='players'>
            <div className="player">
                <Timer currentPlayer={currentPlayer} color={playerColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK}
                       firstStepIsDone={Store.firstStepIsDone}/>
                <span className="player__name">Player 1</span>
            </div>
            <div className="players__buttons">
                <button className="players__btn">
                    <img className='players__icon--flag' src={iconFlag} alt=""/>
                </button>
                <button className="players__btn">
                    <img className='players__icon--half' src={iconHalf} alt=""/>
                </button>
            </div>
            <div className="player">
                <span className="player__name">Player 2</span>
                <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
            </div>
        </div>
    );
};

export default PlayersComponent;