import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import history from '../../history/history';
import Button from '../../components/UI/Button/Button';
import DIFFICULTY from '../../statics/Difficulty';
import classes from './Difficulty.module.css';

const Difficulty = props => {

    const [user, setUser] = useContext(UserContext);


    if (!user.userName) {
        history.push('/');
    }

    const startGame = (difficulty) => {
        setUser({ ...user, difficulty: difficulty });
        history.push('/game');
    }

    return (
        <div className={classes.Difficulty}>
            <ul>
                <li>
                    <Button btnType="Success" clicked={() => startGame(DIFFICULTY.Easy)}> Easy </Button>
                </li>
                <li>
                    <Button btnType="Warning" clicked={() => startGame(DIFFICULTY.Medium)}> Medium </Button>
                </li>
                <li>
                    <Button btnType="Danger" clicked={() => startGame(DIFFICULTY.Hard)}> Hard </Button>
                </li>

            </ul>
        </div>
    )
}

export default Difficulty;