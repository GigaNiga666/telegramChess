import React, {FC, useRef, useState} from 'react';
import {Colors} from "../models/Colors";
import Timer from "./Timer";
import Store from "../store/Store";

interface IPlayerComponentProps {
    currentPlayer: Colors,
    playerColor: Colors,
    playerName : string
}

const PlayerComponent: FC<IPlayerComponentProps> = ({currentPlayer, playerColor, playerName}) => {

    const name = useRef<any>(null)
    const [bgColor, setBgColor] = useState<string>(getComputedStyle(document.documentElement).getPropertyValue('--tg-theme-bg-color'))

    useRef(() => {
        setBgColor(getComputedStyle(document.documentElement).getPropertyValue('--tg-theme-bg-color'))
    },[getComputedStyle(document.documentElement).getPropertyValue('--tg-theme-bg-color')])

    return (
        <div className='player'>
            <span ref={name} className="player__name">{playerName}</span>
            {bgColor}
            <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
        </div>
    );
};

export default PlayerComponent;