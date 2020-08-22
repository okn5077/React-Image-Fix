import React, { useState, useContext, useEffect, useCallback } from 'react';
import classes from './Start.module.css'
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
// import gameLogo from '../../assets/Images/game-logo.gif'
import UserContext from '../../context/UserContext';
import history from '../../history/history';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-image';
import Spinner from '../../components/UI/Spinner/Spinner';

const Start = props => {

    // const [userName, setUserName] = useState('');
    const [formIsValid, setFormIsValid] = useState(false);
    const [user, setUser] = useContext(UserContext);
    const [highScoreTab, setHighScoreTab] = useState(false);
    const [highScores, setHighScores] = useState({ loading: false, scores: [] });


    const inputChangedHandler = (event) => {
        if (event.target.value) {
            setFormIsValid(true);
        }
        else {
            setFormIsValid(false);
        }
        setUser({ ...user, userName: event.target.value, });
    }

    const startGame = () => {
        // props.history.push('/selectDifficulty');
        history.push('/select-difficulty');
    }

    const getHighScores = useCallback(() => {
        setHighScores({ loading: true, scores: [] })
        axios.get('/score.json').then(res => {
            const fetchedOrders = []
            for (let key in res.data) {
                fetchedOrders.push({ ...res.data[key], id: key });
            }

            setHighScores({ loading: false, scores: fetchedOrders.sort((a, b) => {
                return  parseInt(a.duration.split(":").join("")) - parseInt(b.duration.split(":").join(""));
              }) });

        }).catch(err => {
            setHighScores({ loading: false, scores: [] })
        })
    }, []);


    useEffect(() => {
        getHighScores();
    }, [getHighScores]);


    const scores = highScores.scores.map((element, index) =>
        (
            <li key={index}>{index + 1} - {element.userName}</li>
        )
    )


    let form = (
        <React.Fragment>

            <div className={classes.Start}>
                <h2>FIX Image {user.userName}</h2>

                <div className={classes.GameLogo}>
                    <img src={"./Images/game-logo.gif"} alt="MyBurger" />

                </div>


                <Input
                    key='userName'
                    elementType='input'
                    elementConfig={{ type: 'text', placeholder: 'User Name' }}
                    value={user.userName}
                    validation={{
                        required: true
                    }}
                    valid='false'
                    touched='false'
                    changed={(event) => inputChangedHandler(event)} />

                <Button btnType="Success" disabled={!formIsValid} clicked={startGame}> Start </Button>
                <Button btnType="Error" clicked={() => setHighScoreTab(true)}> High Scores </Button>


                <Modal show={highScoreTab} modalClosed={() => setHighScoreTab(false)}>
                    <h1>
                        High Scores
                </h1>
                    <ul>
                        {
                            scores
                        }
                    </ul>
                </Modal>
            </div>



        </React.Fragment>
    )

    if (highScores.loading) {
        form = <Spinner />
    }


    return (
        form
    )
}

export default Start;