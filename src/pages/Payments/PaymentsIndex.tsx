import { useEffect, useState } from 'react';
import axiosClient from '../../store/axiosClient';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { formatDate, viewCurrency } from '../../helpers/helper';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
import { getTechAbr } from '../../helpers/helper';
import ReactApexChart, { Props } from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { SmallDangerLoader } from '../../components/loading/SmallCirculeLoader';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { use } from 'i18next';
import {ButtonLoader} from '../../components/loading/ButtonLoader';

const PaymentsIndex = () => {
	const [loadingStatus, setLoadingStatus] = useState<string>('success');
	const [newDateStatus, setNewDateStatus] = useState<string>('success');
	const [startDate, setstartDate] = useState(moment().subtract(30, 'days').format('MM/DD/YYYY'));
	const [endDate, setendDate] = useState(moment().format('MM/DD/YYYY'));
	const [payments, setPayments] = useState<any[]>([]);
	const [filteredItems, setFilteredItems] = useState<any[]>([]);
	const [techs, setTechs] = useState<any[]>([]);
	const [selectedTechs, setSelectedTechs] = useState<any[]>([]);
	const [totalPerPeriod, setTotalPerPeriod] = useState(0);
	const [creditTransaction, setCreditTransaction] = useState(0);
	const [transferTransaction, setTransferTransaction] = useState(0);
	const [cashTransaction, setCashTransaction] = useState(0);
	const [checkTransaction, setCheckTransaction] = useState(0);
	const [paymentRemoveStatus, setPaymentRemoveStatus] = useState(0);
	const isDark = useSelector((state: IRootState) => state.themeConfig.isDarkMode);
	const user = useSelector((state: IRootState) => state.themeConfig.user);
	const [series, setSeries] = useState<any[]>([]);
	const [options, setOptions] = useState<any>({
		chart: {
			height: 325,
			type: 'area',
			fontFamily: 'Nunito, sans-serif',
			zoom: {
				enabled: false,
			},
			toolbar: {
				show: false,
			},
		},

		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			curve: 'smooth',
			width: 2,
			lineCap: 'square',
		},
		dropShadow: {
			enabled: true,
			opacity: 0.2,
			blur: 10,
			left: -7,
			top: 22,
		},
		colors: [],
		labels: [],
		xaxis: {
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
			crosshairs: {
				show: true,
			},
			labels: {
				offsetY: 5,
				style: {
					fontSize: '12px',
					cssClass: 'apexcharts-xaxis-title',
				},
			},
		},
		yaxis: {
			tickAmount: 7,
			labels: {
				formatter: (value: number) => {
					//if (value >= 1000) return '$' + (Math.round((value / 10)) / 100) + 'k';
					return viewCurrency(value);
				},
				offsetX: -10,
				offsetY: 0,
				style: {
					fontSize: '12px',
					cssClass: 'apexcharts-yaxis-title',
				},
			},
		},
		grid: {
			borderColor: isDark ? '#191E3A' : '#E0E6ED',
			strokeDashArray: 5,
			xaxis: {
				lines: {
					show: true,
				},
			},
			yaxis: {
				lines: {
					show: false,
				},
			},
			padding: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			},
		},
		legend: {
			show: false,
		},
		tooltip: {
			marker: {
				show: true,
			},
			x: {
				show: false,
			},
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				inverseColors: !1,
				opacityFrom: isDark ? 0.19 : 0.28,
				opacityTo: 0.05,
				stops: isDark ? [100, 100] : [45, 100],
			},
		},
	});

	useEffect(() => {
		ParseDate(payments);
		getTechsColors();
	}, [selectedTechs]);

	const getTechsColors = () => {
		const colors: any = [];
		selectedTechs.forEach((techId) => {
			const tech = techs.find((tech) => tech.id === techId);
			if (tech) {
				colors.push(tech.color);
			}
		});
		
		setOptions((prevOptions: any) => ({ ...prevOptions, colors: colors }));
	};
	const ParseDate = (date: any) => {
		console.log('ParseDate', date);
		const labels: string[] = [];
		const chartData: any = {};
		const paymentsForTable: any[] = [];
		let totalPerPeriod = 0;
		let creditTransaction = 0;
		let transferTransaction = 0;
		let cashTransaction = 0;
		let checkTransaction = 0;
		date.forEach((element: any) => {
			let dataOneDayByTech: any = {};
			labels.push(moment(element.date).format('DD MMM'));
			element.payments.forEach((payment: any) => {
				if (selectedTechs.includes(payment.tech_id)) {
					totalPerPeriod += payment.amount;
					paymentsForTable.push(payment);
					if (payment.payment_type === 'credit') {
						creditTransaction += payment.amount;
					}
					if (payment.payment_type === 'transfer') {
						transferTransaction += payment.amount;
					}
					if (payment.payment_type === 'cash') {
						cashTransaction += payment.amount;
					}
					if (payment.payment_type === 'check') {
						checkTransaction += payment.amount;
					}
					if (dataOneDayByTech[payment.tech_id]) {
						dataOneDayByTech[payment.tech_id] += payment.amount;
					} else {
						dataOneDayByTech[payment.tech_id] = payment.amount;
					}
				}
			});

			selectedTechs.forEach((techId: any) => {
				if (!chartData[techId]) {
					chartData[techId] = [];
				}
				if (dataOneDayByTech[techId]) {
					chartData[techId].push(dataOneDayByTech[techId]);
				} else {
					chartData[techId].push(0);
				}
			});
		});
		let series: any[] = [];
		selectedTechs.forEach((techId: any) => {

			series.push({
				name: techs.find((tech) => tech.id === techId)?.name ?? 'Unknow',
				data: chartData[techId],
			});
		});
		setOptions((prevOptions: any) => ({ ...prevOptions, labels: labels }));
		console.log('set series:', series);
		setSeries(series);
		setTotalPerPeriod(totalPerPeriod);
		setCreditTransaction(creditTransaction);
		setTransferTransaction(transferTransaction);
		setCashTransaction(cashTransaction);
		setCheckTransaction(checkTransaction);
		setFilteredItems(paymentsForTable.sort((a, b) => b.id - a.id));
	};

	const getTechsList = (allPayments: any) => {
		let techs: any[] = [];
		allPayments.forEach((payment: any) => {
			if (payment.payments.length === 0) return;
			payment.payments.forEach((p: any) => {
				if (!techs.includes(p.tech_id)) {
					techs.push(p.tech_id);
				}
			});
		});
		setSelectedTechs(techs);
	};

	useEffect(() => {
		getTechsList(payments);
	}, [payments]);


	const getPayments = (setStatus: (status: string) => void) => {
		setStatus('loading');
		axiosClient
			.get('/payments', { params: { startDate, endDate } })
			.then((response) => {
				console.log(response.data.paymentForGraph);
				setPayments(response.data.paymentForGraph);
				setTechs(response.data.techs);
				setStatus('success');
			})
			.catch((error) => {
				console.log(error);
				setStatus('error');
			});
	}

	useEffect(() => {
		getPayments(setNewDateStatus);
	}, [startDate, endDate]);

	useEffect(() => {
		getPayments(setLoadingStatus);
	}, []);

	const toogleViewTech = (techId: number) => {
		if (selectedTechs.includes(techId)) {
			setSelectedTechs(selectedTechs.filter((id) => id !== techId));
		} else {
			setSelectedTechs([...selectedTechs, techId]);
		}
	};

	useEffect(() => {
		console.log('isDark:', isDark);
		setOptions({
			...options,
			colors: [isDark ? '#2196F3' : '#1B55E2', isDark ? '#E7515A' : '#E7515A'],
			grid: {
				...options.grid,
				borderColor: isDark ? '#191E3A' : '#E0E6ED',
			},
			fill: {
				...options.fill,
				gradient: {
					...options.fill.gradient,
					opacityFrom: isDark ? 0.19 : 0.28,
				},
			},
		});
	}, [isDark]);

	const removePaymentHandler = (paymentId: number) => {
		setPaymentRemoveStatus(paymentId);
		axiosClient
			.delete('/payments/' + paymentId)
			.then((response) => {
				setFilteredItems(filteredItems.filter((payment) => payment.id !== paymentId));
			}) 
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setPaymentRemoveStatus(0);
			});

	};

	return (
		<div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<div className="grid grid-flow-row gap-4">
					<div className='flex justify-start items-center text-lg'>
						<h1>Payments</h1>
						<div className='ml-3 p-2 dark:bg-gray-900 bg-gray-200 rounded cursor-pointer'>
							
							From:
							<Flatpickr
								options={{ dateFormat: 'm/d/Y' }}
								value={startDate}
								onChange={(date) => {
									setstartDate(moment(date[0]).format('MM/DD/YYYY'));
								}}
								className='border-0 bg-transparent text-primary dark:text-white ml-3 w-32'
							/>
							To:
							<Flatpickr
								options={{ dateFormat: 'm/d/Y' }}
								value={endDate}
								onChange={(date) => {
									setendDate(moment(date[0]).format('MM/DD/YYYY'));
								}}
								className='border-0 bg-transparent text-primary dark:text-white ml-3 w-32'
							/>
						</div>
						{newDateStatus === 'loading' && <ButtonLoader />}
						
					</div>
					<div className="panel p-2">
						<ul className="">
							{techs.map((tech: any, index: number) => (
								<li
									key={index}
									className={
										'p-2 float-left px-4 m-1 first:ml-0 flex cursor-pointer items-center ' +
										(selectedTechs.includes(tech.id) ? 'dark:bg-success-dark-light' : 'dark:bg-gray-900') +
										'  bg-gray-100 rounded-md'
									}
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

					<div className="panel p-4">
						<h2>Graph</h2>
						<div>
							<ReactApexChart series={series} options={options} type="area" height={325} />
						</div>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6 text-center">
						<div className="panel text-center col-span-2">
							Total per period
							<div className="text-[25px] font-bold mt-2">{viewCurrency(totalPerPeriod)}</div>
						</div>
						<div className="panel">
							Credit transaction
							<div className="text-[25px] font-bold mt-2">{viewCurrency(creditTransaction)}</div>
						</div>
						<div className="panel">
							Transfer transaction
							<div className="text-[25px] font-bold mt-2">{viewCurrency(transferTransaction)}</div>
						</div>
						<div className="panel">
							Cash transaction
							<div className="text-[25px] font-bold mt-2">{viewCurrency(cashTransaction)}</div>
						</div>
						<div className="panel">
							Check transaction
							<div className="text-[25px] font-bold mt-2">{viewCurrency(checkTransaction)}</div>
						</div>
					</div>

					<div className="panel p-0 overflow-hidden">
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
													<Link to={'/customer/' + payment.job?.customer?.id ?? 0}>{payment.job?.customer ? payment.job?.customer.name : 'Unknow'}</Link>
												</td>
												<td className="text-primary whitespace-nowrap">
													<Link to={'/appointment/' + payment.job.appointments[payment.job.appointments?.length-1]?.id ?? 0}>
														Appointment at {payment.job.appointments[payment.job.appointments?.length-1] ? formatDate(payment.job.appointments[payment.job.appointments?.length-1].start,'MMM DD YYYY') : 'Unknow'}
													</Link>
												</td>
												<td className={'whitespace-nowrap' + (payment.amount > 0) ? 'text-success' : 'text-danger'}>{viewCurrency(payment.amount)}</td>
												<td>{moment(payment.created_at).format('DD MMM YYYY')}</td>
												<td>{payment.type_text}</td>
												<td>
													{user.isAdmin && (
													<div className="flex justify-center">
														{paymentRemoveStatus === payment.id ? (
															<SmallDangerLoader />
														) : (
															<span className="text-primary cursor-pointer" onClick={() => removePaymentHandler(payment.id)}>
																<IconTrashLines className="text-danger" />
															</span>
														)}
													</div>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PaymentsIndex;
