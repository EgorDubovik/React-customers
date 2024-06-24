import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import env from '../../store/env';
import Loading from './Loading';
import ErrorLoad from './ErrorLoad';
import Header from './Header';
import { AppointmentInfoType } from './@types';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import {ButtonLoader} from '../../components/loading/ButtonLoader';

const ViewAppointment = () => {
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(setPageTitle('View Appointment'));
   });
   const { providerKey } = useParams();
   const [btnStatus, setBtnStatus] = useState(false);
   const [loadingStatus, setLoadingStatus] = useState('loading');
   const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfoType>({
      company: {
         name: '',
         phone: '',
         logo: '',
      },
      customer: {
         name: '',
         email: '',
         phone: '',
         address: '',
      },
      appointment: {
         time1: '',
         time2: '',
         time3: '',
      },
      services: [],
   });
   useEffect(() => {
      
      fetch(env.API_URL+'/appointment/book/view/'+providerKey)
         .then(response => {
            if (!response.ok)
               throw Error(response.statusText);
            else 
               return response.json();
         })
         .then(data => {
            setLoadingStatus('success');
            setAppointmentInfo(data);
         }).catch((error) => {
            console.error('Error:', error);
            setLoadingStatus('error');
         })
      
   }, []);

   const navigate = useNavigate();
   const cancelAppointment = () => {
      if(btnStatus) return;
      setBtnStatus(true);
      fetch(env.API_URL+'/appointment/book/remove/'+providerKey)
      .then(response => {
         if (!response.ok)
               throw Error(response.statusText);
         else return response.json();
      })
      .then(data => {
         navigate('/appointment/book/cancel/'+data.key);
      }).catch((error) => {
         console.error('Error:', error);
      })
      .finally(() => {
         setBtnStatus(false);
      });
   }

   return (
      <div className="App h-full">
         {loadingStatus === 'loading' && <Loading />}
         {loadingStatus === 'error' && <ErrorLoad />}
         {loadingStatus === 'success' &&
         ( <div className='text-center'>
               <Header { ...appointmentInfo.company}/>  
               <div className="w-full sm:w-3/4 m-auto">
                  <div className="header border-b border-gray-300 p-2 pb-4 mt-10">
                     <h2 className="font-bold">
                        <div className="flex items-center justify-center">
                           <svg className="w-4 h-4 me-2 text-blue-600 dark:text-blue-500 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                           </svg>
                           Appointment accepted!
                        </div>
                     </h2>
                     <div className="text-gray-500 mt-2">We're looking forward to seeing you on {appointmentInfo.appointment.time1}</div>
                     
                  </div>
                  <div className="cintent p-2 mt-6">
                     <div className="text-lg">{appointmentInfo.customer.name}</div>   
                     <div className="datetime mt-4 font-bold text-sm">
                        {appointmentInfo.appointment?.time2}<br />
                        {appointmentInfo.appointment?.time3}
                     </div>
                     <div className="services mt-4">
                        {appointmentInfo.services.map((service,index) => {
                           return <div key={index} className="text-gray-500 mt-2">{service.title} - ${service.price}</div>
                           })
                        }
                        
                     </div>
                     <div className="customer-info mt-4 text-gray-500">
                        {appointmentInfo.customer.address}<br />
                        {appointmentInfo.customer.phone}<br />
                     </div>
                  </div>
                  <div className="footer p-2 mt-6 w-full sm:w-1/3 m-auto border-t border-gray-300">
                  <div className="text-gray-500 mt-2">You can contact with company for any questions by phone number: <b>{appointmentInfo.company.phone}</b></div>
                     {/* <div className="">
                        <button className="bg-blue-600 text-white p-2 rounded w-full">Change appointment</button>
                     </div> */}
                     <div className="mt-3">
                        <button onClick={cancelAppointment} className="bg-blue-100 text-blue-600 p-2 rounded w-full">
                           Cancel appointment {btnStatus && <ButtonLoader />}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )
         }
      </div>
   );
};

export default ViewAppointment;