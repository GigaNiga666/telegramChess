import React, {FC} from 'react';
import {Figure} from "../models/figures/Figure";

interface ILostFiguresComponent {
    lostFigures: Figure[],
    position : string
}

const LostFiguresComponent: FC<ILostFiguresComponent> = ({lostFigures, position}) => {
    return (
        <ul className={`lost-figures__list ${position}`}>
            {lostFigures.map(figure =>
                <li key={figure.id} className={`lost-figures__item`} ><svg viewBox='0 0 45 45'  className={`lost-figures__img lost-figures__img--${figure.color}`}><use xlinkHref={figure.logo+'#figure'} /></svg></li>
            )}
        </ul>
    );
};

export default LostFiguresComponent;