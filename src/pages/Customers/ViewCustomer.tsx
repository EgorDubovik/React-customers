import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../store/axiosClient';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconMapPin from '../../components/Icon/IconMapPin';
import IconPhone from '../../components/Icon/IconPhone';
import IconMail from '../../components/Icon/IconMail';

const ViewCustomer = () => {
	const { id } = useParams();
	const [customer, setCustomer] = useState<any>({});

	useEffect(() => {
		axiosClient
			.get(`/customers/${id}`)
			.then((res) => {
				console.log('data:', res.data);
				setCustomer(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				console.log('finally');
			});
	}, []);
	return (
		<>
			<div className="py-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					<div className="panel p-0">
						<div className="flex items-center justify-between p-4">
							<h3 className="font-semibold text-lg dark:text-white-light">Customer</h3>
							<Link to={'/customer/update/' + (customer.id ?? 0) + '?redirectTo=' + window.location.pathname} className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
								<IconPencilPaper className="w-4 h-4" />
							</Link>
						</div>
						<div className="mb-1">
							<div className="flex flex-col justify-center items-center ">
								{/* MAP */}
								<div className="w-full h-[200px] dark:bg-gray-800 bg-gray-200 flex items-center justify-center">Click to view map</div>

								<p className="font-semibold text-primary text-lg mt-4">{customer?.name}</p>
							</div>
							<div className="px-4 pb-4">
								<ul className="mt-5 flex flex-col m-auto space-y-4 font-semibold text-white-dark">
									{/* ADDRESS */}
									{customer?.address?.map((address: any, index: number) => (
										<li key={index} className="flex items-center gap-2">
											<IconMapPin className="shrink-0" />
											{address?.full}
										</li>
									))}
									<li className="flex items-center gap-2">
										<IconPhone />
										<span className="whitespace-nowrap" dir="ltr">
											{customer?.phone}
										</span>
									</li>
									<li>
										<div className="flex gap-2">
											<IconMail className="w-5 h-5 shrink-0" />
											<span className="text-primary truncate">{customer?.email}</span>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="panel p-4">
						<h3 className="font-semibold text-lg dark:text-white-light">Appointments history</h3>
						<div className="appointments-list py-4">
							<div className="flex justify-start items-center p-2 dark:bg-slate-950 rounded border-l border-blue-700">
								<div className="text-center px-4">
									<p>23</p>
									<p>JUL</p>
								</div>
								<div className="border-l border-gray-500 h-full px-4 flex justify-between w-full items-center">
									<div>
										<p className="font-bold dark:text-gray-300">Washer</p>
										<p>Replace heating eleelemt</p>
									</div>
                           <div className='text-success text-center text-[12px]'>
                              <p>$126.56</p>
                           </div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ViewCustomer;
