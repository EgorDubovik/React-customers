import { useState } from 'react';
import axiosClient from '../../../../store/axiosClient';
import TechBlock from './TechBlock';
import NotesBlock from './NotesBlock';
import ServicesBlock from './ServicesBlock';
import CustomerInfoBlock from './CustomerInfoBlock';
import {useAppointmentContext} from '../../../../context/AppointmentContext';
import CalendarBlock from './CalendarBlock';
import Header from './Header';
interface SelectedAppointment{
   start: string;
   end: string;
   bg: string;
   title: string;
}

const Index = (props:any) => {

   const {appointment, setAppointment,updateStatus, updatePayments} = useAppointmentContext();
   const [updateAppointmentLoading, setUpdateAppointmentLoading] = useState<boolean>(false);
   const [modal, setModal] = useState(false);
   const [paymentsLoading, setPaymentsLoading] = useState(false);
   const patmentsType = ['Credit', 'Transfer', 'Check','Cash'];
   const [selectedPaymentType, setSelectedPaymentType] = useState<number>(0);
   const [typeOfAmount, setTypeOfAmount] = useState<string>('full');
   const [amountPay, setAmountPay] = useState<number>(0);
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

   const setAmount = (type:string) => {

      if(type === 'full'){
         setTypeOfAmount('full');
      } else if(type === 'deposit'){
         setAmountPay(100);
         setTypeOfAmount('deposit');
      }
   }

   const addPayment = () => {
      const newPayment = {
         id: 1,
         appointment_id: 1,
         amount: amountPay,
         payment_type: patmentsType[selectedPaymentType],
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