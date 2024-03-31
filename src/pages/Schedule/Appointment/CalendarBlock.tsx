import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import AppointmentsScheduler from '../../../components/plugin/sheduler/AppointmentsScheduler';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import { useAppointmentContext } from '../../../context/AppointmentContext';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import MyTimePicker from '../../../components/plugin/mytimepicker/src';

const CalendarBlock = () => {
   const {appointment} = useAppointmentContext();
   const theme = useSelector((state: IRootState) => state.themeConfig.theme);
   const [appointments, setAppointments] = useState<any[]>([]);
   const [modal, setModal] = useState(false);
   const [selectedTime, setSelectedTime] = useState('timeFrom');
   const [timeFrom, setTimeFrom] = useState(new Date(appointment?.start || new Date()));
   const [timeTo, setTimeTo] = useState(new Date(appointment?.end || new Date(timeFrom.getTime() + 60*120*1000)));
   const [timeToIsSelected, setTimeToIsSelected] = useState(false);

   const onTimeFromChanged = (date:any) => {
      setTimeFrom(new Date(date));
      if(!timeToIsSelected) 
         setTimeTo(new Date(date.getTime() + 60*120*1000));
   }

   const onTimeToChanged = (date:any) => {
      setTimeToIsSelected(true);
      setTimeTo(new Date(date));
   }

   const refactorAppointments = (appointments:any) => {
      const getTextColor = (appointment:any) => {
         console.log("getColors", theme);
         let bgColor = (theme === 'dark') ? '#ffffff29' : '#ccc';
         bgColor = appointment.status == 0 ? (appointment?.techs?.length > 0 ?  appointment?.techs[0].color : "#1565C0") : bgColor;
         let textColor = appointment.status === 0 ? 'text-white' : ((theme === 'dark') ? 'text-gray-300' : 'text-gray-500');
         return {bgColor, textColor};
      }

      const appointmentList =  appointments.map((appointment:any) => {
         const {bgColor, textColor} = getTextColor(appointment);
         return {
            id: appointment.id,
            title: appointment.title ?? appointment.customer.name,
            start: appointment.start,
            end: appointment.end,
            status: appointment.status,
            bg: bgColor,
            addClass: textColor,
         };
      });
      console.log(appointmentList);
      setAppointments(appointmentList);
   }


   useEffect(() => {
      refactorAppointments([appointment]);
   }, [theme, appointment]);

   // const selectedAppointment = [
   //    {
   //       'start': appointment?.start,
   //       'end': appointment?.end,
   //       'addClass' : appointment?.status === 0 ? 'text-white' : 'text-gray-600',
   //       'bg':appointment?.status === 0 ? appointment?.techs?.length > 0 ?  appointment?.techs[0].color : "#1565C0" : "#ccc",
   //       'title': appointment?.customer.name,
   //    }
   // ];
   
   return (
      <>
         <div className="flex items-center justify-between pb-4">
            <h3 className="font-semibold text-lg dark:text-white-light">Appointment time</h3>
            <button className="btn btn-primary p-2 rounded-full" onClick={()=>setModal(true)}>
               <IconPencilPaper className='w-4 h-4'/>
            </button>
         </div>
         <div className=''>
            <div className='dark:bg-white-dark/5 bg-gray-200 rounded'>
               <div className='p-4'>
                  <div className='flex justify-between items-center'>
                     <h4 className='font-semibold dark:text-white-light'>{moment(appointment?.start).format('ddd, MMM DD')}</h4>
                     <p className='font-semibold dark:text-white-light'>{moment(appointment?.start).format('hh:mm A')} - {moment(appointment?.end).format('hh:mm A')}</p>
                  </div>
               </div>
            </div>
         </div>
         <div className='hidden md:block'>
            
            <AppointmentsScheduler 
               appointments={appointments}
               currentDate={appointment?.start}
               isHeader={false}
               isDaysNames={false}
               viewType={'day'}
               startTime={'07:00'}
               endTime={'21:00'}
               blockHeight={40}
               scheduleBgClass={'bg-none'}
            />
         </div>
         <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={() => setModal(false)}>
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0" />
               </Transition.Child>
               <div id="login_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                  <div className="flex items-start justify-center min-h-screen px-4">
                        <Transition.Child
                           as={Fragment}
                           enter="ease-out duration-300"
                           enterFrom="opacity-0 scale-95"
                           enterTo="opacity-100 scale-100"
                           leave="ease-in duration-200"
                           leaveFrom="opacity-100 scale-100"
                           leaveTo="opacity-0 scale-95"
                        >
                           <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                              <div className="p-4">
                                 <div className='mt-5'>
                                    <div className='mb-5 flex justify-center bg-gray-100 dark:bg-white-dark/10 rounded p-2'>
                                       <div onClick={()=>setSelectedTime('timeFrom')} className={'w-1/2 timeFrom flex justify-center items-center cursor-pointer py-3 rounded '+((selectedTime === 'timeFrom') ? "dark:bg-black/25 dark:text-white font-bold bg-gray-200" : "")}>
                                          <div>From:</div>
                                          <div className='ml-10 text-center'>
                                             <div>{moment(timeFrom).format('MMM DD')}</div>
                                             <div>{moment(timeFrom).format('hh:mm A')}</div>
                                          </div>
                                       </div>
                                       <div onClick={()=>setSelectedTime('timeTo')} className={'w-1/2 timeFrom flex justify-center items-center cursor-pointer py-3 rounded '+((selectedTime === 'timeTo') ? "dark:bg-black/25 dark:text-white font-bold bg-gray-200" : "")}>
                                          <div>To:</div>
                                          <div className='ml-10 text-center'>
                                             <div>{moment(timeTo).format('MMM DD')}</div>
                                             <div>{moment(timeTo).format('hh:mm A')}</div>   
                                          </div>
                                       </div>
                                    </div>
                                    { selectedTime === "timeFrom" &&
                                       <MyTimePicker 
                                          currentDate = {timeFrom}
                                          onDateChange={onTimeFromChanged}
                                       />
                                    }
                                    { selectedTime === "timeTo" &&
                                       <MyTimePicker 
                                          currentDate = {timeTo}
                                          onDateChange={onTimeToChanged}
                                       />
                                    }
                                    
                                 </div>
                              </div>   
                           </Dialog.Panel>
                        </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
   );
}

export default CalendarBlock;