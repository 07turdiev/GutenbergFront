import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import classNames from "classnames";
import {useAppSelector} from "../../hooks/reducer";
import {selectTrack} from "../../store/selectors/player";
import PlayerAnimation from "../Ui/PlayerAnimation";
import SpinnerDots from "../Ui/SpinnerDots";
import PlayButton from "../Ui/PlayerControls/PlayButton";
import PauseButton from "../Ui/PlayerControls/PauseButton";
import {pauseTrack, playTrack} from "../../store/actions/player";
import {useDispatch} from "react-redux";

import {selectAudioTrack} from "../../store/selectors/audio";
import { useAudioDuration } from "../../hooks/useAudioDuration";

interface Props {
    lang: string;
    audio: {
        slug: string;
        name: string;
        file: string;
        duration: number;
    };
    cover: string;
    onClick: ()=>void;
}

const Index:React.FC<Props> = ({audio, cover, onClick, lang}) => {

    const {active_slug: activeTrack, pause, loading, active_lang, currentTime} = useAppSelector(selectTrack)
    const {audio: audioTrack} = useAppSelector(selectAudioTrack)
    const dispatch = useDispatch();

    const isActive =  activeTrack === audio.slug && lang === active_lang;
    const isActivePlay =  isActive && !pause && !loading && audioTrack;

    const { duration: trackDuration } = useAudioDuration(audio.file, 'mm:ss');
    const [trackCurrentTime, setTrackCurrentTime] = useState('00:00')

    const playBook = () => {
        if(!isActive){
            return false;
        }
        if(pause) {
            dispatch(playTrack())
        } else {
            dispatch(pauseTrack())
        }
    }

    useEffect(() => {
        if(!isActive){
            setTrackCurrentTime('00:00');
        }else{
            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60);
            setTrackCurrentTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
    },[currentTime, isActive])



    return (
        <div className={classNames('col-span-5 px-2 py-2  border-2 mb-1 flex items-center cursor-pointer transition group hover:border-primary rounded-md', {
            'border-primary': isActive,
        })}
             onClick={onClick}
             id={audio.slug}
        >
            <div className='w-14 h-14 relative overflow-hidden rounded shrink-0'>
                {
                    isActivePlay || loading ? <div className={classNames('absolute top-0 left-0 w-full h-full z-10 bg-neutral-600 opacity-30')}/> : null
                }
                {
                    loading ? <SpinnerDots/>
                       :
                       <>
                           {
                               isActivePlay ? <PlayerAnimation/> : null
                           }
                       </>
                }

                <Image quality={100} src={cover} layout='fill' objectFit='cover'/>

            </div>

            <div className='pl-2'>
                <div className='font-medium leading-4 text-sm lg:text-base'>{audio.name}</div>
            </div>

            <div className='ml-auto flex items-center'>

                <span className='text-gray-600 flex items-center text-xs lg:text-sm whitespace-nowrap'>
                    {
                        isActivePlay && <>
                            {trackCurrentTime}/
                        </>
                    }

                   {trackDuration}
                </span>

                <div className='text-center w-12 h-12 flex items-center justify-center'>
                    {
                        !isActivePlay ?
                            <PlayButton onClick={playBook}/>
                            :
                            <PauseButton onClick={playBook}/>
                    }

                </div>

            </div>


        </div>
    );
};

export default Index;
