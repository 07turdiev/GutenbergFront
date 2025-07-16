import React from 'react';
import {getTrackBackground, Range} from "react-range";

interface Props {
    min: number;
    max: number;
    value: number;
    changeProgress: (val) => void
}

const RangeProgress:React.FC<Props> = ({min, max, value, changeProgress}) => {
    return (
        <div className='h-[10px] absolute top-0 left-0 w-full z-10 overflow-hidden'>
            <Range
                step={1}
                min={min}
                max={max}
                values={[value]}
                onChange={changeProgress}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '10px',
                            width: '100%',
                            //backgroundColor: '#f5f5f5'
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: "8px",
                                width: "100%",
                                borderRadius: 0,
                                background: getTrackBackground({
                                    values: [value],
                                    colors: ["#cd1b17", "rgba(0,0,0,0.1)"],
                                    min: 0,
                                    max: max
                                }),
                                alignSelf: "center"
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            overflow: 'hidden',
                            height: 0,
                            width: 0,
                        }}
                    />
                )}
            />
        </div>
    );
};

export default RangeProgress;
