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
import TopProgressBar from "../components/Ui/TopProgressBar";
import SearchForm from "../components/SearchForm";

const MyApp: React.FC<AppProps> = ({ Component, ...rest  }) => {
    const {store, props} = wrapper.useWrappedStore(rest);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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

    // Ctrl+K keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchModalOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <Provider store={store}>
            <PlayerContextProvider>
                <TopProgressBar isLoading={loading} />
                <Component {...props.pageProps} />
                <ToastContainer />
                <Player/>
                <SearchForm 
                    open={isSearchModalOpen} 
                    onClose={() => setIsSearchModalOpen(false)} 
                />
            </PlayerContextProvider>
        </Provider>
    )
}

export default MyApp;
