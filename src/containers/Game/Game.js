import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import UserContext from '../../context/UserContext';
import history from '../../history/history';
import DIFFICULTY from '../../statics/Difficulty';
import SIZE from '../../statics/Size';
import classes from './Game.module.css';
import ImagePiece from '../../components/UI/ImagePiece/ImagePiece';
import * as BaseImages from '../../statics/BaseImages';
import Button from '../../components/UI/Button/Button';
import axios from '../../axios-image';
import Modal from '../../components/UI/Modal/Modal';

const Game = props => {

    const user = useContext(UserContext)[0];

    const intervalRef = useRef();

    const [game, setGame] = useState([]);
    const [diffLength, setDiffLength] = useState(0);
    const [source, setSource] = useState('./Images/GameImages/');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [displayBackgroundImage, setDisplayBackgroundImage] = useState(false);
    const gameTimer = useState(new Date())[0];
    const [duration, setDuration] = useState('')
    const [gameClasses, setGameClasses] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    const [intervalTimer, setIntervalTimer] = useState('');

    if (!user.userName) {
        history.push('/');
    }


    const shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    const setImages = useCallback(() => {
        if (diffLength) {
            let imageArray = []
            for (let id = 0; id < diffLength - 1; id++) {
                imageArray.push({
                    source: source + 'image_part_' + (id + 1) + '.jpg',
                    id: id
                });
            }
            imageArray.push({
                source: './Images/default_image.jpg',
                id: diffLength - 1,
                default: true
            });

            imageArray = shuffle(imageArray);
            setGame(imageArray);
        }
    }, [diffLength, source])


    useEffect(() => {
        if (!diffLength) {
            switch (user.difficulty) {
                case DIFFICULTY.Easy:
                    setDiffLength(Math.pow(SIZE.Easy, 2));
                    setSource(source + 'Grimaldus/');
                    setGameClasses([classes.Game, classes.Easy]);
                    setBackgroundImage(BaseImages.Grimaldus);
                    break;
                case DIFFICULTY.Medium:
                    setDiffLength(Math.pow(SIZE.Medium, 2))
                    setSource(source + 'Space Wolf/');
                    setGameClasses([classes.Game, classes.Medium]);
                    setBackgroundImage(BaseImages.SpaceWolf);
                    break;
                case DIFFICULTY.Hard:
                    setDiffLength(Math.pow(SIZE.Hard, 2))
                    setSource(source + 'Primarchs/');
                    setGameClasses([classes.Game, classes.Hard]);
                    setBackgroundImage(BaseImages.Primarchs);
                    break;
                default:
                    break
            }

        }
        else {
            setImages();
        }

        let interval = setInterval(() => {
            setDuration(msToTime(Math.abs(new Date() - gameTimer)));
        }, 1000);

        setIntervalTimer(interval);

        return () => clearInterval(interval);

    }, [diffLength, setDiffLength, setImages, setSource, source, user, gameClasses, gameTimer]);

    const checkIfMovable = (clickedIndex) => {
        let emptyPiece = game.filter(piece => piece.default)[0];
        const emptyIndex = game.findIndex(p => p.id === emptyPiece.id);
        const size = Math.sqrt(diffLength);
        if ((clickedIndex - 1) === emptyIndex && (clickedIndex % size) !== 0) {
            return true;
        }
        else if ((clickedIndex + 1) === emptyIndex && (clickedIndex % size) !== (size - 1)) {
            return true;
        }
        else if ((Math.abs(clickedIndex - emptyIndex) / size) === 1 && (Math.abs(clickedIndex - emptyIndex) % size) === 0) {
            return true;
        }
        else {
            return false
        }
    }

    const movePiece = (clickedIndex) => {
        let emptyPiece = game.filter(piece => piece.default)[0];
        const emptyIndex = game.findIndex(p => p.id === emptyPiece.id);
        let newGame = [...game];
        let clickedPiece = game[clickedIndex];
        newGame[emptyIndex] = clickedPiece;
        newGame[clickedIndex] = emptyPiece;
        setGame(newGame);

        return checkIfWin(newGame);

    }

    const saveScore = () => {
        axios.post('/score.json', { userName: user.userName, duration: duration })//.json for firebase !!
            .then(response => {
            })
            .catch(error => {
            });
    }

    const checkIfWin = (newGame) => {
        let win = true
        for (let index = 0; index < newGame.length; index++) {
            const element = newGame[index];
            const elementIndex = newGame.findIndex(p => p.id === element.id);
            if (elementIndex !== element.id) {
                win = false;
                break;
            }
        }
         setGameOver(win);
        if (win) {
            saveScore();
        }
        return win;
    }



    const arrangeImagesHandler = (clickedIndex) => {
        let win = false;
        if (win) {
            clearInterval(intervalTimer);
            return;
        }
        let emptyPiece = game.filter(piece => piece.default)[0];
        const emptyIndex = game.findIndex(p => p.id === emptyPiece.id);
        if (clickedIndex === emptyIndex)
            return;
        if (checkIfMovable(clickedIndex)) {
            win = movePiece(clickedIndex);
        }
        if (win) {
            clearInterval(intervalTimer);
            return;
        }
    }

    const msToTime = (duration) => {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    const imageList = (
        game.map((img, index) => {
            return (
                <ImagePiece
                    source={img.source}
                    key={img.id}
                    id={img.id}
                    index={index}
                    default={img.default}
                    clicked={arrangeImagesHandler} {...props} />

            )
        })
    )

    return (
        <React.Fragment>
            <img src={backgroundImage} onClick={() => setDisplayBackgroundImage(!displayBackgroundImage)} alt='' className={[classes.BackgroundImage, (displayBackgroundImage ? classes.BackgroundImageVisible : '')].join(' ')} />
            <div className={gameClasses.join(' ')} >
                <div>

                    <span ref={intervalRef}>{duration}</span>

                </div>
                <Button btnType="Success" clicked={() => setDisplayBackgroundImage(!displayBackgroundImage)}>Image</Button>
                {imageList}
            </div>

            <Modal show={gameOver} modalClosed={() => history.push('/')}>
                <h1>Congrats : {user.userName}</h1>
                <h2>Your Score : {duration}</h2>
            </Modal>
        </React.Fragment>
    )
}

export default Game;