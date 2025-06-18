import React, {useContext, useEffect, useRef, useState} from 'react';
import {INovel} from "../../models/INovel";
import { Tab } from '@headlessui/react'
import classNames from "classnames";
import { Fragment } from 'react'
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

    const [activeTab, setActiveTab] = useState(0);


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

    useEffect(() => {
        if(!audioTrack) return

        if(audioTrack.novel.slug !== novel.slug) return;

        if(active_lang === 'ru'){
            setActiveTab(0)
        }else{
            setActiveTab(1)
        }
    }, [active_slug, audioTrack, novel]);

    useEffect(()=>{
        const audioCard = document.getElementById(active_slug)
        if(audioCard){
            scrollRef.current.scrollTop(audioCard.offsetTop);
        }
    }, [trackList])


    return (

            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                <Tab.List className='mb-5'>
                    {
                        trackList && trackList.audioListRu && trackList.audioListRu.length ?

                            <Tab
                                as={Fragment}
                            >
                                {({selected}) => (
                                    <div
                                        className={classNames('px-3 py-1 border border-primary rounded mr-2 text-sm inline-block cursor-pointer', {
                                            'bg-primary text-white': selected,
                                            'text-primary': !selected
                                        })}
                                    >
                                        Ру
                                    </div>
                                )}
                            </Tab>
                            : null
                    }

                    {
                        trackList && trackList.audioListUz && trackList.audioListUz.length ?
                            <Tab
                                as={Fragment}
                            >
                                {({ selected }) => (
                                    <div
                                        className={classNames('px-3 py-1 border border-primary rounded text-sm inline-block cursor-pointer', {
                                            'bg-primary text-white': selected,
                                            'text-primary': !selected
                                        })}
                                    >
                                        Uz
                                    </div>
                                )}
                            </Tab>
                        : null
                    }


                </Tab.List>
                <div className='border border-gray-50 p-1 rounded-md'>
                    <Scrollbars autoHeight
                                autoHeightMin={100}
                                autoHeightMax={530}
                                universal={true}
                                ref={scrollRef}

                    >
                        <Tab.Panels className='outline-none pr-2 md:pr-3'>
                            {
                                trackList && trackList.audioListRu && trackList.audioListRu.length ?
                                    <Tab.Panel className='outline-none'>
                                            {
                                                trackList.audioListRu.map((audio)=>{
                                                    return(
                                                        <AudioCard audio={audio} cover={typeof novel.cover === 'string' ? novel.cover : novel.cover?.src} key={audio.file} lang='ru' onClick={()=>playSelectedTrack(audio, 'ru')}/>
                                                    )
                                                })
                                            }
                                    </Tab.Panel>
                                : null
                            }

                            {
                                trackList && trackList.audioListUz && trackList.audioListUz.length ?
                                    <Tab.Panel className='outline-none'>
                                            {
                                                trackList.audioListUz.map((audio)=>{
                                                    return(
                                                        <AudioCard audio={audio} cover={typeof novel.cover === 'string' ? novel.cover : novel.cover?.src} key={audio.file}  lang='uz' onClick={()=>playSelectedTrack(audio, 'uz')}/>
                                                    )
                                                })
                                            }
                                    </Tab.Panel>
                                : null
                            }
                        </Tab.Panels>
                    </Scrollbars>
                </div>

            </Tab.Group>

    );
};

export default React.memo(Index);
