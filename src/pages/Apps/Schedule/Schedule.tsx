import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store'; 
import { setPageTitle } from '../../../store/themeConfigSlice';
import AppointmentsScheduler from '../../../components/plugin/sheduler/AppointmentsScheduler';
import axiosClient from '../../../store/axiosClient';


const Schedule = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [viewType, setViewType] = useState('week');
    useEffect(() => {
        dispatch(setPageTitle('Schedule'));
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosClient.get('/appointment')
            .then((res) => {
                console.log(res.data.appointments);
                setAppointments(res.data.appointments);
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
          // Check window width and update viewType state accordingly
          
          if (window.innerWidth < 768) {
            
            setViewType('day');
          } else {
            
            setViewType('week');
          }
        };
    
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);
    
        // Call handleResize once to set initial viewType
        handleResize();
    
        // Cleanup function to remove event listener
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
                        startTime={'08:00'}
                        endTime={'18:00'}
                    />
                }
            </div>
        </div>
    );
};

export default Schedule;
