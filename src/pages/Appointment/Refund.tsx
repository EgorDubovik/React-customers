import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import { viewCurrency } from '../../helpers/helper';
import axiosClient from '../../store/axiosClient';
import { useAppointmentContext } from './context/AppointmentContext';
const Refund = () => {
   const {appointment, updatePayments} = useAppointmentContext();
   const [modal, setModal] = useState(false);
   const totalPaid = appointment?.job?.total_paid || 0;
	const [amountRefund, setAmountRefund] = useState(totalPaid);
	const [typeOfAmount, setAmount] = useState('full');
	const [paymentsLoading, setPaymentsLoading] = useState(false);
	const patmentsType = ['Credit', 'Transfer', 'Check', 'Cash'];
   
   useEffect(() => {
      setAmountRefund(totalPaid);
   }, [totalPaid]);

	const changeAmount = (e: any) => {
		if (isNaN(e.target.value)) return;

		const amount = e.target.value;
		setAmountRefund(amount);
	};
	const addRefund = () => {
		setPaymentsLoading(true);
      axiosClient.post(`/appointment/payment/refund/${appointment?.job.id}`, {
         amount: amountRefund,
         payment_type: patmentsType[selectedPaymentType],
      })
      .then((res) => {
         if(res.status === 200){
			   updatePayments([...appointment?.job.payments || [], res.data.payment]);
         }
         setModal(false);
      })
      .catch((err) => {
         alert('Something went wrong. Please try again later');
         console.log(err);
      })
      .finally(() => {
         setPaymentsLoading(false);
      });
      
	};
	
	const [selectedPaymentType, setSelectedPaymentType] = useState(0);

	return (
		<div>
			<button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setModal(true)}>
				Issue refund
			</button>
			<Transition appear show={modal} as={Fragment}>
				<Dialog as="div" open={modal} onClose={() => setModal(false)}>
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<div className="fixed inset-0" />
					</Transition.Child>
					<div id="login_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
						<div className="flex items-start justify-center min-h-screen px-4">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="panel border-0 py-1 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
									<div className="py-4 px-2">
										<div className="title flex justify-between">
											
											<span className="text-success">Total Paid: {viewCurrency(totalPaid)}</span>
										</div>
										<div className="input-amount text-center text-5xl py-10">
											${' '}
											<input
												type="text"
												pattern="\d*\.?\d*"
												className="w-[200px] bg-transparent border-b border-gray-700 text-center outline-none"
												value={amountRefund}
												onChange={changeAmount}
											/>
										</div>
										<div className="flex justify-center">
											<button type="button" onClick={() => setAmount('full')} className={`btn ${typeOfAmount === 'full' ? 'btn-primary' : 'btn-outline-primary'}`}>
												Full
											</button>
										</div>
										<div className="payment-methods mt-10">
											<div className="relative inline-flex w-full align-middle justify-around">
												{patmentsType.map((type, index) => (
													<button
														key={index}
														onClick={() => setSelectedPaymentType(index)}
														type="button"
														className={`btn ${selectedPaymentType === index ? 'btn-primary' : 'btn-outline-primary'} w-full ${
															index === 0 ? 'rounded-r-none' : index === patmentsType.length - 1 ? 'rounded-l-none' : 'rounded-none'
														} `}
													>
														{type}
													</button>
												))}
											</div>
										</div>

										<div className="flex justify-end items-center mt-10">
											<button type="button" onClick={() => setModal(false)} className="btn btn-outline-danger">
												Discard
											</button>
											<button type="button" onClick={addRefund} className="btn btn-primary ltr:ml-4 rtl:mr-4">
												Refund Now
												{paymentsLoading && <ButtonLoader />}
											</button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};

export default Refund;
