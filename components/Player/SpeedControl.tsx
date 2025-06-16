import {Fragment, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import { Scrollbars } from 'react-custom-scrollbars';



const SpeedControl = ({selected, setSelected, speeds}) => {

    return (

            <Listbox value={selected} onChange={setSelected}>
                <div className="relative mr-3 h-6">
                    <Listbox.Button  className="focus:outline-none relative w-full cursor-default">
                        <span className="block truncate cursor-pointer">{selected.label}</span>
                    </Listbox.Button>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className='absolute bottom-[25px] -left-[18px] shadow-lg rounded-md bg-white py-1 focus:outline-none bg-white z-30'>
                            <Scrollbars style={{ width: 55, height: 220 }}>
                                <Listbox.Options className="focus:outline-none text-base sm:text-sm w-[55px]">
                                    {speeds.map((item, personIdx) => (
                                        <Listbox.Option
                                            key={personIdx}
                                            className={({active}) =>
                                                `relative cursor-default select-none py-1 text-center  ${
                                                    active ? 'bg-red-100 text-primary' : 'text-gray-900'
                                                }`
                                            }
                                            value={item}
                                        >
                                            {({selected}) => (
                                                <>
                                                      <span
                                                          className={`block truncate cursor-pointer  ${
                                                              selected ? 'font-medium' : 'font-normal'
                                                          }`}
                                                      >
                                                        {item.label}
                                                      </span>

                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Scrollbars>
                        </div>

                    </Transition>
                </div>
            </Listbox>

    )
}

export default SpeedControl