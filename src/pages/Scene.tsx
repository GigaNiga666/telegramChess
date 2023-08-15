import React, {useEffect, useState} from 'react';
import {Board} from "../models/Board";
import {Colors} from "../models/Colors";
import BoardComponent from "../components/BoardComponent";
import {useParams, useSearchParams, useNavigate} from 'react-router-dom'
import socketStore from "../store/SocketStore";
import PlayerComponent from "../components/PlayerComponent";
import Store from "../store/Store";
import {observer} from "mobx-react-lite";
import {useTelegram} from "../hooks/useTelegram";


const Scene = () => {

    const [board, setBoard] = useState<Board>(initBoard())
    const [currentPlayer, setCurrentPlayer] = useState<Colors>(Colors.WHITE)
    const [blockedBoard, setBlockedBoard] = useState<boolean>(true)
    const [searchParams, setSearchParams] = useSearchParams();
    const {tg} = useTelegram()
    const [enemyUsername, setEnemyUsername] = useState<string | null>(null)

    const sessionId = useParams().id

    const navigate = useNavigate();


    useEffect(() => {

        restart()

        Store.setGameIsEnd(() => {
            console.log('game end')
            navigate('/')
        })

        socketStore.createSocket()

        socketStore.socket?.emit('initGame', sessionId, tg.initDataUnsafe?.user?.username)

        socketStore.addListener('newPlayerJoin', (username: string) => {
            setEnemyUsername(username)
        })

        socketStore.addListener('playerLeave', (msg: string) => {
            restart()
            console.log(msg)
        })

        socketStore.addListener('startGame', (msg: string) => {
            console.log(msg)
            setSearchParams(params => {
                params.set('color', msg)
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
            <PlayerComponent playerName={enemyUsername ? enemyUsername : 'Ожидаем соперника...'} currentPlayer={currentPlayer} playerColor={searchParams.get('color') === 'white' ? Colors.BLACK : Colors.WHITE}/>
            <BoardComponent
                setCurrentPlayer={setCurrentPlayer}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                board={board}
                playerColor={searchParams.get('color') === 'black' ? Colors.BLACK : Colors.WHITE}
            />
            <PlayerComponent playerName={tg.initDataUnsafe?.user?.username} currentPlayer={currentPlayer} playerColor={searchParams.get('color') === 'black' ? Colors.BLACK : Colors.WHITE}/>
        </div>
    );
};

export default observer(Scene);