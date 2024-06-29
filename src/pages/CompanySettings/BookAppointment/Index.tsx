import { useState, useEffect } from 'react';
import axiosClient from '../../../store/axiosClient';
import WorkingTime from './WorkingTime';
import { PageLoadError } from '../../../components/loading/Errors';
import { PageCirclePrimaryLoader } from '../../../components/loading/PageLoading';
import LinkAndActiveBlock from './LinkAndActiveBlock';
import { ReactSortable } from 'react-sortablejs';
import axios from 'axios';
import { use } from 'i18next';
interface CompanyServiceType {
	id: number;
	title: string;
	price: number;
	description: string;
}

const BookAppointmentSettings = () => {
	const [loadingStatus, setLoadingStatus] = useState<string>('loading');
	const [settings, setSettings] = useState<any>({});
	const [companyServices, setCompanyServices] = useState<CompanyServiceType[]>([]);
	const [loadedCompanyServices, setLoadetCompanyServices] = useState<CompanyServiceType[]>([]);
	const [bookService, setBookService] = useState<CompanyServiceType[]>([]);
	const [workingTime, setWorkingTime] = useState<WorkingTime>({
		monday: { from: 0, to: 0 },
		tuesday: { from: 0, to: 0 },
		wednesday: { from: 0, to: 0 },
		thursday: { from: 0, to: 0 },
		friday: { from: 0, to: 0 },
		saturday: { from: 0, to: 0 },
		sunday: { from: 0, to: 0 },
	});

	useEffect(() => {
		axiosClient
			.get('/company/settings/book-appointment')
			.then((res) => {
				console.log(res.data);
				setWorkingTime(JSON.parse(res.data.settings.working_time));
				setSettings(res.data.settings);
				setLoadetCompanyServices(res.data.companyServices || []);
				setBookService(res.data.bookAppointmentServices || []);
				setLoadingStatus('success');
			})
			.catch((err) => {
				console.log(err);
				setLoadingStatus('error');
			});
	}, []);

	useEffect(() => {
		if(loadingStatus === 'success') {
			setCompanyServices(loadedCompanyServices.filter((item) => {
				return !bookService.some((service) => service.id === item.id);
			}));
		}
	}, [loadingStatus]);

	const moveToBookService = (service: CompanyServiceType) => {
		let servicesIds = bookService.map((item) => item.id);
		servicesIds.push(service.id);
		axiosClient.post('/company/settings/book-appointment/update-services', { services: servicesIds })
		.then((res) => {
			console.log(res.data);
		})
		.catch((err) => {
			setCompanyServices([...companyServices, service]);
			setBookService(bookService.filter((item) => item.id !== service.id));
			console.log(err);
		});
		setCompanyServices(companyServices.filter((item) => item.id !== service.id));
		setBookService([...bookService, service]);
	}

	const removeBookService = (service: CompanyServiceType) => {
		let servicesIds = bookService.map((item) => item.id);
		servicesIds = servicesIds.filter((id) => id !== service.id);
		axiosClient.post('/company/settings/book-appointment/update-services', { services: servicesIds })
		.then((res) => {
			console.log(res.data);
		})
		.catch((err) => {
			setBookService([...bookService, service]);
			setCompanyServices(companyServices.filter((item) => item.id !== service.id));
			console.log(err);
		});
		setBookService(bookService.filter((item) => item.id !== service.id));
		setCompanyServices([...companyServices, service]);
	
	}

	return (
		<div>
			<div>
				<div className="flex justify-start items-center text-lg">
					<h1>Book Appointments online settings</h1>
				</div>
				{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
				{loadingStatus === 'error' && <PageLoadError />}
				{loadingStatus === 'success' && (
					<div className="py-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
							<WorkingTime workingTime={workingTime} />
							<div className="md:col-span-2">
								<LinkAndActiveBlock settings={settings} />
								<div className="panel mt-5">
									<div className="grid grid-cols-2">
										<div className="px-2">
											{companyServices.map((service: CompanyServiceType, index: number) => {
												return (
													<div key={index} className="flex justify-between p-2 bg-slate-950 mt-2 rounded cursor-pointer" onClick={()=>{moveToBookService(service)}}>
														<div>
															<p className="text-white">{service.title}</p>
															<p>{service.description}</p>
														</div>
														<div>
															<p className="text-white">{service.price}</p>
														</div>
													</div>
												);
											})}
										</div>
										<div className="px-2 border-l dark:border-gray-800">
											{bookService.map((service: CompanyServiceType, index: number) => {
												return (
													<div key={index} className="flex justify-between p-2 bg-slate-950 mt-2 rounded cursor-pointer" onClick={()=>{removeBookService(service)}}>
														<div>
															<p className="text-white">{service.title}</p>
															<p>{service.description}</p>
														</div>
														<div>
															<p className="text-white">{service.price}</p>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default BookAppointmentSettings;
