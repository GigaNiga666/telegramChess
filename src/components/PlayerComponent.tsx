import React, {FC, useEffect, useRef, useState} from 'react';
import {Colors} from "../models/Colors";
import Timer from "./Timer";
import Store from "../store/Store";
import {useNavigate} from "react-router-dom";

interface IPlayerComponentProps {
    currentPlayer: Colors,
    playerColor: Colors,
    playerName : string
}

const PlayerComponent: FC<IPlayerComponentProps> = ({currentPlayer, playerColor, playerName}) => {

    const name = useRef<any>(null)

    const bgColor = getComputedStyle(document.body).getPropertyValue('--tg-theme-bg-color')

    if (bgColor === '#17212b' && name.current) {
        name.current.style.color = 'white'
    }
    else if (name.current) {
        name.current.style.color = 'black'
    }

    return (
        <div className='player'>
            <span ref={name} className="player__name">{playerName}</span>
            <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
        </div>
    );
};

export default PlayerComponent;