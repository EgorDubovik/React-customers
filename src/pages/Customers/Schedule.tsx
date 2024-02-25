import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store'; 
import { setPageTitle } from '../../store/themeConfigSlice';
import AppointmentsScheduler from '../../components/plugin/AppointmentsScheduler';


const Schedule = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Schedule'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    const [loading] = useState(false);
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
        },
        {
           title: 'Yahor Dubovik 3',
           start: '2024-02-28 09:00',
           end: '2024-02-28 11:00',
        }
     ];
    return (
        <div>
           <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Schedule</h2>
            </div>
            <div className='py-4'>
                <AppointmentsScheduler  appointments={appointments} />
            </div>
        </div>
    );
};

export default Schedule;
