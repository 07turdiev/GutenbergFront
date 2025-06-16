import {AppProps} from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';
import {ToastContainer} from "react-toastify";
import {wrapper} from "../store/store";
import React, {useEffect, useRef, useState} from "react";
import Player from "../components/Player";
import {Provider} from 'react-redux';
import {PlayerContextProvider} from "../components/contexts/PlayerContext";
import {useRouter} from "next/router";
import SpinnerDots from "../components/Ui/SpinnerDots";

const MyApp: React.FC<AppProps> = ({ Component, ...rest  }) => {
    const {store, props} = wrapper.useWrappedStore(rest);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setLoading(true);
        };
        const handleComplete = () => {
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    return (
        <Provider store={store}>
            <PlayerContextProvider>
                {loading && (
                    <div className="fixed inset-0 z-50 bg-white bg-opacity-75 flex items-center justify-center">
                        <SpinnerDots />
                    </div>
                )}
                <Component {...props.pageProps} />
                <ToastContainer />
                <Player/>
            </PlayerContextProvider>
        </Provider>
    )
}

export default MyApp;
