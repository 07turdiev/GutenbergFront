import React, {useEffect} from 'react';
import Header from "../components/Header/Header";

import { useAppSelector} from "../hooks/reducer";
import Footer from "../components/Footer";
import useLocalStorage from "../hooks/useLocalStorage";
import {setActiveTrack, setCurrentTime, setPlayerLoading} from "../store/actions/player";
import {selectTrack} from "../store/selectors/player";
import {useDispatch} from "react-redux";
import {fetchAudioOne} from "../store/actions/audio";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {

    const dispatch = useDispatch();

    const {active_slug} = useAppSelector(selectTrack)
    const [rActive] = useLocalStorage('r_active')
    const [rLocale] = useLocalStorage('r_locale')
    const [rCurrentTime] = useLocalStorage('r_currentTime')

    const setPlayer = async () => {
        if(rActive && !active_slug) {
            dispatch(setPlayerLoading(true));
            await dispatch(setCurrentTime(Number(rCurrentTime)));
            // TODO: Restore player state from localStorage
            // For now, we can't fetch individual audio without the novel context
            // await dispatch(fetchAudioOne({locale: rLocale, slug: rActive}))
            // await dispatch(setActiveTrack({active_slug: rActive, lang: rLocale, playImmediately: false}))
        }
    }

    useEffect(()=>{
        // setPlayer() // Disabled for now
    }, [rActive])


    return (
        <div className='h-full flex flex-col'>
            <Header />
            <div className='lg:pt-32 pt-20 sm:pt-24 flex-grow'>
                {children}
            </div>

            <Footer/>
        </div>
    );
};

export default MainLayout;
