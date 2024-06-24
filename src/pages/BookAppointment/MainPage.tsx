import { useContext, useEffect, useState } from 'react';
import env from '../../store/env';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import ErrorLoad from './ErrorLoad';
import { CustomerContext } from './CustomerContext';
import { CustomerContextType } from './@types';
import Header from './Header';
import NotActive from './NotActive';
import Information from './Information';
import Services from './Services';
import SelectDateTime from './SelectDateTime';
import CustomerInfo from './CustomerInfo';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const BookAppointment = () => {

	const dispatch = useDispatch();
	useEffect(() => {
		console.log('BookAppointment');
		dispatch(setPageTitle('Book Appointment'));
	});

	const { paramKey } = useParams() as { paramKey: string };
	const { updateKey, setServices, setCompanyInfo, companyInfo, sliderIndex, setWorkingTime } = useContext(CustomerContext) as CustomerContextType;
	const [loadingStatus, setLoadingStatus] = useState('loading');
	const [phone, setPhone] = useState('');
	useEffect(() => {
		const url = env.API_URL + '/appointment/book/' + paramKey;
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				if (data.error && data.error === 'not_active') {
					setPhone(data.phone);
					setLoadingStatus('notActive');
					return;
				}
				setLoadingStatus('success');
				updateKey(paramKey);
				setServices(data.company.services);
				setCompanyInfo(data.company);
				if(data.company.workingTime !== null)
				   setWorkingTime(JSON.parse(data.company.workingTime));
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoadingStatus('error');
			});
	}, []);
	return (
		<div className="App h-full">
			{loadingStatus === 'loading' && <Loading />}
			{loadingStatus === 'error' && <ErrorLoad />}
			{loadingStatus === 'notActive' && <NotActive phone={phone} />}
			{loadingStatus === 'success' && (
				<div>
					<Header {...companyInfo} />
					<div className="w-full px-4 m-auto md:w-3/5 max-w-6xl mt-5">
						<div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-x-2">
							<Information />
							{sliderIndex === 1 && <Services />}
							{sliderIndex === 2 && <SelectDateTime />}
							{(sliderIndex === 3 || sliderIndex == 4) && <CustomerInfo />}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default BookAppointment;
