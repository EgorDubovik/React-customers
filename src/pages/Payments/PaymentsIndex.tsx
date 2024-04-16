import { useEffect, useState } from 'react';
import axiosClient from '../../store/axiosClient';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { viewCurrency } from '../../helpers/helper';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
import { getTechAbr } from '../../helpers/helper';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
const PaymentsIndex = () => {
	const [loadingStatus, setLoadingStatus] = useState<string>('loading');
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const [payments, setPayments] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [techs, setTechs] = useState([]);
	const [selectedTechs, setSelectedTechs] = useState<any[]>([]);

	useEffect(() => {
		setFilteredItems(payments);
	}, [payments]);

	useEffect(() => {
		const filtered = payments.filter((payment: any) => {
			return selectedTechs.includes(payment.tech_id);
		});
		setFilteredItems(filtered);
	}, [selectedTechs]);

	useEffect(() => {
		let techsIds = techs.map((tech: any) => tech.id);
		setSelectedTechs(techsIds);
	}, [techs]);

	useEffect(() => {
		setLoadingStatus('loading');
		axiosClient
			.get('/payments')
			.then((response) => {
				console.log(response.data);
				setPayments(response.data.payments);
				setTechs(response.data.techs);
				setLoadingStatus('success');
			})
			.catch((error) => {
				console.log(error);
				setLoadingStatus('error');
			});
	}, []);

	const toogleViewTech = (techId: number) => {
		if (selectedTechs.includes(techId)) {
			setSelectedTechs(selectedTechs.filter((id) => id !== techId));
		} else {
			setSelectedTechs([...selectedTechs, techId]);
		}
	};

	return (
		<div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="md:col-span-3 ">
						<div className="panel p-4">
							<h2>Graph</h2>
						</div>
						<div className="panel p-0 overflow-hidden mt-4">
							<div className="table-responsive">
								<table className="table-striped table-hover">
									<thead>
										<tr>
											<th>ID</th>
											<th>Customer</th>
											<th>Appointment</th>
											<th>Amount</th>
											<th>Day of payment</th>
											<th>Payment type</th>
											<th className="!text-center">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredItems.map((payment: any) => {
											return (
												<tr key={payment.id}>
													<td>{payment.id}</td>
													<td className="text-primary whitespace-nowrap">
														<Link to={'/customer/' + payment.customer?.id ?? 0}>{payment.customer ? payment.customer.name : 'Unknow'}</Link>
													</td>
													<td className="text-primary whitespace-nowrap">
														<Link to={'/appointment/' + payment.appointment?.id ?? 0}>
															Appointment at {payment.appointment ? moment(payment.appointment.created_at).format('d-m-Y') : 'Unknow'}
														</Link>
													</td>
													<td className={'whitespace-nowrap' + (payment.amount > 0) ? 'text-success' : 'text-danger'}>{viewCurrency(payment.amount)}</td>
													<td>{moment(payment.date).format('DD MMM YYYY')}</td>
													<td>{payment.payment_type}</td>
													<td>
														<div className="flex justify-center">
															<IconTrashLines className="text-danger" />
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div className="panel">
						<h2>Technitial</h2>
						<ul className="mt-2">
							{techs.map((tech: any, index: number) => (
								<li
									key={index}
									className={'p-2 mb-2 flex cursor-pointer items-center ' + (selectedTechs.includes(tech.id) ? 'dark:bg-success-dark-light' : 'dark:bg-gray-900') + '  bg-gray-100 rounded-md'}
									onClick={() => toogleViewTech(tech.id)}
								>
									<div className="mr-2">
										<span className={"flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-'bg-danger text-white"} style={{ backgroundColor: tech.color }}>
											{getTechAbr(tech.name)}
										</span>
									</div>
									<div className="flex-grow ml-4">
										<p className="font-semibold">{tech.name}</p>
										<p className="font-semibold">{tech.phone}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default PaymentsIndex;
