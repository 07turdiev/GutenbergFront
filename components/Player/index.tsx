import React, {useContext, useEffect, useState} from 'react';
import {useAppSelector} from "../../hooks/reducer";
import {
    playTrack,
    pauseTrack,
    setDuration,
    setCurrentTime,
    setCurrentVolume, setActiveTrack, setPlayerLoading, setPlayerNovel, setTrackSpeed,
} from "../../store/actions/player";
import RangeProgress from "./RangeProgress";
import {selectTrack} from "../../store/selectors/player";
import Image from 'next/image';
import VolumeControl from "./VolumeControl";
import SpeedControl from './SpeedControl';
import StepBack from "../Ui/PlayerControls/StepBack";
import PrevTrack from "../Ui/PlayerControls/PrevTrack";
import PlayButton from "../Ui/PlayerControls/PlayButton";
import PauseButton from "../Ui/PlayerControls/PauseButton";
import StepForward from "../Ui/PlayerControls/StepForward";
import NextTrack from "../Ui/PlayerControls/NextTrack";
import AddToBookmark from "../Ui/PlayerControls/AddToBookmark";
import useLocalStorage from "../../hooks/useLocalStorage";
import {fetchAudioOne} from "../../store/actions/audio";
import {useRouter} from "next/router";
import {selectAudioTrack} from "../../store/selectors/audio";
import {useDispatch} from "react-redux";
import SpinnerDots from '../../components/Ui/SpinnerDots';
import classNames from "classnames";
import * as moment from "moment";
import {deleteFromSavedNovel, saveNovel} from "../../store/actions/novel";
import momentDurationFormatSetup from "moment-duration-format";
import Link from 'next/link';
import {selectAuth} from "../../store/selectors/auth";
import {PlayerContext} from "../contexts/PlayerContext";
momentDurationFormatSetup(moment);
import { BiX } from "react-icons/bi";


const speeds = [
    {
        label: '0.5x',
        value: 0.5,
    },
    {
        label: '0.7x',
        value: 0.7,
    },
    {
        label: '0.8x',
        value: 0.8,
    },
    {
        label: '0.9x',
        value: 0.9,
    },
    {
        label: '1x',
        value: 1,
    },
    {
        label: '1.1x',
        value: 1.1,
    },
    {
        label: '1.2x',
        value: 1.2,
    },
    {
        label: '1.3x',
        value: 1.3,
    },
    {
        label: '1.5x',
        value: 1.5,
    },
    {
        label: '1.7x',
        value: 1.7,
    },
    {
        label: '2x',
        value: 2,
    },
]

