import { useEffect, useState } from 'react';
import axiosClient from '../../store/axiosClient';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { viewCurrency } from '../../helpers/helper';

const PaymentsIndex = () => {
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const [payments, setPayments] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);

	useEffect(() => {
		setFilteredItems(payments);
	}, [payments]);

	useEffect(() => {
		axiosClient
			.get('/payments')
			.then((response) => {
				console.log(response.data);
				setPayments(response.data.payments);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="md:col-span-3 panel p-0 border-0 overflow-hidden">
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
											<td className="whitespace-nowrap">{viewCurrency(payment.amount)}</td>
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
				<div className='panel'>
					<h2>Technitial</h2>
				</div>
			</div>
		</div>
	);
};

export default PaymentsIndex;
