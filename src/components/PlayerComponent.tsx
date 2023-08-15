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
    const player = useRef<HTMLDivElement>(null)

    useEffect(() => {
        themeSetup()
    }, [])


    tg.onEvent('themeChanged', () => {
        themeSetup()
    })

    function themeSetup() {
        if (player.current) player.current.classList.add(`${tg.colorScheme === 'dark' ? 'blackTheme' : 'lightTheme'}`)
    }

    return (
        <div ref={player} className='player'>
            <span className="player__name">{playerName}</span>
            <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
        </div>
    );
};

export default PlayerComponent;