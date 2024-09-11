import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { AppointmentProvider } from './context/AppointmentContext';
import AppointmentPage from './AppointementPage';
import { IAppointment } from '../../types';

const Index = () => {

	const [appointment, setAppointment] = useState<IAppointment>({} as IAppointment);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setPageTitle('Appointment'));
	});

	return (
		<div>
			<AppointmentProvider appointmentData={appointment}>
				<AppointmentPage />
			</AppointmentProvider>
		</div>
	);
};

export default Index;
