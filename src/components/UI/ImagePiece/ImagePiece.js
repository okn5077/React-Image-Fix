import React from 'react';
import classes from './ImagePiece.module.css'

const ImagePiece = props => {

    return (
        <div onClick={() => props.clicked(props.index)} className={props.default ? classes.Transparent : ''} >
            <img src={props.source} alt='' />
        </div>
    )
}


export default ImagePiece