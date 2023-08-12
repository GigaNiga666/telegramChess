import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Scene from "./pages/Scene";
import Start from "./pages/Start";


const App = () => {

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