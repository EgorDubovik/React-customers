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
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import TechBlock from './Appointment/TechBlock';
import NotesBlock from './Appointment/NotesBlock';
import ServicesBlock from './Appointment/ServicesBlock';

const Appointment = () => {

   const { id } = useParams();
   const [appointment, setAppointment] = useState<any>({});
   const dispatch = useDispatch();
   const [loadingStatus, setLoadingStatus] = useState<string>('loading');

   useEffect(() => {
      dispatch(setPageTitle('Schedule'));
   });

   
   useEffect(() => {
      setLoadingStatus('loading');
      axiosClient.get(`/appointment/${id}`)
         .then((res) => {
            // console.log(res.data.appointment);
            setAppointment(res.data.appointment);
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
            
            <div className="flex gap-3 justify-end">
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
                     <IconCreditCard className='mr-2'/>
                     Pay
                  </button>
               </div>
            </div>
            
            <div className='py-4'>
               <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
                  <div className='panel p-4 h-[700px]'>
                     <h3 className="font-semibold text-lg dark:text-white-light">Calendar</h3>
                  </div>
                  <div className='md:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-5'>
                     {/* <div className='grid grid-col-1 md:grid-cols-2 gap-5'> */}
                     <div className='grid grid-flow-row gap-5'>
                        {/* Customer infor */}
                        <div className="panel p-0">
                           <div className="flex items-center justify-between p-4">
                                 <h3 className="font-semibold text-lg dark:text-white-light">Customer</h3>
                                 <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                                    <IconPencilPaper className='w-4 h-4'/>
                                 </Link>
                           </div>
                           <div className="mb-1">
                              <div className="flex flex-col justify-center items-center ">
                                 <div className='w-full h-[200px] rounded text-center dark:bg-gray-800 bg-gray-200'>
                                    MAP
                                 </div>
                                 
                                 <p className="font-semibold text-primary text-lg mt-4">
                                    <Link to={'/customer/'+appointment?.customer?.id} className="hover:underline">
                                       {appointment?.customer?.name}
                                    </Link>
                                 </p>

                              </div>
                              <div className='px-4 pb-4'>
                                 <ul className="mt-5 flex flex-col m-auto space-y-4 font-semibold text-white-dark">
                                    <li className="flex items-center gap-2">
                                       <IconMapPin className="shrink-0" />
                                       {appointment?.address?.full}
                                    </li>
                                    <li className="flex items-center gap-2">
                                       <IconPhone />
                                       <span className="whitespace-nowrap" dir="ltr">
                                          {appointment?.customer?.phone}
                                       </span>
                                    </li>
                                    <li>
                                       <button className="flex gap-2">
                                          <IconMail className="w-5 h-5 shrink-0" />
                                          <span className="text-primary truncate">{ appointment?.customer?.email }</span>
                                          
                                       </button>
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                        {/* Tech */}
                        <TechBlock techs={appointment?.techs} appointmentId = {appointment.id} />
                     </div>
                     {/* <div className='grid grid-col-1 md:grid-cols-2 gap-5'> */}
                     <div className='grid grid-flow-row gap-5'>
                        {/* Services */}
                        <ServicesBlock services={appointment?.services} appointmentId = {appointment.id}/>
                        {/* Notes */}
                        <NotesBlock appointmentId = {appointment.id}/>
                        {/* Images */}
                        <div className='panel p-4'>
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