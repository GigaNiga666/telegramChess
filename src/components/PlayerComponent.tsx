import React, {FC, useRef, useState} from 'react';
import {Colors} from "../models/Colors";
import Timer from "./Timer";
import Store from "../store/Store";
import {useTelegram} from "../hooks/useTelegram";

interface IPlayerComponentProps {
    currentPlayer: Colors,
    playerColor: Colors,
    playerName : string
}

const PlayerComponent: FC<IPlayerComponentProps> = ({currentPlayer, playerColor, playerName}) => {
    const {tg} = useTelegram()
    const name = useRef<any>(null)
    const [colorScheme, setColorScheme] = useState<string>(tg.colorScheme)


    tg.onEvent('themeChanged', () => {
        setColorScheme(tg.colorScheme)
    })

    return (
        <div className='player'>
            <span ref={name} className="player__name">{playerName}</span>
            {colorScheme}
            <Timer currentPlayer={currentPlayer} color={playerColor} firstStepIsDone={Store.firstStepIsDone}/>
        </div>
    );
};

export default PlayerComponent;