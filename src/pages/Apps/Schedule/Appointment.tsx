import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useParams} from 'react-router-dom';
import axiosClient from '../../../store/axiosClient';
import moment from 'moment';
import Index from './Appointment/index';
import { AppointmentProvider } from '../../../context/AppointmentContext';
const Appointment = () => {

   const { id } = useParams();
   const [appointment, setAppointment] = useState<any>({});
   const dispatch = useDispatch();
   const [loadingStatus, setLoadingStatus] = useState<string>('loading');
   

   useEffect(() => {
      dispatch(setPageTitle('Appointment'));
   });

   
   
   useEffect(() => {
      setLoadingStatus('loading');
      axiosClient.get(`/appointment/${id}`)
         .then((res) => {
            
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
         {loadingStatus === 'success' 
            && 
            <AppointmentProvider appointmentData={appointment}>
               <Index/>
            </AppointmentProvider>
         }
      </div>
      
   );
}

export default Appointment;