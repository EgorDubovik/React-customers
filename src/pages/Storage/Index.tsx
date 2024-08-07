import React, { useState, useEffect, Fragment } from 'react';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconSearch from '../../components/Icon/IconSearch';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
import { SmallPrimaryLoader } from '../../components/loading/SmallCirculeLoader';
import { Link } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { formatDate } from '../../helpers/helper';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import axiosClient from '../../store/axiosClient';

interface IRecords {
	id: number;
	title: string;
	quantity: number;
	lastUpdated: string;
	expectedQuantity: number;
}
const Storage = () => {
	const [loadingStatus, setLoadingStatus] = useState('loading');
	const [records, setRecords] = useState<IRecords[]>([]);
	const PAGE_SIZES = [2, 20, 30, 50, 100];
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
		columnAccessor: 'firstName',
		direction: 'asc',
	});
	const [loadingDataForm, setLoadingDataForm] = useState(false);
	const [search, setSearch] = useState('');
	const [searchLoading, setSearchLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [initialRecords, setInitialRecords] = useState<IRecords[]>([]);
	const [dataForm, setDataForm] = useState({
		id: 0,
		title: '',
		quantity: 0,
		expectedQuantity: 0,
	});
	const sliceData = (data: IRecords[]) => {
		const from = (page - 1) * pageSize;
		const to = from + pageSize;
		return data.slice(from, to);
	};

	useEffect(() => {
		setPage(1);
	}, [pageSize]);

	useEffect(() => {
		const data2 = sliceData(sortBy(initialRecords, sortStatus.columnAccessor));

		setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
	}, [sortStatus, initialRecords]);

	useEffect(() => {
		setRecords(sliceData(initialRecords));
	}, [page, pageSize]);

	useEffect(() => {
		setLoadingStatus('success');
		setInitialRecords([
			{
				id: 1,
				title: 'title 1',
				quantity: 10,
				lastUpdated: '2021-10-10',
				expectedQuantity: 10,
			},
			{
				id: 2,
				title: 'title 2',
				quantity: 20,
				lastUpdated: '2021-10-10',
				expectedQuantity: 20,
			},
			{
				id: 3,
				title: 'title 3',
				quantity: 30,
				lastUpdated: '2021-10-10',
				expectedQuantity: 30,
			},
			{
				id: 4,
				title: 'title 4',
				quantity: 40,
				lastUpdated: '2021-10-10',
				expectedQuantity: 40,
			},
			{
				id: 5,
				title: 'title 5',
				quantity: 50,
				lastUpdated: '2021-10-10',
				expectedQuantity: 50,
			},
		]);

		// setLoadingStatus('loading');
		// axiosClient
		// 	.get('/customers?page=' + page + '&limit=' + pageSize)
		// 	.then((res: any) => {
		// 		console.log('data:', res.data);
		// 		setInitialRecords(res.data.data);
		// 		setTotalRecords(res.data.total);
		// 		setLoadingStatus('success');
		// 	})
		// 	.catch((err) => {
		// 		setLoadingStatus('error');
		// 		console.log(err);
		// 	});
	}, []);



	const searchHandler = (e: any) => {};
	const storeItem = () => {
		axiosClient.post('/storage', dataForm)
			.then((res) => {
				if (res.status === 200)
					setModal(false);
				setInitialRecords([...initialRecords, res.data.storageItem]);

			})
			.catch((err) => {
				console.log(err);
			});
	};
	const changeValue = (e: any) => {
		setDataForm({ ...dataForm, [e.target.name]: e.target.value });
	};
	return (
		<div>
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h2 className="text-xl">Storage</h2>
				<div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
					<div className="flex gap-3">
						<div>
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => {
									setModal(true);
								}}
							>
								<IconUserPlus className="ltr:mr-2 rtl:ml-2" />
								Add Item
							</button>
						</div>
					</div>
					<div className="relative">
						<input type="text" placeholder="Search Item" className="form-input py-2 pr-11 peer" value={search} onChange={(e) => searchHandler(e)} />
						<button type="button" className="absolute right-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
							{searchLoading ? <SmallPrimaryLoader /> : <IconSearch className="mx-auto" />}
						</button>
					</div>
				</div>
			</div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && (
				<div className="mt-4">
					<PageLoadError />
				</div>
			)}
			{loadingStatus === 'success' && (
				<>
					{records.length === 0 ? (
						<div className="mt-4">
							<div className="flex items-center justify-center">
								<div className="text-center">
									<h2 className="text-xl">No Customers Found</h2>
									<Link to={'/customers/create'} className="text-primary">
										Create new customer or search again
									</Link>
								</div>
							</div>
						</div>
					) : (
						<div className="mt-5 panel p-0 border-0 overflow-hidden">
							<div className="datatables pagination-padding">
								<DataTable
									className="whitespace-nowrap table-hover invoice-table pb-4"
									records={records}
									columns={[
										{
											accessor: 'ID',
											sortable: true,
											render: ({ id }) => <span>{id}</span>,
										},
										{
											accessor: 'title',
											sortable: true,
											render: ({ title }) => <span>{title}</span>,
										},
										{
											accessor: 'quantity',
											sortable: true,
											render: ({ quantity }) => <span>{quantity}</span>,
										},
										{
											accessor: 'expectedQuantity',
											sortable: true,
											render: ({ expectedQuantity }) => <span>{expectedQuantity}</span>,
										},
										{
											accessor: 'lastUpdated',
											sortable: true,
											render: ({ lastUpdated }) => <span>{formatDate(new Date(lastUpdated), 'MMMM DD, YYYY')}</span>,
										},
										{
											accessor: 'action',
											title: 'Actions',
											sortable: false,
											textAlignment: 'center',
											render: ({ id }) => (
												<div className="flex gap-4 items-center w-max mx-auto">
													<button type="button" className="btn btn-sm btn-outline-warning" onClick={() => {}}>
														Edit
													</button>
													<button type="button" className="btn btn-sm btn-outline-danger" onClick={() => {}}>
														Delete
													</button>
												</div>
											),
										},
									]}
									highlightOnHover
									totalRecords={initialRecords.length}
									recordsPerPage={pageSize}
									page={page}
									onPageChange={(p) => setPage(p)}
									recordsPerPageOptions={PAGE_SIZES}
									onRecordsPerPageChange={setPageSize}
									sortStatus={sortStatus}
									onSortStatusChange={setSortStatus}
									paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
								/>
							</div>
						</div>
					)}
				</>
			)}
			<Transition appear show={modal} as={Fragment}>
				<Dialog as="div" open={modal} onClose={() => setModal(false)} className="relative z-[51]">
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
										onClick={() => setModal(false)}
										className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
									>
										<IconX />
									</button>
									<div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">{dataForm.id ? 'Edit Contact' : 'Add Contact'}</div>
									<div className="p-5">
										<form>
											<div className="mb-5">
												<label htmlFor="name">Title</label>
												<input id="title" type="text" name="title" placeholder="Enter Name" className="form-input" value={dataForm.title} onChange={(e) => changeValue(e)} />
											</div>
											<div className='flex gap-4'>
												<div className="mb-5 w-1/2">
													<label htmlFor="email">Quantity</label>
													<input id="quantity" type="number" name="quantity" placeholder="Enter Email" className="form-input" value={dataForm.quantity} onChange={(e) => changeValue(e)} />
												</div>
												<div className="mb-5 w-1/2">
													<label htmlFor="number">Expected Quantity</label>
													<input
														id="expectedQuantity"
														type="number"
														name="expectedQuantity"
														placeholder="Enter Phone Number"
														className="form-input"
														value={dataForm.expectedQuantity}
														onChange={(e) => changeValue(e)}
													/>
												</div>
											</div>
											<div className="flex justify-end items-center mt-8">
												<button type="button" className="btn btn-outline-danger" onClick={() => setModal(false)}>
													Cancel
												</button>
												<button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={storeItem}>
													{dataForm.id ? 'Update' : 'Add'}
													{loadingDataForm && <ButtonLoader />}
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

export default Storage;
