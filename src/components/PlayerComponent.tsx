import React, {FC} from 'react';
import {Colors} from "../models/Colors";
import Timer from "./Timer";
import Store from "../store/Store";

interface IPlayerComponentProps {
    currentPlayer: Colors,
    playerColor: Colors,
    playerName: string | null | undefined,
    reverse : boolean
}

const PlayerComponent: FC<IPlayerComponentProps> = ({currentPlayer, playerColor, playerName, reverse}) => {

    return (
        <div className='player'>
            {
                reverse ?
                    <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/> :
                    <span className="player__name">{playerName ? `@${playerName}` : 'Ожидаем соперника...'}</span>
            }
            {
                reverse ?
                    <span className="player__name">{playerName ? `@${playerName}` : 'Ожидаем соперника...'}</span> :
                    <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
            }
        </div>
    );
};

export default PlayerComponent;