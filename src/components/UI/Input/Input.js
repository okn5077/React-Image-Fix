

import React from 'react';
import classes from './Input.module.css'
const Input = props => {

    const inputClasses = [classes.InputElement]


    return (
        <div className={classes.Input}>
            <input
                className={inputClasses.join(" ")}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />

        </div>
    )

}

export default Input;