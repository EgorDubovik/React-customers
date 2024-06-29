import axiosClient from '../../../store/axiosClient';
import { CompanyServiceType } from './Index';
import { useEffect, useState } from 'react';

const Services = (props: any) => {
	const [loadedCompanyServices, setLoadetCompanyServices] = useState<CompanyServiceType[]>(props.loadedCompanyServices || []);
	const [bookService, setBookService] = useState<CompanyServiceType[]>(props.bookService || []);
	const [companyServices, setCompanyServices] = useState<CompanyServiceType[]>([]);
	const moveToBookService = (service: CompanyServiceType) => {
		let servicesIds = bookService.map((item) => item.id);
		servicesIds.push(service.id);
		axiosClient
			.post('/company/settings/book-appointment/update-services', { services: servicesIds })
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
	};

	const removeBookService = (service: CompanyServiceType) => {
		let servicesIds = bookService.map((item) => item.id);
		servicesIds = servicesIds.filter((id) => id !== service.id);
		axiosClient
			.post('/company/settings/book-appointment/update-services', { services: servicesIds })
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
	};
	useEffect(() => {
		setCompanyServices(
			loadedCompanyServices.filter((item) => {
				return !bookService.some((service) => service.id === item.id);
			})
		);
	}, []);
	return (
		<div className="grid grid-cols-2">
			<div className="px-2">
				{companyServices.map((service: CompanyServiceType, index: number) => {
					return (
						<div
							key={index}
							className="flex justify-between p-2 bg-slate-950 mt-2 rounded cursor-pointer"
							onClick={() => {
								moveToBookService(service);
							}}
						>
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
						<div
							key={index}
							className="flex justify-between p-2 bg-slate-950 mt-2 rounded cursor-pointer"
							onClick={() => {
								removeBookService(service);
							}}
						>
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
	);
};

export default Services;
