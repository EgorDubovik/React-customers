import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import AppointmentsScheduler from '../../components/plugin/sheduler/AppointmentsScheduler';
import axiosClient from '../../store/axiosClient';
import { IRootState } from '../../store';


const Schedule = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [appointments, setAppointments] = useState<any[]>([]);
   const [viewType, setViewType] = useState('week');
   const theme = useSelector((state: IRootState) => state.themeConfig.theme);
   useEffect(() => {
      dispatch(setPageTitle('Schedule'));
   });
   
   const [loading, setLoading] = useState(false);

   const getTextColor = (appointment:any) => {
      console.log("getColors", theme);
      let bgColor = (theme === 'dark') ? '#ffffff29' : '#ccc';
      bgColor = appointment.status == 0 ? appointment.bg : bgColor;
      let textColor = appointment.status === 0 ? 'text-white' : ((theme === 'dark') ? 'text-gray-300' : 'text-gray-500');
      return {bgColor, textColor};
   }

   const refactorAppointments = (appointments:any) => {
      const getTextColor = (appointment:any) => {
         console.log("getColors", theme);
         let bgColor = (theme === 'dark') ? '#ffffff29' : '#ccc';
         bgColor = appointment.status == 0 ? appointment.bg : bgColor;
         let textColor = appointment.status === 0 ? 'text-white' : ((theme === 'dark') ? 'text-gray-300' : 'text-gray-500');
         return {bgColor, textColor};
      }

      const appointmentList =  appointments.map((appointment:any) => {
         const {bgColor, textColor} = getTextColor(appointment);
         return {
            id: appointment.id,
            title: appointment.title,
            start: appointment.start,
            end: appointment.end,
            status: appointment.status,
            bg: bgColor,
            addClass: textColor,
         };
      });
      setAppointments(appointmentList);
   }

   useEffect(() => {
      refactorAppointments(appointments);
   }, [theme]);

   useEffect(() => {
      setLoading(true);
      axiosClient.get('/appointment')
         .then((res) => {
               console.log(res.data.appointments);
               refactorAppointments(res.data.appointments);
               setLoading(false);
         })
         .catch((err) => {
            
               console.log(err); 
         })
         .finally(() => {
               setLoading(false);
         });
   }, []);
   
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth < 768) {
               setViewType('day');
         } else {  
               setViewType('week');
         }
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   const viewAppointments = (data:any) => {
      navigate('/appointment/'+data.id);
   }
   console.log(viewType);
   return (
      <div>
         <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl">Schedule</h2>
         </div>
         <div className='py-4'>
            {loading 
               ? <div className='text-center'><span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span></div>
               :
               <AppointmentsScheduler 
                  appointments={appointments}
                  onClickHandler={viewAppointments}
                  viewType={viewType}
                  startTime={'07:00'}
                  endTime={'20:00'}
               />
            }
         </div>
      </div>
   );
};

export default Schedule;
