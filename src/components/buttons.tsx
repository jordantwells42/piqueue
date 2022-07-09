
export default function Buttons({id, handleAdd, handleDelete, handleFinish}:{id:string, handleAdd:any, handleDelete:any, handleFinish:any}) {
    if (!id){
        return <p>404</p>
    } else {
        return (
            <div className='py-2 w-5/6 md:w-1/2 flex flex-row flex-wrap justify-between items-center text-pico-white'>
            <button
              onClick={handleDelete}
              className='rounded border-pico-dark-blue border-2 m-1 p-1 bg-pico-pink'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
            </button>
            <button
              onClick={handleAdd}
              className='rounded border-pico-dark-blue border-2 m-1 p-1 bg-pico-mid-blue'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
</svg>
            </button>
            <button
              onClick={handleFinish}
              className='rounded border-pico-dark-blue border-2 m-1 p-1  bg-pico-dark-green'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
</svg>
            </button>
          </div>
        )
        }
}