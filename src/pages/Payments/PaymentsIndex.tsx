import { useEffect, useState } from 'react';
import axiosClient from '../../store/axiosClient';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { viewCurrency } from '../../helpers/helper';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
import { getTechAbr } from '../../helpers/helper';
import ReactApexChart, { Props } from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { ApexOptions } from 'apexcharts';

const PaymentsIndex = () => {
	const [loadingStatus, setLoadingStatus] = useState<string>('loading');
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const [payments, setPayments] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [techs, setTechs] = useState([]);
	const [selectedTechs, setSelectedTechs] = useState<any[]>([]);
	const [totalPerPeriod, setTotalPerPeriod] = useState(0);
	const [creditTransaction, setCreditTransaction] = useState(0);
	const [transferTransaction, setTransferTransaction] = useState(0);
	const [cashTransaction, setCashTransaction] = useState(0);
	const [checkTransaction, setCheckTransaction] = useState(0);

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

	const ParseDate = (date: any) => {
		const labels:string[] = [];
		const chartData:number[] = [];
		date.forEach((element: any) => {
			labels.push(moment(element.date).format('DD MMM'));
			let amount = element.payments.map((payment: any) => payment.amount).reduce((a: number, b: number) => a + b, 0);
			
			chartData.push(amount);
			// console.log(element);
		});
		setOptions({...options, ["labels"]: labels});
		setSeries([{data: chartData}]);
	};

	useEffect(() => {
		setLoadingStatus('loading');
		axiosClient
			.get('/payments')
			.then((response) => {
				ParseDate(response.data.paymentForGraph);
				// console.log(response.data);
				// setPayments(response.data.payments);
				// setTechs(response.data.techs);
				// setTotalPerPeriod(response.data.totalPerPeriod);
				// setCreditTransaction(response.data.creditTransaction);
				// setTransferTransaction(response.data.transferTransaction);
				// setCashTransaction(response.data.cashTransaction);
				// setCheckTransaction(response.data.checkTransaction);

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
	const isDark = useSelector((state: IRootState) => state.themeConfig.isDarkMode);

	useEffect(() => {
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

	

	const [series, setSeries] = useState([
		{
			data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
		},
		{
			data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
		},
	]);

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
		colors: ['#2196F3', '#E7515A'],
		markers: {
			discrete: [
				{
					seriesIndex: 0,
					dataPointIndex: 6,
					fillColor: '#1B55E2',
					strokeColor: 'transparent',
					size: 7,
				},
				{
					seriesIndex: 1,
					dataPointIndex: 5,
					fillColor: '#E7515A',
					strokeColor: 'transparent',
					size: 7,
				},
			],
		},
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
					if (value > 1000) return '$' + value / 1000 + 'k';
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

	return (
		<div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<div className="grid grid-flow-row gap-4">
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
			)}
		</div>
	);
};

export default PaymentsIndex;
