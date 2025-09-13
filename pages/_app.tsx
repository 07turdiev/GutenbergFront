import {AppProps} from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';
import {ToastContainer} from "react-toastify";
import {wrapper} from "../store/store";
import React, {useEffect, useRef, useState} from "react";
import Player from "../components/Player";
import {Provider} from 'react-redux';
import {PlayerContextProvider} from "../components/contexts/PlayerContext";
import {MenuProvider, useMenu} from "../components/contexts/MenuContext";
import {useRouter} from "next/router";
import TopProgressBar from "../components/Ui/TopProgressBar";
import SearchForm from "../components/SearchForm";

const AppContent: React.FC<{Component: any, pageProps: any}> = ({ Component, pageProps }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const { toggleMenu } = useMenu();

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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+F or Cmd+F for search
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                setIsSearchModalOpen(true);
            }
            // M key for menu toggle
            if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                toggleMenu();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleMenu]);

    return (
        <>
            <TopProgressBar isLoading={loading} />
            <Component {...pageProps} />
            <ToastContainer />
            <Player/>
            <SearchForm 
                open={isSearchModalOpen} 
                onClose={() => setIsSearchModalOpen(false)} 
            />
        </>
    )
}

const MyApp: React.FC<AppProps> = ({ Component, ...rest  }) => {
    const {store, props} = wrapper.useWrappedStore(rest);

    return (
        <Provider store={store}>
            <PlayerContextProvider>
                <MenuProvider>
                    <AppContent Component={Component} pageProps={props.pageProps} />
                </MenuProvider>
            </PlayerContextProvider>
        </Provider>
    )
}

export default MyApp;
