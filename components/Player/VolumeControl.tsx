import React, {useEffect, useState} from 'react';
import classNames from "classnames";
import 'react-rangeslider/lib/index.css'
import classes from './style.module.scss';
import disableScroll from 'disable-scroll';
import Slider from 'react-rangeslider'

interface Props {
    volume: string;
    changeVolume: (vol)=>void;
}

const VolumeControl:React.FC<Props> = ({volume, changeVolume}) => {

    const [showBar, setShowBar] = useState(false)
    const [vol, setVol] = useState(100)

    useEffect(() => {
        if(volume){
            setVol(Number(volume) * 100)
        }
    }, [])

    const onwheelChange = (e) => {
        e.preventDefault();
        disableScroll.on();
        if(vol > 100) {
            setVol(100)
            return;
        }
        if(vol < 0 ){
            setVol(0)
            return
        }

        if (e.deltaY < 0){
            setVol(vol + 10)
        }else if (e.deltaY > 0) {
            setVol(vol - 10)
        }
        changeVolume(vol)
    }


    const leaveVolumeChanger = () => {
        setShowBar(false)
        disableScroll.off();
    }

    const handleOnChange = (vol) => {
        setVol(vol)
        changeVolume(vol)
    }

    return (
        <div className='hidden md:block relative z-30 h-5' onMouseEnter={()=>setShowBar(true)} onMouseLeave={leaveVolumeChanger}>

            <div
                className={classNames('absolute left-0z-20', {
                   'block' : showBar,
                   'hidden' : !showBar
                })}
                style={{
                    width: 40,
                    height: 200,
                    bottom: 0,
                    left: -10
                }}
            >
                <div className='absolute left-0  z-20 shadow w-full h-32 bottom-10 bg-gray-100 rounded'>

                    <div className={classes.root}>
                        <Slider
                            min={0}
                            max={100}
                            value={vol}
                            orientation="vertical"
                            onChange={handleOnChange}
                        />
                    </div>


                    {/*<div className={classes.volumeRange} >*/}
                    {/*    <div className={classes.volumeTracker}  onWheel={onwheelChange} onClick={handleClick}>*/}
                    {/*        <div className={classes.volumeControl}  style={{height: vol}}/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

            </div>

            <button className='transition hover:text-primary'>
                <svg width="22" height="20" viewBox="0 0 22 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 8.16677V12.8334C0.5 13.4751 1.025 14.0001 1.66667 14.0001H5.16667L9.005 17.8384C9.74 18.5734 11 18.0484 11 17.0101V3.97843C11 2.9401 9.74 2.4151 9.005 3.1501L5.16667 7.0001H1.66667C1.025 7.0001 0.5 7.5251 0.5 8.16677ZM16.25 10.5001C16.25 8.4351 15.06 6.66177 13.3333 5.79843V15.1901C15.06 14.3384 16.25 12.5651 16.25 10.5001ZM13.3333 1.69177V1.9251C13.3333 2.36843 13.625 2.75343 14.0333 2.91677C17.0433 4.11843 19.1667 7.0701 19.1667 10.5001C19.1667 13.9301 17.0433 16.8818 14.0333 18.0834C13.6133 18.2468 13.3333 18.6318 13.3333 19.0751V19.3084C13.3333 20.0434 14.0683 20.5568 14.745 20.3001C18.7 18.7951 21.5 14.9801 21.5 10.5001C21.5 6.0201 18.7 2.2051 14.745 0.700099C14.0683 0.431766 13.3333 0.956766 13.3333 1.69177Z"/>
                </svg>
            </button>

        </div>

    );
};

export default React.memo(VolumeControl);