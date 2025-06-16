import React, {createContext, useRef, useState} from 'react';

const initialVaule = {
    player: null,
}

export const PlayerContext = createContext(initialVaule);

export const PlayerContextProvider = ({children} : { children: any }) => {
    const AdPlayer = useRef(null);
    return(
        <PlayerContext.Provider value={{player: AdPlayer}}>
            {children}
            <audio ref={AdPlayer} id='rkPlayer'/>
        </PlayerContext.Provider>
    )
}
