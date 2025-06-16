import {AppProps} from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';
import {ToastContainer} from "react-toastify";
import {wrapper} from "../store/store";
import React, {useEffect, useRef} from "react";
import Player from "../components/Player";
import {Provider} from 'react-redux';
import {PlayerContextProvider} from "../components/contexts/PlayerContext";



const MyApp: React.FC<AppProps> = ({ Component, ...rest  }) => {
    const {store, props} = wrapper.useWrappedStore(rest);
    return (
        <Provider store={store}>
            <PlayerContextProvider>
                <Component {...props.pageProps} />
                <ToastContainer />
                <Player/>
            </PlayerContextProvider>
        </Provider>
    )
}

export default MyApp;
