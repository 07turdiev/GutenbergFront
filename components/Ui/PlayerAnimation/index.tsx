import React from 'react';
import classes from './style.module.scss';
import classNames from "classnames";

const Index = () => {
    return (
        <div className={classes.container}>
            <div className={classNames(classes.animated, classes.playing)}/>
        </div>

    );
};

export default Index;