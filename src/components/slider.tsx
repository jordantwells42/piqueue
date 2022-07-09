import {useRanger} from 'react-ranger'
import { useState } from 'react';
import { importanceToColor } from '../utils/colors';

export default function Slider({value, setValue}: {value: number, setValue: (arg0: number) => void}){
    const [values, setValues] = useState([0.1])
    const { getTrackProps, ticks, segments, handles } = useRanger({
        values,
        onChange: handleDrag,
        onDrag: handleDrag,
        min: 0,
        max: 1,
        stepSize: 0.005,
      })

      function handleDrag(vals: number[]){
        setValues(vals)
        if (vals.length >= 1) { setValue(vals[0] as number) }
      }

      return (
        <div className='flex flex-col py-3 items-center justify-center'>
          <h1>Priority: </h1>
          <div className='border-2 border-pico-dark-blue rounded-full h-6 w-full'
            {...getTrackProps({
              style: {
              },
            })}
          >
            {segments.map(({ getSegmentProps }, idx) => (
              <div  {...getSegmentProps()} key ={idx} className={(idx == 0 ? importanceToColor((values[0] as number)) : "") + ' h-5 rounded-l-full w-5/6'}></div>
            ))}
            {handles.map(({ getHandleProps }, idx) => (
              <div className='w-3 h-full rounded-l-full rounded-r-full bg-slate-400 border-2 border-pico-dark-blue'
                {...getHandleProps({
                })}
                key={idx}
              />
            ))}
          </div>
        </div>
      )
}