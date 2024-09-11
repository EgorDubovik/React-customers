import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useParams } from 'react-router-dom';
import { AppointmentProvider } from '../../context/AppointmentContext';
import AppointmentPage from './AppointementPage';
import { PageLoadError } from '../../components/loading/Errors';
import { IAppointment } from '../../types';

const Index = () => {
	const { id } = useParams();
	const [appointment, setAppointment] = useState<IAppointment>({} as IAppointment);
	const dispatch = useDispatch();
	const [loadingStatus, setLoadingStatus] = useState<string>('loading');

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
