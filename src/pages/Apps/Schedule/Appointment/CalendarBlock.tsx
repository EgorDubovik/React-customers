import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentsScheduler from '../../../../components/plugin/sheduler/AppointmentsScheduler';
import IconPencilPaper from '../../../../components/Icon/IconPencilPaper';
import { useAppointmentContext } from '../../../../context/AppointmentContext';
import { use } from 'i18next';


const CalendarBlock = () => {
   const {appointment} = useAppointmentContext();
   
   const selectedAppointment = [
      {
         'start': appointment?.start,
         'end': appointment?.end,
         'addClass' : appointment?.status === 0 ? 'text-white' : 'text-gray-600',
         'bg':appointment?.status === 0 ? appointment?.techs?.length > 0 ?  appointment?.techs[0].color : "#1565C0" : "#ccc",
         'title': appointment?.customer.name,
      }
   ];
   
   return (
      <>
         <div className="flex items-center justify-between pb-4">
            <h3 className="font-semibold text-lg dark:text-white-light">Appointment time</h3>
            <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
               <IconPencilPaper className='w-4 h-4'/>
            </Link>
         </div>
         <div className='hidden md:block'>
            
            <AppointmentsScheduler 
               appointments={selectedAppointment}
               currentDate={appointment?.start}
               viewType={'day'}
               startTime={'06:00'}
               endTime={'19:00'}
               blockHeight={40}
               scheduleBgClass={'bg-none'}
            />
         </div>
         <div className='md:hidden'>
            <div className='dark:bg-gray-950 rounded'>
               <div className='p-4'>
                  <div className='flex justify-between items-center'>
                     <h4 className='font-semibold dark:text-white-light'>{appointment?.start.format('ddd, MMM DD')}</h4>
                     <p className='font-semibold dark:text-white-light'>{appointment?.start.format('hh:mm A')} - {appointment?.end.format('hh:mm A')}</p>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}

export default CalendarBlock;