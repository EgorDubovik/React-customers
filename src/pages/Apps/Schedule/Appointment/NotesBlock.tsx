import React, { useState } from 'react';
import IconPencil from '../../../../components/Icon/IconPencil';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axiosClient from '../../../../store/axiosClient';
import { ButtonLoader } from '../../../../components/loading/ButtonLoader';
import { SmallDangerLoader } from '../../../../components/loading/SmallCirculeLoader';
import { useAppointmentContext } from '../../../../context/AppointmentContext';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../store';
const NotesBlock = () => {
   
   const {appointment, updateNotes} = useAppointmentContext();
   
   const notes = appointment?.notes;
   const appointmentId = appointment?.id;
   const [newNote, setNewNote] = useState<string>('');
   const [loadingSaveNote, setLoadingSaveNote] = useState<boolean>(false);
   const [loadingRemoveNote, setLoadingRemoveNote] = useState<number>(0);
   const userInformation = useSelector((state: IRootState) => state.themeConfig.user);
   const handleChange = (event:any) => {
      setNewNote(event.target.value);
      const rowCount = (event.target.value.match(/\n/g) || []).length + 1;
      rowCount > 4 ? event.target.rows = 4 : event.target.rows = rowCount; 
   };
   const handleScroll = (event:any) => {
      event.stopPropagation();
   };

   const handelSaveNote = () => {
      setLoadingSaveNote(true);
      axiosClient.post(`appointment/notes/${appointmentId}`, {text:newNote})
         .then((res) => {
            if(res.status === 200){
               notes?.unshift(res.data.note);
               
               updateNotes(notes || []);
               setNewNote('');
            }
         })
         .catch((err) => {
            alert('Something went wrong. Please try again later');
            console.log(err);
         })
         .finally(() => {
            setLoadingSaveNote(false);
         });
   }

   const handleRemoveNote = (noteId:number) => {
      setLoadingRemoveNote(noteId);
      axiosClient.delete(`appointment/notes/${appointmentId}/${noteId}`)
         .then((res) => {
            if(res.status === 200){
               
               updateNotes(notes?.filter((note) => note.id !== noteId) || []);
            }
         })
         .catch((err) => {
            alert('Something went wrong. Please try again later');
            console.log(err);
         })
         .finally(() => {
            setLoadingRemoveNote(0);
         });
   }

   return (
      <div className='panel p-4 relative'>
         <h3 className="font-semibold text-lg dark:text-white-light">Notes</h3>
         <PerfectScrollbar 
            onWheel={handleScroll}
            className="pb-10 max-h-[260px] scrollbar-container"
         
         >
            <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
               <table className="whitespace-nowrap">
                  <tbody className="dark:text-white">
                     {notes?.length === 0 && <div className='text-center dark:text-gray-700 text-gray-400 mt-4'>Create first note...</div> }
                     {
                        
                        notes?.map((note:any, index:number) => (
                           <tr key={index}>
                              <td>
                                 <div className='creator dark:text-gray-600 text-gray-400'>
                                    Yahor Dubovik ({new Date(note.created_at).toLocaleString('en-US',{month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})})
                                 </div>
                                 <div className='note mt-1 ml-3 dark:text-gray-300 text-gray-500'  dangerouslySetInnerHTML={{ __html: note.text.replace(/\n/g, '<br>') }}>
                                    
                                 </div>
                              </td> 
                              <td className="p-3 border-b border-[#ebedf2] dark:border-[#191e3a] text-right">
                                 <div className='text-right'>
                                    {
                                       loadingRemoveNote === note.id ? <SmallDangerLoader />
                                       :
                                       note.creator_id === userInformation.id &&
                                       <button onClick={()=>handleRemoveNote(note.id)} type="button" className='ml-4'>
                                          <IconTrashLines />
                                       </button>
                                    }
                                    
                                 </div>
                              </td>
                           </tr>
                        ))
                     }
                  </tbody>
               </table>
            </div>
         </PerfectScrollbar>
         <div className="flex absolute bottom-2 right-2 left-2">
            <textarea 
               rows={1} 
               value={newNote}
               onChange={handleChange}
               placeholder="Type note here..."
               className="form-textarea ltr:rounded-r-none rtl:rounded-l-none"
            ></textarea>
            <button onClick={handelSaveNote} type="button" className="btn btn-secondary ltr:rounded-l-none rtl:rounded-r-none">
               {
                  loadingSaveNote ? <ButtonLoader />
                  : 'Save'
               }
               
            </button>
        </div>
      </div>
   )
}

export default NotesBlock;