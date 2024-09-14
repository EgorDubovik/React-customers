import { useState, Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../store/axiosClient';
import IconChecks from '../../components/Icon/IconChecks';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import IconArrowBackward from '../../components/Icon/IconArrowBackward';
import IconClock from '../../components/Icon/IconClock';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import { useAppointmentContext } from './context/AppointmentContext';
import { Dialog, Transition } from '@headlessui/react';
import { viewCurrency, formatDate, manualIsoString } from '../../helpers/helper';
import TimePicker from 'edtimepicker';


const Header = () => {
	const { appointment, updateStatus, updatePayments } = useAppointmentContext();
	const total = appointment?.job?.total_amount || 0;
	const remaining = appointment?.job?.remaining_balance || 0;
	
	const [updateAppointmentLoading, setUpdateAppointmentLoading] = useState<boolean>(false);
	const [modal, setModal] = useState(false);
	const [paymentsLoading, setPaymentsLoading] = useState(false);
	const patmentsType = ['Credit', 'Transfer', 'Check', 'Cash'];
	const [selectedPaymentType, setSelectedPaymentType] = useState<number>(0);
	const [typeOfAmount, setTypeOfAmount] = useState<string>('full');
	const [amountPay, setAmountPay] = useState<number>(remaining);

	const navigate = useNavigate();
   // Для создания копии апоинтмента
   const [appointmentCopyModal, setAppointmentCopyModal] = useState(false);
	const [selectedTime, setSelectedTime] = useState<string>('timeFrom');
	const [timeFrom, setTimeFrom] = useState<Date>(new Date());
	const [timeTo, setTimeTo] = useState<Date>(new Date());
	const [timeToIsSelected, setTimeToIsSelected] = useState<boolean>(false);
   const [isFinishCurerentAppointment, setIsFinishCurerentAppointment] = useState<boolean>(true);

	useEffect(() => {
		setAmountPay(remaining);
	}, [remaining]);

	const onTimeFromChanged = (date: Date) => {
		setTimeFrom(new Date(date));
		if (!timeToIsSelected) setTimeTo(new Date(date.getTime() + 60 * 120 * 1000));
	};
	const onTimeToChanged = (date: any) => {
		setTimeToIsSelected(true);
		setTimeTo(new Date(date));
	};

	const changeAmount = (e: any) => {
		if (isNaN(e.target.value)) return;

		const amount = e.target.value;
		setAmountPay(amount);
	};

	const setAmount = (type: string) => {
		if (type === 'full') {
			setAmountPay(remaining);
			setTypeOfAmount('full');
		} else if (type === 'deposit') {
			setAmountPay(100);
			setTypeOfAmount('deposit');
		}
	};

	const addPayment = () => {
		setPaymentsLoading(true);
		if (amountPay > 0) {
			axiosClient
				.post(`appointment/payment/${appointment?.job_id}`, {
					amount: amountPay,
					payment_type: patmentsType[selectedPaymentType],
				})
				.then((res) => {
					updatePayments([...appointment?.job.payments || [], res.data.payment]);
					setModal(false);
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setPaymentsLoading(false);
				});
		} else {
			console.error('Enter valid amount');
			setAmountPay(0);
		}
	};

	const handaleFinishOrActivateAppointment = () => {
		setUpdateAppointmentLoading(true);
		axiosClient
			.put(`appointment/${appointment?.id}/status`)
			.then((res) => {
				updateStatus(appointment?.status === 0 ? 1 : 0);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setUpdateAppointmentLoading(false);
			});
	};


   const onCreateCopy = () => {
      const data = {
         timeFrom: manualIsoString(timeFrom),
         timeTo: manualIsoString(timeTo),
         isFinishCurerentAppointment,
         appointmentId: appointment?.id
      }
      axiosClient.post(`appointment/copy/${appointment?.id}`, data)
			.then(res=>{
				navigate(`/appointment/${res.data.appointment.id}`);
				setAppointmentCopyModal(false);
			})
			.catch(err=>{
				console.log(err);
				alert('Error, try again');
			})
			.finally(()=>{
				setAppointmentCopyModal(false);
			});
   }

	return (
		<div className="flex gap-2 md:justify-end justify-around mb-2">
			<div className="flex-auto md:flex-none">
				<button
					onClick={handaleFinishOrActivateAppointment}
					type="button"
					className={`btn ${appointment?.status === 0 ? 'btn-primary' : 'btn-outline-dark'} h-full text-[13px] px-0 md:px-4 w-full whitespace-nowrap overflow-hidden text-ellipsis`}
				>
					{updateAppointmentLoading ? <ButtonLoader /> : appointment?.status === 0 ? <IconChecks /> : <IconArrowBackward />}
					<span className="ml-1">{appointment?.status === 0 ? 'Finish Appointment' : 'Back to Active'}</span>
				</button>
			</div>

			<div className="flex-auto md:flex-none ">
				<button
					type="button"
					onClick={() => {
						setAppointmentCopyModal(true);
					}}
					className="btn btn-primary h-full text-[13px] px-0 md:px-4 w-full whitespace-nowrap overflow-hidden text-ellipsis"
				>
					<IconClock className="mr-1" />
					Create copy
				</button>
			</div>
			<div className="flex-auto md:flex-none">
				<button type="button" className="btn btn-primary h-full text-[13px] px-0 md:px-4 w-full whitespace-nowrap overflow-hidden text-ellipsis" onClick={() => setModal(true)}>
					<IconCreditCard className="mr-1" />
					Pay
				</button>
			</div>
			<Transition appear show={appointmentCopyModal} as={Fragment}>
				<Dialog as="div" open={appointmentCopyModal} onClose={() => setAppointmentCopyModal(false)}>
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
										<div className="mt-5">
											<div className="mb-5 flex justify-center bg-gray-100 dark:bg-white-dark/10 rounded p-2">
												<div
													onClick={() => setSelectedTime('timeFrom')}
													className={
														'w-1/2 timeFrom flex justify-center items-center cursor-pointer py-3 rounded ' +
														(selectedTime === 'timeFrom' ? 'dark:bg-black/25 dark:text-white font-bold bg-gray-200' : '')
													}
												>
													<div>From:</div>
													<div className="ml-10 text-center">
														<div>{formatDate(timeFrom, 'MMM DD')}</div>
														<div>{formatDate(timeFrom, 'hh:mm A')}</div>
													</div>
												</div>
												<div
													onClick={() => setSelectedTime('timeTo')}
													className={
														'w-1/2 timeFrom flex justify-center items-center cursor-pointer py-3 rounded ' +
														(selectedTime === 'timeTo' ? 'dark:bg-black/25 dark:text-white font-bold bg-gray-200' : '')
													}
												>
													<div>To:</div>
													<div className="ml-10 text-center">
														<div>{formatDate(timeTo, 'MMM DD')}</div>
														<div>{formatDate(timeTo, 'hh:mm A')}</div>
													</div>
												</div>
											</div>
											<div className="text-[16px] dark:text-white text-right">
												{selectedTime === 'timeFrom' && (
													<TimePicker
														currentDate={timeFrom}
														options={{
															itemsHeight: 45,
															textAlign: 'right',
															borderColor: '#077afe',
														}}
														onDateChange={onTimeFromChanged}
													/>
												)}
												{selectedTime === 'timeTo' && (
													<TimePicker
														currentDate={timeTo}
														options={{
															itemsHeight: 45,
															textAlign: 'right',
															daysNameFormat: 'MMM DD, DDDD',
															borderColor: '#077afe',
														}}
														onDateChange={onTimeToChanged}
													/>
												)}
											</div>
											<div className="flex mt-4">
												<label className="flex items-center cursor-pointer">
													<input type="checkbox" className="form-checkbox" checked={isFinishCurerentAppointment} onChange={()=>setIsFinishCurerentAppointment((prev)=>!prev)} />
													<span className=" text-white-dark">Finish current appointment</span>
												</label>
											</div>
                                 <div className='mt-4'>
                                    <button type='button' onClick={onCreateCopy} className='btn btn-primary w-full'>Create new appointment</button>
                                 </div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
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
											<span className="text-danger">Remaining: {viewCurrency(remaining)}</span>
											<span className="text-success">Total: {viewCurrency(total)}</span>
										</div>
										<div className="input-amount text-center text-5xl py-10">
											${' '}
											<input
												type="text"
												pattern="\d*\.?\d*"
												className="w-[200px] bg-transparent border-b border-gray-700 text-center outline-none"
												value={amountPay}
												onChange={changeAmount}
											/>
										</div>
										<div className="flex justify-center">
											{remaining > 100 && (
												<button type="button" onClick={() => setAmount('deposit')} className={`btn ${typeOfAmount === 'deposit' ? 'btn-primary' : 'btn-outline-primary'} mr-4`}>
													Deposit
												</button>
											)}
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
											<button type="button" onClick={addPayment} className="btn btn-primary ltr:ml-4 rtl:mr-4">
												Pay Now
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

export default Header;
