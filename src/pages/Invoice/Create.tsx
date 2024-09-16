import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconDownload from '../../components/Icon/IconDownload';
import IconEdit from '../../components/Icon/IconEdit';
import IconPlus from '../../components/Icon/IconPlus';
import axiosClient from '../../store/axiosClient';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import { IInvoice } from '../../types';
import { formatDate, viewCurrency } from '../../helpers/helper';

const Create = () => {
	const { appointmentId } = useParams();
	const dispatch = useDispatch();
	const navigator = useNavigate();
	const [invoice, setInvoice] = useState<IInvoice>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [sendLoading, setSendLoading] = useState(false);
	useEffect(() => {
		dispatch(setPageTitle('Invoice Preview'));
	}, []);

	useEffect(() => {
		setLoading(true);
		axiosClient
			.get('appointment/invoice/' + appointmentId)
			.then((res) => {
				console.log(res.data);

				setInvoice(res.data.invoice);
			})
			.catch((err) => {
				setError(true);
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	const sendInvoice = () => {
		setSendLoading(true);
		axiosClient
			.post('appointment/' + appointmentId + '/invoice-send')
			.then((res) => {
				navigator('/invoices');
			})
			.catch((err) => {
				alert('Something went wrong');
				console.log(err);
			})
			.finally(() => {
				setSendLoading(false);
			});
	};
	const downloadInvoice = () => {
		axiosClient
			.get('/invoice/download/' + appointmentId, { responseType: 'blob' })
			.then((res) => {
				const blob = new Blob([res.data], { type: 'application/pdf' });
				const url = window.URL.createObjectURL(blob);

				// Open the PDF in a new tab
				window.open(url, '_blank');

				// Optional: Revoke the object URL after some time to free up memory
				setTimeout(() => window.URL.revokeObjectURL(url), 10000);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<>
			{error && (
				<div>
					<div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
						<span className="ltr:pr-2 rtl:pl-2">
							<strong className="ltr:mr-1 rtl:ml-1">Woops!</strong>Something went wrong. Please try again or{' '}
							<a
								href=""
								onClick={() => {
									window.location.reload();
								}}
								className="underline"
							>
								reload the page
							</a>
						</span>
					</div>
				</div>
			)}
			{loading && (
				<div className="text-center mt-10">
					<span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
				</div>
			)}
			{!loading && (
				<div className="conteiner w-full md:w-2/3 m-auto">
					<div className="flex gap-2 md:justify-end justify-around mb-4">
						<div className="flex-auto md:flex-none">
							<button type="button" className="btn btn-info gap-1 px-0 md:px-4 w-full whitespace-nowrap overflow-hidden text-ellipsis" onClick={sendInvoice}>
								<IconSend />
								Send Invoice
								{sendLoading && <ButtonLoader />}
							</button>
						</div>

						<div className="flex-auto md:flex-none ">
							<button type="button" className="btn btn-primary gap-1 px-0 md:px-4 w-full whitespace-nowrap overflow-hidden text-ellipsis">
								<IconPrinter />
								Print
							</button>
						</div>
						<div className="flex-auto md:flex-none">
							<button type="button" className="btn btn-success gap-1 px-0 md:px-4 w-full whitespace-nowrap overflow-hidden text-ellipsis" onClick={downloadInvoice}>
								<IconDownload />
								Download
							</button>
						</div>
					</div>

					<div className="panel">
						<div className="panel-logo flex justify-between">
							<img src={invoice?.company?.logo} alt="logo" className="h-[50px]" />
							<h2 className="text-2xl font-bold">#INV-{invoice?.id}</h2>
						</div>
						<div className="company-info pt-10 space-y-2">
							<h3 className="font-bold text-xl">{invoice?.company?.name}</h3>
							<p>{invoice?.company?.fullAddress}</p>
							<p>{invoice?.company?.phone}</p>
							<p>{invoice?.company?.email}</p>
						</div>
						<div className="invoice-to flex justify-between mt-10">
							<div className="customer-info space-y-2">
								<h3 className="font-bold text-xl">Invoice To</h3>
								<p>{invoice?.job.customer.name}</p>
								<p>{invoice?.job.address.full}</p>
								<p>{invoice?.job.customer.phone}</p>
								<p>{invoice?.email}</p>
							</div>
							<div className="payment-due">
								<table>
									<tbody>
										<tr>
											<td>Invoice#:</td>
											<td>{invoice?.id}</td>
										</tr>
										<tr>
											<td>Invoice Date:</td>
											<td>{formatDate(new Date(), 'MMM DD YYYY')}</td>
										</tr>
										<tr>
											<td>Balance:</td>
											<td>{viewCurrency(invoice?.job.remaining_balance)}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="table-responsive mt-10">
							<table className="">
								<thead>
									<tr>
										<th></th>
										<th>ITEM</th>
										<th className="text-right" style={{ textAlign: 'right' }}>
											TOTAL
										</th>
									</tr>
								</thead>
								<tbody>
									{invoice?.job.services.map((service, index: number) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td style={{ width: '70%' }}>
												<p className="dark:text-white">{service.title}</p>
												<p className="dark:text-gray-600">{service.description}</p>
											</td>
											<td className="text-right dark:text-white" style={{ textAlign: 'right' }}>
												{viewCurrency(service.price)}
											</td>
										</tr>
									))}
									<tr>
										<td></td>
										<td className="text-right dark:text-white" style={{ textAlign: 'right' }}>
											TAX:
										</td>
										<td className="text-right dark:text-white" style={{ textAlign: 'right' }}>
											{viewCurrency(invoice?.job.total_tax)}
										</td>
									</tr>
									<tr>
										<td></td>
										<td className="text-right dark:text-white font-bold" style={{ textAlign: 'right' }}>
											TOTAL:
										</td>
										<td className="text-right dark:text-white font-bold" style={{ textAlign: 'right' }}>
											{viewCurrency(invoice?.job.total_amount)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="payment mt-10 flex justify-end">
							<h2 className="font-bold">Payment History:</h2>
							<div className="table-responsive mb-5 w-full md:w-1/2 ml-4">
								<table>
									<tbody>
										{invoice?.job.payments.map((payment: any, index: number) => (
											<tr key={index}>
												<td>{formatDate(payment.created_at, 'MMM DD YYYY, hh:mm A')}</td>
												<td>{payment.type_text}</td>
												<td className="text-right" style={{ textAlign: 'right' }}>
													{viewCurrency(payment.amount)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Create;
