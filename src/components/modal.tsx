import { useTaskStore } from '../hooks'
import { PortalWithState } from 'react-portal'
import { useEffect, useState } from 'react'

export default function Modal ({
  children,
  button,
  setOpen,
  onSubmit,
  clearState
}: {
  button?: JSX.Element
  children: JSX.Element
  setOpen: (open: boolean) => void
  onSubmit?: () => void,
  clearState?: () => void
}) {


  

  return (
    <PortalWithState  closeOnEsc>
      {({ openPortal, closePortal, isOpen, portal }) => (
        <>
          {setOpen(isOpen)}
          <div onClick={openPortal}>
            {button ? button : <button>Open Modal</button>}
          </div>
          {portal(
            <div className='border-4 rounded-2xl border-pico-dark-blue bg-slate-100  fixed top-5 text-sm md:text-base w-full h-auto max-h-[75%]  md:top-1/2 md:left-1/2 md:w-96 md:-mt-48 md:-ml-48'>
              <div className='w-full h-full  rounded-t-2xl flex flex-col justify-start md:justify-center items-center'>
                {children}
              </div>
                <div className='rounded-b-2xl w-full flex  flex-row justify-end items-start text-pico-white font-main'>
                  <button
                    className='rounded-2xl p-2 m-2 font-main border-4 border-pico-dark-blue bg-pico-pink'
                    onClick={() => [closePortal(), clearState && clearState()]} 
                  >
                    close me
                  </button>
                  {onSubmit && (
                    <button
                      className='rounded-2xl p-2 m-2 font-main border-4 border-pico-dark-blue bg-pico-mid-blue'
                      onClick={() => [onSubmit(), clearState && clearState(), closePortal()]}
                    >
                      submit
                    </button>
                  )}
                
              </div>
            </div>
          )}
        </>
      )}
    </PortalWithState>
  )
}
