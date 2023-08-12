import React from 'react';
import {Link} from "react-router-dom";
const { v4 } = require('uuid');

const Start = () => {

    return (
        <Link to={`/game/${v4()}`}>
            <button type='button'>Play</button>
        </Link>
    );
};

export default Start;