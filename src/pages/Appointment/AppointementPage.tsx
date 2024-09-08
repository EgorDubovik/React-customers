import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { useAppointmentContext } from '../../context/AppointmentContext';
import axiosClient from '../../store/axiosClient';
import CalendarBlock from './CalendarBlock';
import CustomerInfoBlock from './CustomerInfoBlock';
import TechBlock from './TechBlock';
import Images from './Images';
import NotesBlock from './NotesBlock';
import Expense from './Expense';
import ServicesBlock from './ServicesBlock';
import { formatDate } from '../../helpers/helper';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';

const AppointmentPage = () => {
	const navigate = useNavigate();
	const [deleteStatus, setDeleteStatus] = useState(false);
	const { appointment, fetchAppointmentData, loadingStatus } = useAppointmentContext();
   const { id } = useParams();
	const cancelAppointment = () => {
		if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
		if (deleteStatus) return;
		setDeleteStatus(true);
		axiosClient
			.delete(`/appointment/${appointment?.id}`)
			.then((res) => {
				if (res.status === 200) {
					navigate('/schedule');
				}
			})
			.catch((err) => {
				console.log(err);
				alert('Something went wrong');
			})
			.finally(() => {
				setDeleteStatus(false);
			});
	};

   useEffect(() => {
      fetchAppointmentData(parseInt(id || '0'));
   }, [id]);

	return (
		<>
         {loadingStatus === 'loading' && (
				<PageCirclePrimaryLoader />
			)}
			{loadingStatus === 'error' && <PageLoadError /> }
			
			{loadingStatus === 'success' && (
            <>
			<Header />
			<div className="py-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
					<div className="grid grid-rows-none gap-5">
						<div className="panel p-4">
							<CalendarBlock />
						</div>
						<div className="panel p-4">
							<h3 className="font-semibold text-lg dark:text-white-light">All Visits</h3>
							<div className="text-right">
								{appointment?.job.appointments.map((jappointment: any, index: number) => (
									<div key={index} className="mb-2 last:mb-0">
										<Link  to={`/appointment/${jappointment.id}`}>
											<div
												className={`rounded-md p-2 ${appointment.id === jappointment.id ? 'dark:bg-gray-800 dark:shadow-gray-600 bg-gray-200 shadow-gray-500 shadow-sm' : 'dark:bg-dark-dark-light bg-gray-100'}   border-l-2`}
												style={{ borderColor: jappointment.techs?.length > 0 ? jappointment.techs[jappointment.techs.length - 1].color : '#1565C0' }}
											>
												<div className="text-sm font-semibold flex justify-between">
                                       <div>{formatDate(jappointment.start, 'MMM DD, YYYY')}</div>
													<div>{formatDate(jappointment.start, 'hh:mm A')} - {formatDate(jappointment.end, 'hh:mm A')}</div>
												</div>
											</div>
										</Link>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="md:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-5">
						<div className="grid grid-flow-row gap-5">
							{/* Customer infor */}
							<CustomerInfoBlock />
							{/* Tech for web*/}
							<div className="panel p-4 hidden md:block">
								<TechBlock />
							</div>
							{/* Images for web*/}
							<div className="panel p-0 hidden md:block">
								<Images appointmentId={appointment?.id} />
							</div>
						</div>

						<div className="grid grid-flow-row gap-5">
							{/* Services */}
							<ServicesBlock />

							{/* Costs */}
							<Expense />

							{/* Notes */}
							<NotesBlock />

							{/* Tech for mobile */}
							<div className="panel p-4 block md:hidden">
								<TechBlock />
							</div>

							{/* Images for mobile*/}
							<div className="panel p-0 block md:hidden">
								<Images appointmentId={appointment?.id} />
							</div>
						</div>
					</div>
				</div>
				<div className="text-center mt-6">
					<div className="text-danger cursor-pointer" onClick={cancelAppointment}>
						{deleteStatus ? 'Canceling...' : 'Cancel Appointment'}
					</div>
				</div>
			</div>
         </>
         )}
		</>
	);
};

export default AppointmentPage;
