import React from 'react';
import iconFlag from '../assets/images/icons/icon-flag.svg'
import iconTakeDown from '../assets/images/icons/icon-takedown.svg'
import iconExit from '../assets/images/icons/icon-exit.svg'

const GameButtonsComponent = () => {
    return (
        <div className='game-buttons'>
            <div className="game-buttons__wrapper">
                <button className="game-buttons__btn"><img src={iconExit} alt=""/></button>
                <button className="game-buttons__btn"><img src={iconTakeDown} alt=""/></button>
                <button className="game-buttons__btn"><img src={iconFlag} alt=""/></button>
            </div>
        </div>
    );
};

export default GameButtonsComponent;