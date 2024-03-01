
const NotesBlock = (props:any) => {
   const notes = props.notes || [];
   const appointmentId = props.appointmentId;
   return (
      <div className='panel p-4'>
         <h3 className="font-semibold text-lg dark:text-white-light">Notes</h3>
      </div>
   )
}

export default NotesBlock;