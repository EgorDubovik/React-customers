import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../store/axiosClient';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconMapPin from '../../components/Icon/IconMapPin';
import IconPhone from '../../components/Icon/IconPhone';
import IconMail from '../../components/Icon/IconMail';
import { viewCurrency } from '../../helpers/helper';
import moment from 'moment';
import IconPlus from '../../components/Icon/IconPlus';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';

const ViewCustomer = () => {
	const { id } = useParams();
	const [customer, setCustomer] = useState<any>({});
	const [loadingStatus, setLoadingStatus] = useState('loading');

	useEffect(() => {
		axiosClient
			.get(`/customers/${id}`)
			.then((res) => {
				setLoadingStatus('success');
				console.log('data:', res.data);
				setCustomer(res.data);
			})
			.catch((err) => {
				setLoadingStatus('error');
				console.log(err);
			})
			.finally(() => {
				console.log('finally');
			});
	}, []);
	return (
		<>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<div className="py-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="panel p-0">
							<div className="flex items-center justify-between p-4">
								<h3 className="font-semibold text-lg dark:text-white-light">Customer</h3>
								<Link to={'/customer/update/' + (customer.id ?? 0) + '?redirectTo=' + window.location.pathname} className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
									<IconPencilPaper className="w-4 h-4" />
								</Link>
							</div>
							<div className="mb-1">
								<div className="flex flex-col justify-center items-center ">
									{/* MAP */}
									<div className="w-full h-[200px] dark:bg-gray-800 bg-gray-200 flex items-center justify-center">Click to view map</div>

									<p className="font-semibold text-primary text-lg mt-4">{customer?.name}</p>
								</div>
								<div className="px-4 pb-4">
									<ul className="mt-5 flex flex-col m-auto space-y-4 font-semibold text-white-dark">
										{/* ADDRESS */}
										{customer?.address?.map((address: any, index: number) => (
											<li key={index} className="flex items-center gap-2">
												<IconMapPin className="shrink-0" />
												<a href={`https://www.google.com/maps?q=${encodeURIComponent(address.full)}`} target="_blank" rel="noopener noreferrer">
													{address?.full}
												</a>
											</li>
										))}
										<li className="flex items-center gap-2">
											<IconPhone />
											<span className="whitespace-nowrap" dir="ltr">
												{customer?.phone}
											</span>
										</li>
										<li>
											<div className="flex gap-2">
												<IconMail className="w-5 h-5 shrink-0" />
												<span className="text-primary truncate">{customer?.email}</span>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="grid grid-flow-row gap-3">
							<div className="panel p-4">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-lg dark:text-white-light">Appointments history</h3>
									<Link to={`/appointment/create/${customer.id}`} className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
										<IconPlus className="w-4 h-4" />
									</Link>
								</div>

								<div className="appointments-list py-4">
									{customer?.appointments?.map((appointment: any, index: number) => (
										<Link
											to={`/appointment/${appointment.id}`}
											key={index}
											className="flex justify-start items-center p-2 dark:bg-slate-950 rounded border-l mb-3"
											style={{ borderColor: appointment.techs.length > 0 ? appointment.techs[0].color : '#1565c0' }}
										>
											<div className="text-center px-4 whitespace-nowrap">
												<p>{moment(appointment.start).format('DD MMM')}</p>
												<p>{moment(appointment.start).format('hh:mm A')}</p>
											</div>
											<div className="border-l border-gray-700 h-full px-4 flex justify-between w-full items-center">
												<div>
													<p className="font-bold dark:text-gray-300">{appointment?.services[0]?.title}</p>
													<p>{appointment?.services[0]?.description}</p>
												</div>

												{appointment.remainingBalance > 0 ? (
													<div className="text-danger text-center text-[12px]">{viewCurrency(appointment.remainingBalance)}</div>
												) : (
													<div className="text-success text-center text-[12px]">{viewCurrency(appointment.totalPaid)}</div>
												)}
											</div>
										</Link>
									))}
								</div>
							</div>
							<div className="panel">
								<h3 className="font-semibold text-lg dark:text-white-light">Tags</h3>
								<div className="teags-list">
									{customer?.tags?.map((tag: any, index: number) => (
										<div key={index} className="tag-item">
											<span className="text-primary">{tag.name}</span>
										</div>
									))}
								</div>
							</div>
						</div>
						<div className="panel"></div>
					</div>
				</div>
			)}
		</>
	);
};

export default ViewCustomer;
