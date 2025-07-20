import React, {useContext, useEffect, useRef, useState} from 'react';
import {INovel} from "../../models/INovel";
import classNames from "classnames";
import {IAudioList} from "../../models/IAudioList";
import {
    pauseTrack, playTrack,
    setActiveTrack,
    setCurrentTime, setPlayerLoading
} from "../../store/actions/player";
import {useAppSelector} from "../../hooks/reducer";
import AudioCard from "../AudioCard";
import {useDispatch} from "react-redux";
import {selectTrack} from "../../store/selectors/player";
import {selectAudioTrack} from "../../store/selectors/audio";
import {fetchAudioOne} from "../../store/actions/audio";
import {setAudioTrack} from "../../store/reducers/AudioSlice";
import useLocalStorage from "../../hooks/useLocalStorage";
import {PlayerContext} from "../contexts/PlayerContext";
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
    trackList: IAudioList;
    novel: INovel;
}

const Index:React.FC<Props> = ({
       trackList,
       novel
   }) => {

    const dispatch = useDispatch();
    const {active_slug, active_lang} = useAppSelector(selectTrack)
    const {audio: audioTrack} = useAppSelector(selectAudioTrack)

    const [rActive, setRActive] = useLocalStorage('r_active');
    const [, setRLocale] = useLocalStorage('r_locale');


    const {player} = useContext(PlayerContext)
    const AudioPlayer = player.current;

    const scrollRef = useRef(null);

    const playSelectedTrack = async (track, lang) => {
        if(track.slug == active_slug && active_lang === lang){
            return
        }
        AudioPlayer.currentTime = 0;
        setRActive(track.slug)
        setRLocale(lang)
        dispatch(pauseTrack());
        dispatch(setCurrentTime(0));
        dispatch(setPlayerLoading(true));
        
        // Create track data directly instead of fetching
        // Handle cover - it might be a string URL or an object with src property
        const coverObj = typeof novel.cover === 'string' 
            ? { src: novel.cover } 
            : (novel.cover || { src: '' });
            
        const trackData = {
            name: track.name,
            file: track.file,
            novel: {
                author: novel.author ? [novel.author] : [],
                cover: coverObj,
                name: novel.name,
                slug: novel.slug
            },
            next: null,
            prev: null
        };
        
        // Dispatch the track data directly to the audio reducer
        dispatch(setAudioTrack(trackData));
        
        await dispatch(setActiveTrack({active_slug: track.slug, lang: lang, playImmediately: true}))
        await dispatch(playTrack());
        AudioPlayer.play().catch((e) => {
            console.log(e);
        });
    }



    useEffect(()=>{
        const audioCard = document.getElementById(active_slug)
        if(audioCard){
            scrollRef.current.scrollTop(audioCard.offsetTop);
        }
    }, [trackList])


    return (

            <div className='border border-gray-50 p-1 rounded-md'>
                <Scrollbars autoHeight
                            autoHeightMin={100}
                            autoHeightMax={530}
                            universal={true}
                            ref={scrollRef}

                >
                    <div className='outline-none pr-2 md:pr-3'>
                        {
                            trackList && trackList.audioListRu && trackList.audioListRu.length ?
                                <div className='outline-none'>
                                        {
                                            trackList.audioListRu.map((audio)=>{
                                                return(
                                                    <AudioCard audio={audio} cover={typeof novel.cover === 'string' ? novel.cover : novel.cover?.src} key={audio.file} lang='ru' onClick={()=>playSelectedTrack(audio, 'ru')}/>
                                                )
                                            })
                                        }
                                </div>
                            : null
                        }

                        {
                            trackList && trackList.audioListUz && trackList.audioListUz.length ?
                                <div className='outline-none'>
                                        {
                                            trackList.audioListUz.map((audio)=>{
                                                return(
                                                    <AudioCard audio={audio} cover={typeof novel.cover === 'string' ? novel.cover : novel.cover?.src} key={audio.file}  lang='uz' onClick={()=>playSelectedTrack(audio, 'uz')}/>
                                                )
                                            })
                                        }
                                </div>
                            : null
                        }
                    </div>
                </Scrollbars>
            </div>

    );
};

export default React.memo(Index);
