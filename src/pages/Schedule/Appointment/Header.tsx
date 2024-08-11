import { useState, Fragment, useEffect } from 'react';
import axiosClient from '../../../store/axiosClient';
import IconChecks from '../../../components/Icon/IconChecks';
import IconCreditCard from '../../../components/Icon/IconCreditCard';
import IconArrowBackward from '../../../components/Icon/IconArrowBackward';
import IconClock from '../../../components/Icon/IconClock';
import { ButtonLoader } from '../../../components/loading/ButtonLoader';
import {useAppointmentContext} from '../../../context/AppointmentContext';
import { Dialog, Transition } from '@headlessui/react';

const calculateTaxTotal = (services:any) => {
   let tax = 0;
   let total = 0;
   services.forEach((service:any) => {
      const price = parseFloat(service.price);
      total += price;
      if(service.taxable) tax += (price * 0.0825);
   });
   total += tax;
   total = Math.round(total*100)/100;
   return {tax, total};
}

const calculateRemaining = (payments:any, total:number) => {
   const totalPaid = payments.reduce((acc:any, payment:any) => {
      const amount = parseFloat(payment.amount);
      return acc + amount;
   }, 0);
   let remaining = total - totalPaid;
   remaining = remaining < 0 ? 0 : remaining;
   return Math.round(remaining*100)/100;
}

const viewCurrency = (amount:number) => {
   return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
   });
}

const Header = () => {
   const {appointment, setAppointment,updateStatus, updatePayments} = useAppointmentContext();
   const [updateAppointmentLoading, setUpdateAppointmentLoading] = useState<boolean>(false);
   const [modal, setModal] = useState(false);
   const [paymentsLoading, setPaymentsLoading] = useState(false);
   const patmentsType = ['Credit', 'Transfer', 'Check','Cash'];
   const [selectedPaymentType, setSelectedPaymentType] = useState<number>(0);
   const [typeOfAmount, setTypeOfAmount] = useState<string>('full');
   const [amountPay, setAmountPay] = useState<number>(0);
   const [tax, setTax] = useState<number>(0);
   const [total, setTotal] = useState<number>(0);
   const [remaining, setRemaining] = useState<number>(0);

   useEffect(() => {
      const {tax, total} = calculateTaxTotal(appointment?.services || []);
      setTax(tax);
      setTotal(total);
      const remainingTotal = calculateRemaining(appointment?.payments || [], total);
      setRemaining(remainingTotal);
      setAmountPay(remainingTotal);
      setTypeOfAmount('full');
   },[appointment]);

   const changeAmount = (e:any) => {
      if(isNaN(e.target.value)) return;

      const amount = e.target.value;
      setAmountPay(amount);
   }

   const setAmount = (type:string) => {
      if(type === 'full'){
         setAmountPay(remaining);
         setTypeOfAmount('full');
      } else if(type === 'deposit'){
         setAmountPay(100);
         setTypeOfAmount('deposit');
      }
   }

   const addPayment = () => {
      setPaymentsLoading(true);
      if(amountPay > 0) {
         axiosClient.post(`appointment/payment/${appointment?.id}`, {
            amount: amountPay,
            payment_type: patmentsType[selectedPaymentType]
         })
         .then((res) => {
            //TODO: С типом оплаты необходимо все переделать как на сервере так и на клиенте ибо разногласия полные 
            const payments = appointment?.payments;
            let newPayment = res.data.payment;
            newPayment.payment_type = patmentsType[selectedPaymentType];
            payments?.push(newPayment);
            updatePayments(payments || []);
            setModal(false);
         })
         .catch((err) => {
            console.log(err);
         })
         .finally(() => {
            setPaymentsLoading(false);
         });
      } else {
         console.error('Enter valid amount');
         setAmountPay(0);
      }
   }


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

   return (
      <div className="flex gap-2 md:justify-end justify-around mt-4 mb-2 ">
         <div>
            <button onClick={handaleFinishOrActivateAppointment} type="button" className={`btn ${appointment?.status === 0 ? 'btn-primary' : 'btn-outline-dark'} h-full text-[13px] px-4 md:px-4`}>
               {
                  updateAppointmentLoading 
                     ? <ButtonLoader/> 
                     : appointment?.status === 0 ? <IconChecks /> : <IconArrowBackward/>
               }
               <span className='ml-1'>{appointment?.status === 0 ? 'Finish Appointment' : 'Back to Active'}</span>
            </button>
         </div>
         
         <div>
            <button type="button" className="btn btn-primary h-full text-[13px] px-3 md:px-4">
               <IconClock className='mr-1'/>
               Create copy
            </button>
         </div>
         <div>
            <button type="button" className="btn btn-primary h-full text-[13px] px-3 md:px-4"  onClick={()=>setModal(true)}>
               <IconCreditCard className='mr-1'/>
               Pay 
            </button>
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
                           <Dialog.Panel className="panel border-0 py-1 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                              <div className="py-4 px-2">
                                 <div className='title flex justify-between'>
                                    <span className='text-danger'>Remaining: {viewCurrency(remaining)}</span>
                                    <span className='text-success'>Total: {viewCurrency(total)}</span> 
                                 </div>
                                 <div className='input-amount text-center text-5xl py-10'>
                                    $ <input type='text' pattern="\d*\.?\d*" className='w-[200px] bg-transparent border-b border-gray-700 text-center outline-none' value={amountPay} onChange={changeAmount}/>
                                 </div>
                                 <div className='flex justify-center'>
                                    {remaining > 100 && <button type="button" onClick={()=>setAmount('deposit')} className={`btn ${typeOfAmount === 'deposit' ? 'btn-primary' : 'btn-outline-primary' } mr-4`}>Deposit</button>}
                                    <button type="button" onClick={()=>setAmount('full')} className={`btn ${typeOfAmount === 'full' ? 'btn-primary' : 'btn-outline-primary' }`}>Full</button>
                                 </div>
                                 <div className='payment-methods mt-10'>
                                    <div className="relative inline-flex w-full align-middle justify-around">
                                       {
                                          patmentsType.map((type, index) => (
                                             <button key={index} onClick={()=>setSelectedPaymentType(index)} type="button" className={`btn ${selectedPaymentType === index ? 'btn-primary' : 'btn-outline-primary'} w-full ${index ===0 ? 'rounded-r-none' : index===patmentsType.length-1 ? "rounded-l-none" : "rounded-none" } `}>
                                                {type}
                                             </button>
                                          ))
                                       }
                                       
                                    </div>
                                 </div>
                                    
                                 <div className="flex justify-end items-center mt-10">
                                    <button type="button" onClick={() => setModal(false)} className="btn btn-outline-danger">
                                       Discard
                                    </button>
                                    <button type="button" onClick={addPayment} className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                       Pay Now
                                       {paymentsLoading && <ButtonLoader />}
                                    </button>
                                 </div>
                              </div>   
                           </Dialog.Panel>
                        </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </div>
   );
}

export default Header;