const Index = () => {

    const {active_slug, pause, active_lang, duration, currentTime, playImmediately, loading, playerNovel, trackSpeed, playerLoading} = useAppSelector(selectTrack);
    const {audio: audioTrack} = useAppSelector(selectAudioTrack);


    const {isLogin} = useAppSelector(selectAuth)
    const {player} = useContext(PlayerContext)
    const AudioPlayer = player.current;

    const dispatch = useDispatch();

    const [rVolume, setRVolume] = useLocalStorage('r_volume')
    const [, setRCurrentTime] = useLocalStorage('r_currentTime')


   const [playerSpeed, setPlayerSpeed] = useState(speeds[4])

    const router = useRouter();

    useEffect(() => {
        if(audioTrack){
            //dispatch(setPlayerLoading(false));
            setAudio();
        }
    }, [audioTrack])

    const setAudio = () => {

            dispatch(setPlayerNovel({locale: router.locale, slug: audioTrack.novel.slug}))

            AudioPlayer.src = audioTrack.file;
            AudioPlayer.currentTime = currentTime;
            AudioPlayer.volume = rVolume ? rVolume : 1;
            AudioPlayer.playbackRate = trackSpeed

            AudioPlayer.onloadedmetadata = () => {
                dispatch(setPlayerLoading(false));
                if(playImmediately) {
                    dispatch(playTrack());
                    AudioPlayer.play().catch((e) => {
                        console.log(e);
                        alert(e);
                    });
                }
                dispatch(setDuration(Math.ceil(AudioPlayer.duration)))
            }

        AudioPlayer.ontimeupdate =  () => {
            dispatch(setCurrentTime(Math.ceil(AudioPlayer.currentTime)))
            setRCurrentTime(Math.ceil(AudioPlayer.currentTime).toString());
        }

        AudioPlayer.onprogress = () => {
            bufferedProgress()
        }

        AudioPlayer.onended = () => {
            setNextPart();
            dispatch(pauseTrack())
        }
    }

    const playBook = () => {
        if(pause) {
            dispatch(playTrack())
            AudioPlayer.currentTime = currentTime;
            AudioPlayer.play().catch((e)=>{
                console.log(e)
            });
        } else {
            dispatch(pauseTrack())
            AudioPlayer.pause();
        }
    }

    useEffect(()=>{
        if(!AudioPlayer){
            return
        }
        if(pause){
            dispatch(pauseTrack())
            AudioPlayer.pause();
        } else {
            dispatch(playTrack())
            AudioPlayer.play().catch((e)=>{
                console.log(e)
            });
        }
    }, [pause, AudioPlayer])

    const bufferedProgress = () => {
        let duration =  AudioPlayer.duration;
        if (duration > 0) {
            for (let i = 0; i < AudioPlayer.buffered.length; i++) {
                if (AudioPlayer.buffered.start(AudioPlayer.buffered.length - 1 - i) < AudioPlayer.currentTime) {
                    document.getElementById("buffered-amount").style.width = (AudioPlayer.buffered.end(AudioPlayer.buffered.length - 1 - i) / duration) * 100 + "%";
                    break;
                }
            }
        }
    }

    const changeProgress = (val) => {
        AudioPlayer.currentTime = val[0];
        dispatch(setCurrentTime(val[0]));
    }

    const setNextPart = () => {
        // Next/Prev functionality disabled in new API structure
        // if(audioTrack.next){
        //     dispatch(fetchAudioOne({locale: active_lang, slug: audioTrack.next}))
        //     dispatch(setActiveTrack({active_slug: audioTrack.next, lang: active_lang, playImmediately: true}))
        //     dispatch(setCurrentTime(0))
        // }
    }

    const setPrevPart = () => {
        // Next/Prev functionality disabled in new API structure
        // if(audioTrack.prev){
        //     dispatch(fetchAudioOne({locale: active_lang, slug: audioTrack.prev}))
        //     dispatch(setActiveTrack({active_slug: audioTrack.prev, lang: active_lang, playImmediately: true}))
        //     dispatch(setCurrentTime(0))
        // }
    }

    const changeVolume = (vol) => {
        const volume =  Number(vol) / 100
        AudioPlayer.volume = volume;
        setRVolume(volume.toString());
        dispatch(setCurrentVolume(volume));
    }

    const setStepBack = () => {
        AudioPlayer.pause();
        AudioPlayer.currentTime = currentTime - 15;
        dispatch(setCurrentTime(currentTime - 15));
        dispatch(playTrack());
        AudioPlayer.play().catch((e)=>{
            console.log(e)
        });
    }

    const setStepForward = () => {
        AudioPlayer.pause();
        AudioPlayer.currentTime = currentTime + 15;
        dispatch(setCurrentTime(currentTime + 15));
        dispatch(playTrack());
        AudioPlayer.play().catch((e)=>{
            console.log(e)
        });
    }

    const addToMark = async () => {
        if(!playerNovel){
            return
        }
        if(!playerNovel.saved){
            await dispatch(saveNovel({
                locale:  router.locale,
                slug: audioTrack.novel.slug
            }))
        }else {
            await dispatch(deleteFromSavedNovel({
                locale:  router.locale,
                slug: audioTrack.novel.slug
            }))
        }
        await dispatch(setPlayerNovel({locale: active_lang, slug: audioTrack.novel.slug}))
    }

    const changeTrackSpeed = (val: {value: number, label: string}) => {
        dispatch(setTrackSpeed(val.value));
        setPlayerSpeed(val)
    }

    useEffect(()=>{
        if(!AudioPlayer){
            return
        }else{
            AudioPlayer.playbackRate = trackSpeed
        }
    }, [playerSpeed])

    const [, setRActive] = useLocalStorage('r_active')

    const closePlayer = () => {
        setRActive('')
        dispatch(pauseTrack())
        dispatch(setActiveTrack({active_slug: '', lang: '', playImmediately: false}))
        AudioPlayer.pause();
    }

    if(!active_slug || router.pathname === '/login' || router.pathname === '/registration'){
        return null
    }


    return (
            <div className='fixed left-0 bottom-0 bg-gray-50 lg:h-24 h-20 w-full flex items-center z-50'>

                <div className='absolute top-[10px] right-[10px] text-2xl cursor-pointer' onClick={closePlayer}>
                    <BiX/>
                </div>

                {
                    duration ?
                        <RangeProgress min={0} max={duration} value={ currentTime} changeProgress={changeProgress}/>
                    :  <div className='h-2 absolute top-0 left-0 w-full h-2 z-10 overflow-hidden'/>
                }


                <span id="buffered-amount" className='absolute top-0 left-0 z-9 bg-gray-200 w-0 h-2 block'/>

                <div className="container mx-auto px-3">

                    <div className="grid grid-cols-12 gap-3 items-center">

                        <div className={classNames('lg:col-span-3', {
                            'col-span-4': isLogin,
                            'col-span-3': !isLogin
                        })}>
                            <div className="flex items-center">

                                <div className='hidden lg:flex items-center'>
                                    <StepBack onClick={setStepBack} disabled={loading}/>
                                    <PrevTrack onClick={setPrevPart} disabled={loading || !audioTrack?.prev}/>
                                </div>

                                {
                                    pause ?
                                        <PlayButton onClick={playBook} className='md:mr-5 mr-3' disabled={loading}/>
                                        :
                                        <PauseButton onClick={playBook} className='md:mr-5 mr-3' disabled={loading}/>
                                }

                                <NextTrack  onClick={setNextPart} disabled={loading || !audioTrack?.next}/>

                                <div className="hidden lg:flex">
                                    <StepForward onClick={setStepForward} disabled={loading}/>
                                </div>
                                {
                                    isLogin && playerNovel ?
                                        <AddToBookmark onClick={addToMark} active={playerNovel?.saved} disabled={loading}/>
                                    : null
                                }
                            </div>
                        </div>

                        <div className={classNames('lg:col-span-6', {
                            'col-span-6': isLogin,
                            'col-span-7': !isLogin,
                        })}>

                            {
                                !audioTrack || playerLoading ?
                                    'Загрузка трека ...'
                                :
                                    <div className='flex items-center'>
                                        <div className='lg:w-14 lg:h-14 shrink-0 w-10 h-10 bg-gray-200 rounded overflow-hidden relative'>
                                            {audioTrack.novel.cover?.src ? (
                                                <Image quality={100} src={audioTrack.novel.cover.src} width={200} height={200} objectFit='cover' className={classNames({
                                                    'opacity-90':loading
                                                })}/>
                                            ) : (
                                                <div className='w-full h-full bg-gray-300' />
                                            )}

                                            {
                                                loading ?
                                                    <SpinnerDots/>
                                                : null
                                            }
                                        </div>
                                        <div className='lg:pl-4 pl-2 overflow-hidden'>
                                            <h2 className='truncate max-w-max font-medium text-sm lg:text-md leading-1 cursor-pointer transition hover:text-primary'>
                                                <Link href={`/books/${audioTrack.novel.slug}/`}>
                                                    <a >{audioTrack.novel.name}</a>
                                                </Link>
                                            </h2>
                                            <h3 className='font-medium text-xs md:text-base truncate'>{audioTrack.name}</h3>
                                            <p className='text-gray-500 text-xs lg:text-md'>
                                                {playerNovel?.author?.name || 
                                                 (audioTrack.novel.author?.[0]?.name || '')}
                                            </p>
                                        </div>
                                    </div>
                            }


                        </div>

                        <div className="col-span-2 lg:col-span-3 flex justify-end items-center justify-end text-right">

                            <SpeedControl selected={playerSpeed} setSelected={changeTrackSpeed} speeds={speeds}/>

                            <VolumeControl volume={rVolume} changeVolume={changeVolume} />
                        </div>

                    </div>
                </div>

            </div>


    );
};

export default Index;
