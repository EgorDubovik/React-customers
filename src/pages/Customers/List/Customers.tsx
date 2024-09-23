import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUserPlus from '../../../components/Icon/IconUserPlus';
import IconListCheck from '../../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../../components/Icon/IconLayoutGrid';
import IconSearch from '../../../components/Icon/IconSearch';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import moment from 'moment';
import IconMapPin from '../../../components/Icon/IconMapPin';
import { SmallPrimaryLoader } from '../../../components/loading/SmallCirculeLoader';
import { PageCirclePrimaryLoader } from '../../../components/loading/PageLoading';
import { PageLoadError } from '../../../components/loading/Errors';
import Dropdown from '../../../components/Dropdown';
import IconPencilPaper from '../../../components/Icon/IconPencilPaper';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import IconEye from '../../../components/Icon/IconEye';
import { useCustomersList } from './useCustomersList';
import { formatDate } from '../../../helpers/helper';

const Contacts = () => {
	const dispatch = useDispatch();
	const navigator = useNavigate();
	useEffect(() => {
		dispatch(setPageTitle('Customers'));
	});

	const { viewType, changeViewType, search, searchHandler, searchLoading, loadingStatus, records, totalRecords, page, setPage, pageSize, setPageSize, sortStatus, setSortStatus, PAGE_SIZES } = useCustomersList();

	return (
		<div>
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h2 className="text-xl">Customers</h2>
				<div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
					<div className="flex gap-3">
						<div>
							<button type="button" className="btn btn-primary" onClick={() => navigator('/customers/create')}>
								<IconUserPlus className="ltr:mr-2 rtl:ml-2" />
								Add Customer
							</button>
						</div>
						<div>
							<button type="button" className={`btn btn-outline-primary p-2 ${viewType === 'list' && 'bg-primary text-white'}`} onClick={() => changeViewType('list')}>
								<IconListCheck />
							</button>
						</div>
						<div>
							<button type="button" className={`btn btn-outline-primary p-2 ${viewType === 'grid' && 'bg-primary text-white'}`} onClick={() => changeViewType('grid')}>
								<IconLayoutGrid />
							</button>
						</div>
					</div>
					<div className="relative">
						<input type="text" placeholder="Search Contacts" className="form-input py-2 pr-11 peer" value={search} onChange={(e) => searchHandler(e)} />
						<button type="button" className="absolute right-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
							{searchLoading ? <SmallPrimaryLoader /> : <IconSearch className="mx-auto" />}
						</button>
					</div>
				</div>
			</div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<>
					{records.length === 0 ? (
						<div className="mt-4">
							<div className="flex items-center justify-center">
								<div className="text-center">
									<h2 className="text-xl">No Customers Found</h2>
									<Link to={"/customers/create"} className="text-primary">Create new customer or search again</Link>
								</div>
							</div>
						</div>
					) : (
						<>
							{viewType === 'list' && (
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
													accessor: 'Customer Name',
													sortable: true,
													render: ({ name, id }) => (
														<div className="flex items-center font-semibold">
															<Link to={`/customer/${id}`} className="text-primary underline hover:no-underline">
																{name}
															</Link>
														</div>
													),
												},
												{
													accessor: 'phone',
													sortable: true,
													render: ({ phone }) => <div className="font-semibold">{phone}</div>,
												},
												{
													accessor: 'address',
													sortable: false,
													render: ({ address }) => <div className="font-semibold">{address[0].full}</div>,
												},
												{
													accessor: 'email',
													sortable: true,
													render: ({ email }) => <div className="font-semibold">{email}</div>,
												},
												{
													accessor: 'date',
													sortable: true,
													render: ({ created_at }) => <div className="font-semibold">{ formatDate(created_at,'MMMM DD YYYY, hh:mm A') }</div>,
												},

												{
													accessor: 'action',
													title: 'Actions',
													sortable: false,
													textAlignment: 'center',
													render: ({ id }) => (
														<div className="flex gap-4 items-center w-max mx-auto">
															<button type="button" className="btn btn-sm btn-outline-warning" onClick={() => navigator('/customer/update/' + id)}>
																Edit
															</button>
															<button type="button" className="btn btn-sm btn-outline-info" onClick={() => navigator('/customer/' + id)}>
																View
															</button>
														</div>
													),
												},
											]}
											highlightOnHover
											totalRecords={totalRecords}
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

							{viewType === 'grid' && (
								<>
									<div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
										{records.map((customer: any) => {
											return (
												<div className="bg-white dark:bg-[#1a294166] rounded-md shadow" key={customer.id}>
													<div className="p-3">
														<div className="flex items-center justify-between relative">
															<div className="absolute top-0 right-0 z-10">
																<div className="dropdown">
																	<Dropdown offset={[0, 5]} btnClassName="align-middle" button={<IconHorizontalDots className="rotate-90 opacity-70" />}>
																		<ul className="whitespace-nowrap">
																			<li>
																				<button type="button" onClick={() => navigator('/customer/update/' + customer.id)}>
																					<IconPencilPaper className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
																					Edit
																				</button>
																			</li>
																			<li>
																				<button type="button" onClick={() => navigator('/customer/' + customer.id)}>
																					<IconEye className="w-4.5 h-4.5 mr-2 shrink-0" />
																					View
																				</button>
																			</li>
																		</ul>
																	</Dropdown>
																</div>
															</div>
															<div className="user-info w-full">
																<Link to={`/customer/${customer.id}`} className="text-primary">
																	<div className="user-name w-3/4 font-bold dark:text-white">{customer.name}</div>
																</Link>
																<div className="">{customer.phone}</div>
															</div>
														</div>
														<div className="user-address mt-3 ml-1 flex overflow-hidden">
															<IconMapPin />
															<div className="ml-2">{customer.address[0].full}</div>
														</div>
													</div>
												</div>
											);
										})}
									</div>
									
								</>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Contacts;
