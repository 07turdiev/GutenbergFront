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
        if(audioTrack.next){
            dispatch(fetchAudioOne({locale: active_lang, slug: audioTrack.next}))
            dispatch(setActiveTrack({active_slug: audioTrack.next, lang: active_lang, playImmediately: true}))
            dispatch(setCurrentTime(0))
        }
    }

    const setPrevPart = () => {
        if(audioTrack.prev){
            dispatch(fetchAudioOne({locale: active_lang, slug: audioTrack.prev}))
            dispatch(setActiveTrack({active_slug: audioTrack.prev, lang: active_lang, playImmediately: true}))
            dispatch(setCurrentTime(0))
        }
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
                                            <Image quality={100} src={audioTrack.novel.cover.src} width={200} height={200} objectFit='cover' className={classNames({
                                                'opacity-90':loading
                                            })}/>

                                            {
                                                loading ?
                                                    <SpinnerDots/>
                                                : null
                                            }
                                        </div>
                                        <div className='lg:pl-4 pl-2 overflow-hidden'>
                                            <h2 className='truncate max-w-max font-medium text-sm lg:text-md leading-1 cursor-pointer transition hover:text-primary'>
                                                <Link href={`/novels/${audioTrack.novel.slug}/`}>
                                                    <a >{audioTrack.novel.name}</a>
                                                </Link>
                                            </h2>
                                            <h3 className='font-medium text-xs md:text-base truncate'>{audioTrack.name}</h3>
                                            <p className='text-gray-500 text-xs lg:text-md'>{playerNovel?.author.name}</p>
                                        </div>
                                    </div>
                            }


                        </div>

                        <div className="col-span-2 lg:col-span-3 flex justify-end items-center justify-end text-right">

                            <SpeedControl selected={playerSpeed} setSelected={changeTrackSpeed} speeds={speeds}/>

                            <button className='lg:mr-5 transition hover:text-primary cursor-pointer' onClick={()=>router.push(`/novels/${audioTrack.novel.slug}/track-list`)}>
                                <svg width="22" height="21" viewBox="0 0 22 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.66667 7.6665C2.30833 7.6665 2.83333 7.1415 2.83333 6.49984C2.83333 5.85817 2.30833 5.33317 1.66667 5.33317C1.025 5.33317 0.5 5.85817 0.5 6.49984C0.5 7.1415 1.025 7.6665 1.66667 7.6665ZM1.66667 12.3332C2.30833 12.3332 2.83333 11.8082 2.83333 11.1665C2.83333 10.5248 2.30833 9.99984 1.66667 9.99984C1.025 9.99984 0.5 10.5248 0.5 11.1665C0.5 11.8082 1.025 12.3332 1.66667 12.3332ZM1.66667 2.99984C2.30833 2.99984 2.83333 2.47484 2.83333 1.83317C2.83333 1.1915 2.30833 0.666504 1.66667 0.666504C1.025 0.666504 0.5 1.1915 0.5 1.83317C0.5 2.47484 1.025 2.99984 1.66667 2.99984ZM6.33333 7.6665H20.3333C20.975 7.6665 21.5 7.1415 21.5 6.49984C21.5 5.85817 20.975 5.33317 20.3333 5.33317H6.33333C5.69167 5.33317 5.16667 5.85817 5.16667 6.49984C5.16667 7.1415 5.69167 7.6665 6.33333 7.6665ZM6.33333 12.3332H20.3333C20.975 12.3332 21.5 11.8082 21.5 11.1665C21.5 10.5248 20.975 9.99984 20.3333 9.99984H6.33333C5.69167 9.99984 5.16667 10.5248 5.16667 11.1665C5.16667 11.8082 5.69167 12.3332 6.33333 12.3332ZM5.16667 1.83317C5.16667 2.47484 5.69167 2.99984 6.33333 2.99984H20.3333C20.975 2.99984 21.5 2.47484 21.5 1.83317C21.5 1.1915 20.975 0.666504 20.3333 0.666504H6.33333C5.69167 0.666504 5.16667 1.1915 5.16667 1.83317ZM1.66667 7.6665C2.30833 7.6665 2.83333 7.1415 2.83333 6.49984C2.83333 5.85817 2.30833 5.33317 1.66667 5.33317C1.025 5.33317 0.5 5.85817 0.5 6.49984C0.5 7.1415 1.025 7.6665 1.66667 7.6665ZM1.66667 12.3332C2.30833 12.3332 2.83333 11.8082 2.83333 11.1665C2.83333 10.5248 2.30833 9.99984 1.66667 9.99984C1.025 9.99984 0.5 10.5248 0.5 11.1665C0.5 11.8082 1.025 12.3332 1.66667 12.3332ZM1.66667 2.99984C2.30833 2.99984 2.83333 2.47484 2.83333 1.83317C2.83333 1.1915 2.30833 0.666504 1.66667 0.666504C1.025 0.666504 0.5 1.1915 0.5 1.83317C0.5 2.47484 1.025 2.99984 1.66667 2.99984ZM6.33333 7.6665H20.3333C20.975 7.6665 21.5 7.1415 21.5 6.49984C21.5 5.85817 20.975 5.33317 20.3333 5.33317H6.33333C5.69167 5.33317 5.16667 5.85817 5.16667 6.49984C5.16667 7.1415 5.69167 7.6665 6.33333 7.6665ZM6.33333 12.3332H20.3333C20.975 12.3332 21.5 11.8082 21.5 11.1665C21.5 10.5248 20.975 9.99984 20.3333 9.99984H6.33333C5.69167 9.99984 5.16667 10.5248 5.16667 11.1665C5.16667 11.8082 5.69167 12.3332 6.33333 12.3332ZM5.16667 1.83317C5.16667 2.47484 5.69167 2.99984 6.33333 2.99984H20.3333C20.975 2.99984 21.5 2.47484 21.5 1.83317C21.5 1.1915 20.975 0.666504 20.3333 0.666504H6.33333C5.69167 0.666504 5.16667 1.1915 5.16667 1.83317Z"/>
                                </svg>
                            </button>

                            <VolumeControl volume={rVolume} changeVolume={changeVolume} />
                        </div>

                    </div>
                </div>

            </div>


    );
};

export default Index;
