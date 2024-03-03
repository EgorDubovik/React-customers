import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useParams, Link } from 'react-router-dom';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import IconMapPin from '../../../components/Icon/IconMapPin';
import IconPhone from '../../../components/Icon/IconPhone';
import IconMail from '../../../components/Icon/IconMail';
import axiosClient from '../../../store/axiosClient';
import IconChecks from '../../../components/Icon/IconChecks';
import IconCreditCard from '../../../components/Icon/IconCreditCard';
import IconArrowBackward from '../../../components/Icon/IconArrowBackward';
import TechBlock from './Appointment/TechBlock';
import NotesBlock from './Appointment/NotesBlock';
import ServicesBlock from './Appointment/ServicesBlock';
import AppointmentsScheduler from '../../../components/plugin/sheduler/AppointmentsScheduler';
import moment from 'moment';
import IconClock from '../../../components/Icon/IconClock';
import CustomerInfoBlock from './Appointment/CustomerInfoBlock';
const Appointment = () => {

   const { id } = useParams();
   const [appointment, setAppointment] = useState<any>({});
   const dispatch = useDispatch();
   const [loadingStatus, setLoadingStatus] = useState<string>('loading');
   const [selectedAppointment, setSelectedAppointment] = useState<any[]>([]);

   useEffect(() => {
      dispatch(setPageTitle('Schedule'));
   });

   
   useEffect(() => {
      setLoadingStatus('loading');
      axiosClient.get(`/appointment/${id}`)
         .then((res) => {
            
            const selectedAppointment = {
               'start': res.data.appointment.start,
               'end': res.data.appointment.end,
               'bg': res.data.appointment.techs.length > 0 ?  res.data.appointment.techs[0].color : "#1565C0",
               'title': res.data.appointment.customer.name,
            }
            
            setSelectedAppointment([selectedAppointment]);
            let appointment = res.data.appointment;
            appointment.start = moment(appointment.start);
            appointment.end = moment(appointment.end);
            setAppointment(appointment);
            
            setLoadingStatus('success');
         })
         .catch((err) => {
            console.log(err);
            setLoadingStatus('error');
         });
   }, []);

   return (
      <div>
         {loadingStatus === 'loading' && <div className='text-center mt-10'><span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span></div>}
         {loadingStatus === 'error' && 
            <div>
               <div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                  <span className="ltr:pr-2 rtl:pl-2">
                     <strong className="ltr:mr-1 rtl:ml-1">Woops!</strong>Something went wrong. Please try again or <a href="" onClick={()=>{window.location.reload(); }} className="underline">reload the page</a>
                  </span>
               </div>
            </div>}
         {loadingStatus === 'success' &&
         (<div>
            
            <div className="flex gap-3 md:justify-end justify-around">
               <div>
                  {
                     appointment?.status === 0 && 
                     <button type="button" className="btn btn-primary h-full">
                        <IconChecks className='mr-2'/>
                        Finish Appointment
                     </button>   
                  }
                  {
                     appointment?.status === 1 && 
                     <button type="button" className="btn btn-outline-dark h-full">
                        <IconArrowBackward className='mr-2'/>
                        Back to Active
                     </button>   
                  }
               </div>
               <div>
                  <button type="button" className="btn btn-primary h-full">
                     <IconClock className='mr-2'/>
                     Start job
                  </button>
               </div>
               <div>
                  <button type="button" className="btn btn-primary h-full">
                     <IconCreditCard className='mr-2'/>
                     Pay
                  </button>
               </div>
            </div>
            
            <div className='py-4'>
               <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
                  <div className='panel p-4'>
                     <div className="flex items-center justify-between pb-4">
                        <h3 className="font-semibold text-lg dark:text-white-light">Appointment time</h3>
                        <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                           <IconPencilPaper className='w-4 h-4'/>
                        </Link>
                     </div>
                     <div className='hidden md:block'>
                        <AppointmentsScheduler 
                           appointments={selectedAppointment}
                           currentDate={selectedAppointment[0].start}
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
                  </div>
                  <div className='md:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-5'>
                     {/* <div className='grid grid-col-1 md:grid-cols-2 gap-5'> */}
                     <div className='grid grid-flow-row gap-5'>
                        {/* Customer infor */}
                        <CustomerInfoBlock customer={appointment?.customer} address={appointment?.address} />
                        {/* Tech for web*/}
                        <div className='panel p-4 hidden md:block'>
                           <TechBlock techs={appointment?.techs} appointmentId = {appointment.id} />
                        </div>
                        {/* Images for web*/}
                        <div className='panel p-4 hidden md:block'>
                           <h3 className="font-semibold text-lg dark:text-white-light">Images</h3>
                        </div>
                     </div>
                     {/* <div className='grid grid-col-1 md:grid-cols-2 gap-5'> */}
                     <div className='grid grid-flow-row gap-5'>
                        {/* Services */}
                        <ServicesBlock services={appointment?.services} appointmentId = {appointment.id}/>
                        {/* Notes */}
                        <NotesBlock notes={appointment.notes} appointmentId = {appointment.id}/>

                        {/* Tech for mobile */}
                        
                        <div className='panel p-4 block md:hidden'>
                           <TechBlock techs={appointment?.techs} appointmentId = {appointment.id} />
                        </div>

                        {/* Images for mobile*/}
                        <div className='panel p-4 block md:hidden'>
                           <h3 className="font-semibold text-lg dark:text-white-light">Images</h3>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>)}
      </div>
      
   );
}

export default Appointment;