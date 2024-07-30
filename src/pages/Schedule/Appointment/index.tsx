import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../store/axiosClient';
import TechBlock from './TechBlock';
import NotesBlock from './NotesBlock';
import ServicesBlock from './ServicesBlock';
import CustomerInfoBlock from './CustomerInfoBlock';
import {useAppointmentContext} from '../../../context/AppointmentContext';
import CalendarBlock from './CalendarBlock';
import Header from './Header';
import Images from './Images';

const Index = () => {
   const {appointment, setAppointment,updateStatus, updatePayments} = useAppointmentContext();
   const navigate = useNavigate();
   const [loadingStatus, setLoadingStatus] = useState(false);
   const cancelAppointment = () => {
      if(!window.confirm('Are you sure you want to cancel this appointment?')) return;
      if(loadingStatus) return;
      setLoadingStatus(true);
      axiosClient.delete(`/appointment/${appointment?.id}`)
      .then((res) => {
         if(res.status === 200){
            navigate('/schedule');
         }
      })
      .catch((err) => {
         console.log(err);
         alert('Something went wrong');
      }).finally(() => {
         setLoadingStatus(false);
      });

   }
   return (
      <div>
         <Header />
         <div className='py-4'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
               <div className='grid grid-rows-none gap-5'>
                  <div className='panel p-4'>
                     <CalendarBlock />
                  </div>
                  <div className='panel p-4'>
                     <h3 className="font-semibold text-lg dark:text-white-light">All Visits</h3>
                     <div className='text-right'>
                        <div className='rounded-md p-2 '>
                           <div className='text-sm font-semibold'>9:00 AM - 10:00 AM Jul 23, 2024</div>
                        </div>
                        <div className='rounded-md p-2 '>
                           <div className='text-sm font-semibold'>9:00 AM - 10:00 AM Jul 23, 2024</div>
                        </div>
                        <div className='rounded-md p-2 '>
                           <div className='text-sm font-semibold'>9:00 AM - 10:00 AM Jul 23, 2024</div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className='md:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-5'>
                  {/* <div className='grid grid-col-1 md:grid-cols-2 gap-5'> */}
                  <div className='grid grid-flow-row gap-5'>
                     {/* Customer infor */}
                     <CustomerInfoBlock customer={appointment?.customer} address={appointment?.address} />
                     {/* Tech for web*/}
                     <div className='panel p-4 hidden md:block'>
                        <TechBlock techs={appointment?.techs} appointmentId = {appointment?.id} />
                     </div>
                     {/* Images for web*/}
                     <div className='panel p-0 hidden md:block'>
                        <Images appointmentId={appointment?.id}/>
                     </div>
                  </div>
                  {/* <div className='grid grid-col-1 md:grid-cols-2 gap-5'> */}
                  <div className='grid grid-flow-row gap-5'>
                     
                     {/* Services */}
                     <ServicesBlock />

                     {/* Costs */}
                     <div className='panel p-4'>
                        <h3 className="font-semibold text-lg dark:text-white-light">Costs</h3>
                     </div>
                     {/* Notes */}
                     <NotesBlock />

                     {/* Tech for mobile */}
                     <div className='panel p-4 block md:hidden'>
                        <TechBlock techs={appointment?.techs} appointmentId={appointment?.id} />
                     </div>

                     {/* Images for mobile*/}
                     <div className='panel p-0 block md:hidden'>
                        <Images appointmentId={appointment?.id}/>
                     </div>
                  </div>
               </div>
            </div>
            <div className='text-center mt-6'>
               <div className='text-danger cursor-pointer' onClick={cancelAppointment}>
                  {loadingStatus ? 'Canceling...' : 'Cancel Appointment'}
               </div>
            </div>
         </div>
      </div>
   );
}

export default Index;