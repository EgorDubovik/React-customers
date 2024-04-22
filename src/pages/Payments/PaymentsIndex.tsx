import { useEffect, useState } from 'react';
import axiosClient from '../../store/axiosClient';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { viewCurrency } from '../../helpers/helper';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
import { getTechAbr } from '../../helpers/helper';
import ReactApexChart from 'react-apexcharts';
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

	useEffect(() => {
		setLoadingStatus('loading');
		axiosClient
			.get('/payments')
			.then((response) => {
				console.log(response.data);
				setPayments(response.data.payments);
				setTechs(response.data.techs);
				setTotalPerPeriod(response.data.totalPerPeriod);
				setCreditTransaction(response.data.creditTransaction);
				setTransferTransaction(response.data.transferTransaction);
				setCashTransaction(response.data.cashTransaction);
				setCheckTransaction(response.data.checkTransaction);

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

	const options = {
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
		colors: ['#2196F3'],
		markers: {
			 discrete: [
				  {
						seriesIndex: 0,
						dataPointIndex: 6,
						fillColor: '#1B55E2',
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
				  offsetX: 0,
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
						return value / 1000 + 'K';
				  },
				  offsetX:  -10,
				  offsetY: 0,
				  style: {
						fontSize: '12px',
						cssClass: 'apexcharts-yaxis-title',
				  },
			 },
			 opposite: false,
		},
		grid: {
			 borderColor: '#191E3A',
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
			 position: 'top',
			 horizontalAlign: 'right',
			 fontSize: '16px',
			 markers: {
				  width: 10,
				  height: 10,
				  offsetX: -2,
			 },
			 itemMargin: {
				  horizontal: 10,
				  vertical: 5,
			 },
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
				  opacityFrom: 0.19,
				  opacityTo: 0.05,
				  stops: [100, 100],
			 },
		},
	};
	const series = [
		{
			name: 'Total',
			data: payments.map((payment: any) => payment.amount),
		},
	];

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
							<ReactApexChart
								options={options}
								series={series}
								type="area"
								height={350}
								width={'100%'}
								className="shadow-lg"/>
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
