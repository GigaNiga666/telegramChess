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
    const [fgfgf, setDhgf] = useState('')

    useEffect(() => {
        setDhgf(bgColor)
    },[bgColor])

    return (
        <div className='player'>
            <span ref={name} className="player__name">{playerName}</span>
            {fgfgf}
            <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
        </div>
    );
};

export default PlayerComponent;