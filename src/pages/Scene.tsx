import React, {useEffect, useRef, useState} from 'react';
import {Board} from "../models/Board";
import {Colors} from "../models/Colors";
import BoardComponent from "../components/BoardComponent";
import {useParams, useSearchParams, useNavigate} from 'react-router-dom'
import socketStore from "../store/SocketStore";
import PlayerComponent from "../components/PlayerComponent";
import Store from "../store/Store";
import {observer} from "mobx-react-lite";
import {useTelegram} from "../hooks/useTelegram";
import axios from "axios";


const Scene = () => {

    const [board, setBoard] = useState<Board>(initBoard())
    const [currentPlayer, setCurrentPlayer] = useState<Colors>(Colors.WHITE)
    const [blockedBoard, setBlockedBoard] = useState<boolean>(true)
    const [searchParams, setSearchParams] = useSearchParams();
    const {tg, queryId, user} = useTelegram()
    const [enemyUsername, setEnemyUsername] = useState<string | null>(null)
    const sessionId = useParams().id

    tg.onEvent('themeChanged', () => {
        themeSetup()
    })

    function themeSetup() {
        document.body.classList.add(`${tg.colorScheme === 'light' ? 'lightTheme' : 'blackTheme'}`)
    }


    useEffect(() => {
        themeSetup()

        restart()

        Store.setGameIsEnd(async (winnerColor) => {

            const isWin = searchParams.get('color') === winnerColor

            setBlockedBoard(true)

            tg.showAlert(`Победа ${winnerColor === Colors.WHITE ? 'белых': 'чёрных'}`)

            tg.MainButton.setText('Выйти к боту')
            tg.MainButton.show()
            tg.MainButton.onClick(async () => {
                await axios.post('https://telegram-bot-chess-backend.onrender.com/web-data', {isWin, queryId})
            })
        })

        socketStore.createSocket()

        socketStore.socket?.emit('initGame', sessionId, tg.initDataUnsafe?.user?.username)

        socketStore.addListener('newPlayerJoin', (username: string) => {
            setEnemyUsername(username)
        })

        socketStore.addListener('playerLeave', async () => {
            restart()
            await axios.post('https://telegram-bot-chess-backend.onrender.com/web-data', {isWin : true, queryId})
            tg.close()
        })

        socketStore.addListener('startGame', (color: string) => {
            if (sessionId !== tg.initDataUnsafe?.user?.username && sessionId) setEnemyUsername(sessionId)
            setSearchParams(params => {
                params.set('color', color)
                return params
            })
            setBlockedBoard(false)
        })

        socketStore.addListener('error', (msg: string) => {
            console.log(msg)
        })
    }, [])



    function restart() {
        setBoard(initBoard())
        setCurrentPlayer(Colors.WHITE)
    }

    function initBoard() {
        const newBoard = new Board()
        newBoard.initCells()
        newBoard.addFigures()
        return newBoard
    }


    return (
        <div className='main' style={{pointerEvents: blockedBoard ? 'none' : 'unset'}}>
            <PlayerComponent reverse={false} playerName={enemyUsername} currentPlayer={currentPlayer} playerColor={searchParams.get('color') === 'white' ? Colors.BLACK : Colors.WHITE}/>
            <BoardComponent
                setCurrentPlayer={setCurrentPlayer}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                board={board}
                playerColor={searchParams.get('color') === 'black' ? Colors.BLACK : Colors.WHITE}
            />
            <PlayerComponent reverse={true} playerName={tg.initDataUnsafe?.user?.username} currentPlayer={currentPlayer} playerColor={searchParams.get('color') === 'black' ? Colors.BLACK : Colors.WHITE}/>
        </div>
    );
};

export default observer(Scene);