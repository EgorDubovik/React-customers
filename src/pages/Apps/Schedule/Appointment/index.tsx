import { useState } from 'react';
import axiosClient from '../../../../store/axiosClient';
import TechBlock from './TechBlock';
import NotesBlock from './NotesBlock';
import ServicesBlock from './ServicesBlock';
import CustomerInfoBlock from './CustomerInfoBlock';
import {useAppointmentContext} from '../../../../context/AppointmentContext';
import CalendarBlock from './CalendarBlock';
import Header from './Header';


const Index = () => {

   const {appointment, setAppointment,updateStatus, updatePayments} = useAppointmentContext();

   return (
      <div>
         <Header />
         <div className='py-4'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
               <div className='panel p-4'>
                  <CalendarBlock />
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
                     <div className='panel p-4 hidden md:block'>
                        <h3 className="font-semibold text-lg dark:text-white-light">Images</h3>
                     </div>
                  </div>
                  {/* <div className='grid grid-col-1 md:grid-cols-2 gap-5'> */}
                  <div className='grid grid-flow-row gap-5'>
                     {/* Services */}
                     <ServicesBlock />
                     {/* Notes */}
                     <NotesBlock />

                     {/* Tech for mobile */}
                     
                     <div className='panel p-4 block md:hidden'>
                        <TechBlock techs={appointment?.techs} />
                     </div>

                     {/* Images for mobile*/}
                     <div className='panel p-4 block md:hidden'>
                        <h3 className="font-semibold text-lg dark:text-white-light">Images</h3>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Index;