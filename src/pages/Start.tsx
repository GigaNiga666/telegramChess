import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
const { v4 } = require('uuid');

const Start = () => {

    useEffect(() => {
        fetch('https://95f8-79-172-16-96.ngrok-free.app')
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
    }, [])

    return (
        <Link to={`/game/${v4()}`}>
            <button type='button'>Play</button>
        </Link>
    );
};

export default Start;