import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { useParams, Link } from 'react-router-dom';
import IconPencilPaper from '../../../../components/Icon/IconPencilPaper';
import axiosClient from '../../../../store/axiosClient';
import IconChecks from '../../../../components/Icon/IconChecks';
import IconCreditCard from '../../../../components/Icon/IconCreditCard';
import IconArrowBackward from '../../../../components/Icon/IconArrowBackward';
import TechBlock from './TechBlock';
import NotesBlock from './NotesBlock';
import ServicesBlock from './ServicesBlock';
import AppointmentsScheduler from '../../../../components/plugin/sheduler/AppointmentsScheduler';
import moment from 'moment';
import IconClock from '../../../../components/Icon/IconClock';
import CustomerInfoBlock from './CustomerInfoBlock';
import { ButtonLoader } from '../../../../components/loading/ButtonLoader';
import {useAppointmentContext} from '../../../../context/AppointmentContext';
import CalendarBlock from './CalendarBlock';

interface SelectedAppointment{
   start: string;
   end: string;
   bg: string;
   title: string;
}

const Index = (props:any) => {

   const {appointment, setAppointment,updateStatus, updatePayments} = useAppointmentContext();
   const [selectedAppointment, setSelectedAppointment] = useState<SelectedAppointment[]>(props.selectedAppointment || []);
   const [updateAppointmentLoading, setUpdateAppointmentLoading] = useState<boolean>(false);
   
   useEffect(() => {

   }, []);

   // useEffect(() => {
      
   //    if(appointment)
         
   //       setSelectedAppointment([
   //          ...selectedAppointment,
   //          {
   //          'start': appointment?.start,
   //          'end': appointment?.end,
   //          'bg': appointment?.techs?.length > 0 ?  appointment?.techs[0].color : "#1565C0",
   //          'title': appointment?.customer.name,
   //       }]);
   // }, [appointment]);
   
   const handaleFinishOrActivateAppointment = () => {
      setUpdateAppointmentLoading(true);
      axiosClient.put(`appointment/${appointment?.id}/status`)
         .then((res) => {
            updateStatus(appointment?.status === 0 ? 1 : 0);
         })
         .catch((err) => {
            console.log(err);
         })
         .finally(() => {
            setUpdateAppointmentLoading(false);
         });
   }

   const addPayment = () => {
      const newPayment = {
         id: 1,
         appointment_id: 1,
         amount: 100,
         payment_type: 'cash',
         created_at: '2021-08-30T11:00:00',
         updated_at: '2021-08-30T11:00:00',
         company_id: 1,
      }
      const payments = appointment?.payments;
      payments?.push(newPayment);
      updatePayments(payments || []);
   }

   return (
      <div>
            <div className="flex gap-3 md:justify-end justify-around">
               <div>
                  {
                     appointment?.status === 0 && 
                     <button onClick={handaleFinishOrActivateAppointment} type="button" className="btn btn-primary h-full">
                        {
                           updateAppointmentLoading 
                              ? <ButtonLoader/> 
                              : <IconChecks />
                        }
                        <span className='ml-2'>Finish Appointment</span>
                     </button>   
                  }
                  {
                     appointment?.status === 1 && 
                     <button onClick={handaleFinishOrActivateAppointment} type="button" className="btn btn-outline-dark h-full">
                        {
                           updateAppointmentLoading 
                              ? <ButtonLoader/> 
                              : <IconArrowBackward/>
                        }
                        <span className='ml-2'>Back to Active</span>
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
                  <button type="button" className="btn btn-primary h-full" onClick={addPayment}>
                     <IconCreditCard className='mr-2'/>
                     Pay
                  </button>
               </div>
            </div>
            
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