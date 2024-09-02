import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useParams } from 'react-router-dom';
import axiosClient from '../../store/axiosClient';
import moment from 'moment';
import { AppointmentProvider } from '../../context/AppointmentContext';
import AppointmentPage from './AppointementPage';
import {PageLoadError} from '../../components/loading/Errors';

const Index = () => {
	const { id } = useParams();
	const [appointment, setAppointment] = useState<any>({});
	const dispatch = useDispatch();
	const [loadingStatus, setLoadingStatus] = useState<string>('loading');

	useEffect(() => {
		dispatch(setPageTitle('Appointment'));
	});

	useEffect(() => {
		setLoadingStatus('loading');
		axiosClient
			.get(`/appointment/${id}`)
			.then((res) => {
				console.log(res.data);
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
			{loadingStatus === 'loading' && (
				<div className="text-center mt-10">
					<span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
				</div>
			)}
			{loadingStatus === 'error' && <PageLoadError /> }
			
			{loadingStatus === 'success' && (
				<AppointmentProvider appointmentData={appointment}>
					<AppointmentPage />
				</AppointmentProvider>
			)}
		</div>
	);
};

export default Index;
