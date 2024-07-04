import { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import axiosClient from '../../store/axiosClient';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import { SmallDangerLoader } from '../../components/loading/SmallCirculeLoader';
import { showMessage } from '../../helpers/helper';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';

const Services = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setPageTitle('Company Services'));
	});

	const [loadingStatus, setLoadingStatus] = useState('loading');
	const [loadingRequest, setLoadingRequest] = useState(false);
	const [error, setError] = useState(false);
	const [services, setServices] = useState<any[]>([]);
	const [addContactModal, setAddContactModal] = useState(false);
	const [service, setService] = useState({ id: null, title: '', description: '', price: '' });
	const [emptyTitle, setEmptyTitle] = useState(false);
	const [emptyPrice, setEmptyPrice] = useState(false);
	const [userRole, setUserRole] = useState<String[]>([]);
	const [removeService, setRemoveService] = useState<number>(0);
	const [updateService, setUpdateService] = useState({
		id: null,
		title: '',
		price: '',
		description: '',
	});
	const fetchServices = () => {
		setLoadingStatus('loading');
		axiosClient
			.get('company/settings/services')
			.then((response) => {
				setUserRole(response.data.userRols);
				setServices(response.data.services);
				setLoadingStatus('success');
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoadingStatus('error');
			});
	};

	useEffect(() => {
		fetchServices();
	}, []);

	const addservice = () => {
		setService({ id: null, title: '', description: '', price: '' });
		setAddContactModal(true);
	};

	const onChange = (e: any) => {
		if (e.target.name === 'title' && emptyTitle) setEmptyTitle(false);
		if (e.target.name === 'price' && emptyPrice) setEmptyPrice(false);
		setService({ ...service, [e.target.name]: e.target.value });
	};

	const saveService = () => {
		if (!loadingRequest) {
			let empty = false;
			if (!service.title?.trim()) {
				setEmptyTitle(true);
				empty = true;
			}
			if (!service.price?.trim()) {
				setEmptyPrice(true);
				empty = true;
			}

			if (empty) return;

			if (service.id) {
				setLoadingRequest(true);
				axiosClient
					.put('company/settings/services/' + service.id, service)
					.then((response) => {
						setAddContactModal(false);
						for (let i = 0; i < services.length; i++) {
							if (services[i].id === service.id) {
								services[i] = service;
								break;
							}
						}
						setServices([...services]);
					})
					.catch((error) => {
						console.error('Error:', error);
						showMessage('Somthing went wrong. Please try again.', 'error');
					})
					.finally(() => {
						setLoadingRequest(false);
					});
			} else {
				setLoadingRequest(true);
				axiosClient
					.post('company/settings/services', service)
					.then((response) => {
						setAddContactModal(false);
						services.unshift(response.data.service);
						setServices([...services]);
					})
					.catch((error) => {
						console.error('Error:', error);
						showMessage('Somthing went wrong. Please try again.', 'error');
					})
					.finally(() => {
						setLoadingRequest(false);
					});
			}
		}
	};

	const editService = (id: number) => {
		for (let i = 0; i < services.length; i++) {
			if (services[i].id === id) {
				setService(services[i]);
				break;
			}
		}
		setAddContactModal(true);
	};

	const deleteService = (id: number) => {
		setRemoveService(id);
		axiosClient
			.delete('company/settings/services/' + id)
			.then((response) => {
				for (let i = 0; i < services.length; i++) {
					if (services[i].id === id) {
						services.splice(i, 1);
						setServices([...services]);
						break;
					}
				}
			})
			.catch((error) => {
				alert('Somthing went wrong. Please try again.');
				console.error('Error:', error);
			})
			.finally(() => {
				setRemoveService(0);
			});
	};

	return (
		<div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<div>
					<div className="flex items-center justify-between flex-wrap gap-4">
						<h2 className="text-xl">Company services</h2>
						<div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
							<div className="flex gap-3">
								<div>
									{(userRole.includes('Admin') || userRole.includes('Dispatcher')) && (
										<button type="button" className="btn btn-primary" onClick={() => addservice()}>
											<IconPlus className="ltr:mr-2 rtl:ml-2" />
											Add New service
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="mt-5 panel p-0 border-0 overflow-hidden">
                  
						{/* <div className="table-responsive">
							<table className="table-striped table-hover">
								<thead>
									<tr>
										<th className="text-gray-400">Title</th>
										<th className="text-gray-400">Description</th>
										<th className="text-gray-400">Price</th>
										<th className="!text-center text-gray-400">Actions</th>
									</tr>
								</thead>
								<tbody>
									{services.map((service: any, index) => {
										return (
											<tr key={index}>
												<td>
													<div className="flex items-center w-max">

														<div className="font-bold">{service.title}</div>
													</div>
												</td>
												<td>{service.description}</td>
												<td className="whitespace-nowrap">${service.price}</td>

												<td>
													{userRole.includes('Admin') || userRole.includes('Dispatcher') ? (
														<div className="flex gap-4 items-center justify-center">
															<button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editService(service.id)}>
																Edit
															</button>
															{removeService === service.id ? (
																<SmallDangerLoader />
															) : (
																<button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteService(service.id)}>
																	Delete
																</button>
															)}
														</div>
													) : (
														<div className="text-gray-400 text-center">No action</div>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div> */}
					</div>
				</div>
			)}
			<Transition appear show={addContactModal} as={Fragment}>
				<Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<div className="fixed inset-0 bg-[black]/60" />
					</Transition.Child>
					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center px-4 py-8">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
									<button
										type="button"
										onClick={() => setAddContactModal(false)}
										className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
									>
										<IconX />
									</button>
									<div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">{service.id ? 'Edit Service' : 'Add Service'}</div>
									<div className="p-5">
										<form>
											<div className={'mb-5 ' + (emptyTitle ? 'has-error' : '')}>
												<label htmlFor="name">Title</label>
												<input
													id="title"
													name="title"
													value={service.title}
													type="text"
													placeholder="Enter Title"
													className="form-input"
													onChange={(e) => {
														onChange(e);
													}}
												/>
											</div>
											<div className={'mb-5 ' + (emptyPrice ? 'has-error' : '')}>
												<label htmlFor="email">Price</label>
												<input
													id="price"
													name="price"
													value={service.price}
													type="number"
													placeholder="Enter price"
													className="form-input"
													onChange={(e) => {
														onChange(e);
													}}
												/>
											</div>
											<div className="mb-5">
												<label htmlFor="address">Dfescription</label>
												<textarea
													name="description"
													value={service.description}
													rows={2}
													placeholder="Enter Address"
													className="form-textarea resize-none min-h-[70px]"
													onChange={(e) => {
														onChange(e);
													}}
												></textarea>
											</div>
											<div className="flex justify-end items-center mt-8">
												<button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
													Cancel
												</button>
												<button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveService}>
													{service.id ? 'Update' : 'Save'}
													{loadingRequest && (
														<div role="status">
															<ButtonLoader />
														</div>
													)}
												</button>
											</div>
										</form>
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

export default Services;
