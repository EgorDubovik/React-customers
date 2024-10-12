import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconMapPin from '../../components/Icon/IconMapPin';
import IconPhone from '../../components/Icon/IconPhone';
import IconMail from '../../components/Icon/IconMail';
import IconSend from '../../components/Icon/IconSend';
import { useAppointmentContext } from './context/AppointmentContext';
import IconCopy from '../../components/Icon/IconCopy';
import { alertError, alertSuccsess, formatDate } from '../../helpers/helper';

const CustomerInfoBlock = (props: any) => {
	const navigate = useNavigate();
	const { appointment } = useAppointmentContext();

	const copyPhone = (phone:string) => {
		navigator.clipboard.writeText(phone)
      .then(() => {
        alertSuccsess('Phone number copied to clipboard');
      })
      .catch((err) => {
        alertError('Failed to copy phone number');
      });
	}

	return (
		<div className="panel p-0 pb-4">
			<div className="flex items-center justify-between p-4">
				<h3 className="font-semibold text-lg dark:text-white-light">Customer</h3>
				<Link to={'/customer/update/' + (appointment?.customer?.id ?? 0) + '?redirectTo=' + window.location.pathname} className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
					<IconPencilPaper className="w-4 h-4" />
				</Link>
			</div>
			<div className="mb-1">
				<div className="flex flex-col justify-center items-center ">
					<div className="w-full h-[200px] rounded text-center dark:bg-gray-800 bg-gray-200">MAP</div>

					<p className="font-semibold text-primary text-lg mt-4">
						<Link to={'/customer/' + appointment?.customer?.id} className="hover:underline">
							{appointment?.customer?.name}
						</Link>
					</p>
				</div>
				<div className="px-4 pb-4">
					<ul className="mt-5 flex flex-col m-auto space-y-4 font-semibold text-white-dark">
						<li className="flex items-center gap-2">
							<IconMapPin className="shrink-0" />
							<a href={`https://www.google.com/maps?q=${encodeURIComponent(appointment?.address)}`} target="_blank" rel="noopener noreferrer">
								{appointment?.address}
							</a>
						</li>
						<li className='flex justify-between'>
							<div className='flex gap-2'>
								<IconPhone />
								<span className="whitespace-nowrap" dir="ltr">
									<a href={`tel:${appointment?.customer.phone}`}>{appointment?.customer?.phone}</a>
								</span>
							</div>
							<button onClick={()=>copyPhone(appointment?.customer.phone || "")}>
								<IconCopy className='text-primary cursor-pointer' />
							</button>

						</li>
						<li>
							<button className="flex justify-between w-full" onClick={() => navigate('/invoice/send/' + appointment?.id)}>
								<div className="flex gap-2">
									<IconMail className="w-5 h-5 shrink-0" />
									<span className="text-primary truncate">{appointment?.customer?.email}</span>
								</div>
								{appointment?.customer?.email && (
								<div className="flex gap-2 text-primary">
									<IconSend className="w-5 h-5 shrink-0" />
									Send Invoice
								</div>
								)}
							</button>
						</li>
						<div className="mt-2">
							<div className='text-right'>Invoices ({ appointment?.job?.invoices.length || 0 })</div>
							<div className='flex justify-end mt-2'>
								{appointment?.job?.invoices.map((invoice: any) => (
									<Link to={'/invoice/' + invoice.id} className='text-primary underline' key={invoice.id}>Invoice #{invoice.id} at {formatDate(invoice.created_at,'MMM DD YYYY')}</Link>
								))}
							</div>	
						</div>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default CustomerInfoBlock;
