import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store'; 
import { setPageTitle } from '../../../store/themeConfigSlice';
import AppointmentsScheduler from '../../../components/plugin/sheduler/AppointmentsScheduler';


const Schedule = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setPageTitle('Schedule'));
    });

    const [loading, setLoading] = useState(false);
    const appointments = [
        {
           title: 'Yahor Dubovik 1',
           start: '2024-02-28 07:00',
           end: '2024-02-28 09:00',
        },
        {
           title: 'Yahor Dubovik 2',
           start: '2024-02-28 07:00',
           end: '2024-02-28 09:00',
           bg:'red'
        },
        {
            title: 'Yahor Dubovik 3',
            start: '2024-02-28 09:00',
            end: '2024-02-28 11:00',
            bg: 'green',
        },
        {
            title: 'Yahor Dubovik 4',
            start: '2024-02-18 09:00',
            end: '2024-02-18 11:00',
            bg: 'green',
        },
     ];
    
    const viewAppointments = (data:any) => {

        console.log(data);
        navigate('/appointment/5');
    }

    return (
        <div>
           <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Schedule</h2>
            </div>
            <div className='py-4'>
                <AppointmentsScheduler 
                    appointments={appointments}
                    onClickHandler={viewAppointments}
                    startTime={'05:00'}
                    endTime={'20:00'}
                />
            </div>
        </div>
    );
};

export default Schedule;
