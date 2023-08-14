import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Scene from "./pages/Scene";
import Start from "./pages/Start";
import {useTelegram} from "./hooks/useTelegram";


const App = () => {

    const {tg} = useTelegram()

    tg.onEvent('viewportChanged', () => {
        if (!tg.isExpanded) tg.expand()
    })

    useEffect(() => {
        tg.ready()
        tg.expand()
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/game/:id' element={<Scene/>}/>
                <Route path='/' element={<Start/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;