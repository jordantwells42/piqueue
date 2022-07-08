import {useRanger} from 'react-ranger'
import { useState } from 'react';

export default function Slider(){
    const [values, setValues] = useState([10])
    const { getTrackProps, handles } = useRanger({
        values,
        onChange: setValues,
        min: 0,
        max: 100,
        stepSize: 5,
      })
     
      return (
        <>
          <div className='w-full'
            {...getTrackProps({
              style: {
                height: '4px',
                background: '#ddd',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)',
                borderRadius: '2px',
              },
            })}
          >
            {handles.map(({ getHandleProps }, idx) => (
              <div className='w-full'
                {...getHandleProps({
                  style: {
                    width: '12px',
                    height: '12px',
                    borderRadius: '100%',
                    background: 'linear-gradient(to bottom, #eee 45%, #ddd 55%)',
                    border: 'solid 1px #888',
                  },
                })}
                key={idx}
              />
            ))}
          </div>
        </>
      )
}