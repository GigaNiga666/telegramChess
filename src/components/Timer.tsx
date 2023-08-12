import React, {FC, useEffect} from 'react';
import {Colors} from "../models/Colors";
import {useTimer} from "react-timer-hook";
import Store from "../store/Store";

interface ITimerProps {
    currentPlayer: Colors,
    color: Colors,
    firstStepIsDone?: boolean
}


const Timer: FC<ITimerProps> = ({currentPlayer, color, firstStepIsDone}) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 600);
    const {seconds, minutes, pause, resume} = useTimer({
        expiryTimestamp: time,
        onExpire: () => Store.onGameEnd(currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE),
        autoStart: false
    })


    useEffect(() => {
        if (currentPlayer === color && (firstStepIsDone === undefined || firstStepIsDone)) {
            resume()
        } else {
            pause()
        }
    }, [currentPlayer])

    return (
        <span className='timer'>
            {minutes}:{seconds === 0 ? '00' : seconds < 10 ? `0${seconds}` : seconds}
        </span>
    );
};

export default Timer;