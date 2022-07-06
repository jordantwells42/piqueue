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
          {console.log(isOpen, "LMAO")}
          <div onClick={openPortal}>
            {button ? button : <button>Open Modal</button>}
          </div>
          {portal(
            <div className='fixed top-1/2 left-1/2 w-96 h-96 -mt-48 -ml-48'>
              <div className='w-full h-full bg-slate-100 rounded-t-2xl flex flex-col justify-center items-center'>
                {children}
              </div>
                <div className='rounded-b-2xl w-full h-auto bg-slate-100 flex font-bold flex-row justify-end text-white'>
                  <button
                    className='rounded-2xl p-2 m-2  bg-slate-400'
                    onClick={() => [closePortal(), clearState && clearState()]} 
                  >
                    Close me
                  </button>
                  {onSubmit && (
                    <button
                      className='rounded-2xl p-2 m-2 bg-blue-400'
                      onClick={() => [onSubmit(), clearState && clearState(), closePortal()]}
                    >
                      Submit
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
