import React, {FC} from 'react';
import {Colors} from "../models/Colors";
import Timer from "./Timer";
import Store from "../store/Store";

interface IPlayerComponentProps {
    currentPlayer: Colors,
    playerColor: Colors,
    playerName : string
}

const PlayerComponent: FC<IPlayerComponentProps> = ({currentPlayer, playerColor, playerName}) => {
    return (
        <div className='player'>
            <span className="player__name">{playerName}</span>
            <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
        </div>
    );
};

export default PlayerComponent;