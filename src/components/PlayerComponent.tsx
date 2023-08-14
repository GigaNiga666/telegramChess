import React, {FC, useEffect, useRef} from 'react';
import {Colors} from "../models/Colors";
import Timer from "./Timer";
import Store from "../store/Store";
import {useTelegram} from "../hooks/useTelegram";

interface IPlayerComponentProps {
    currentPlayer: Colors,
    playerColor: Colors,
    playerName: string
}

const PlayerComponent: FC<IPlayerComponentProps> = ({currentPlayer, playerColor, playerName}) => {
    const {tg} = useTelegram()
    const name = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        themeSetup()
    }, [])


    tg.onEvent('themeChanged', () => {
        themeSetup()
    })

    function themeSetup() {
        if (name.current) name.current.style.color = tg.colorScheme === 'light' ? '#000000' : '#ffffff'
    }

    return (
        <div className='player'>
            <span ref={name} className="player__name">{playerName}</span>
            <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
        </div>
    );
};

export default PlayerComponent;