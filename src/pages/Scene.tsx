import React, {useEffect, useState} from 'react';
import {Board} from "../models/Board";
import {Colors} from "../models/Colors";
import BoardComponent from "../components/BoardComponent";
import {useParams, useSearchParams, useNavigate} from 'react-router-dom'
import socketStore from "../store/SocketStore";
import PlayersComponent from "../components/PlayersComponent";
import Store from "../store/Store";
import {observer} from "mobx-react-lite";
import SocketStore from "../store/SocketStore";
import {Cell} from "../models/Cell";


const Scene = () => {

    const [board, setBoard] = useState<Board>(initBoard())
    const [currentPlayer, setCurrentPlayer] = useState<Colors>(Colors.WHITE)
    const [blockedBoard, setBlockedBoard] = useState<boolean>(true)
    const [searchParams, setSearchParams] = useSearchParams();

    const sessionId = useParams().id

    const navigate = useNavigate();


    useEffect(() => {

        restart()

        Store.setGameIsEnd(() => {
            console.log('game end')
            navigate('/')
        })

        socketStore.createSocket()

        socketStore.socket?.emit('initGame', sessionId)

        socketStore.addListener('newPlayerJoin', (msg: string) => {
            console.log(msg)
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
            <BoardComponent
                setCurrentPlayer={setCurrentPlayer}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                board={board}
                playerColor={searchParams.get('color') === 'black' ? Colors.BLACK : Colors.WHITE}
            />
            <PlayersComponent
                playerColor={searchParams.get('color') === 'black' ? Colors.BLACK : Colors.WHITE}
                currentPlayer={currentPlayer}
            />
        </div>
    );
};

export default observer(Scene);