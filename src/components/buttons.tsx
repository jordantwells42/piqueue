
export default function Buttons({id, handleAdd, handleDelete, handleFinish}:{id:string, handleAdd:any, handleDelete:any, handleFinish:any}) {
    if (!id){
        return <p>404</p>
    } else {
        return (
            <div className='py-2 flex-row justify-center items-center'>
            <button
              onClick={handleAdd}
              className='rounded border-slate-900 border-2 m-1 p-1'
            >
              Progress
            </button>
            <button
              onClick={handleDelete}
              className='rounded border-slate-900 border-2 m-1 p-1'
            >
              Delete
            </button>
            <button
              onClick={handleFinish}
              className='rounded border-slate-900 border-2 m-1 p-1'
            >
              Finish
            </button>
          </div>
        )
        }
}