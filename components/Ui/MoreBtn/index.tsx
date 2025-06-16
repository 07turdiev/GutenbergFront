import React from 'react';
import classes from './style.module.scss';

const Index = ({children, onClick}) => {
    return (
        <button className={classes.root} onClick={onClick}>
            {children}
        </button>
    );
};

export default Index;