import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IconStar from '../../components/Icon/IconStar';
import axiosClient from '../../store/axiosClient';
import { SinglePageErrorLoading, SinglePageLoading } from '../../components/loading/Loadings';
import { formatDate, viewCurrency } from '../../helpers/helper';
import IconDownload from '../../components/Icon/IconDownload';

export default function ReviewFeedback(props: any) {
	const { paramKey } = useParams();
	const [mouseOverat, setMouseOverAt] = useState(0);
	const [rating, setRating] = useState(0);
	const [invoice, setInvoice] = useState<any>(null);
	const [loading, setLoading] = useState('loading');
   const [feedback, setFeedback] = useState('');
   const [storeStatus, setStoreStatus] = useState(false);
   const [customerReview, setCustomerReview] = useState<any>(null);

	useEffect(() => {
		setLoading('loading');
		axiosClient
			.get('/review-feedback/' + paramKey)
			.then((response) => {
				console.log(response.data.invoice);
				setInvoice(response.data.invoice);
            setCustomerReview(response.data.invoice.review);
				setLoading('success');
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoading('error');
			});
	}, []);

   const storeReview = () => {
      if(storeStatus) return;
      setStoreStatus(true);
      axiosClient
         .post('/review-feedback/' + paramKey, {
            rating: rating,
            feedback: feedback,
         })
         .then((response) => {
            console.log(response.data.review);
            setCustomerReview(response.data.review);
            setFeedback('');
            setRating(0);
         })
         .catch((error) => {
            console.error('Error:', error);
         })
         .finally(() => {
            setStoreStatus(false);
         });
   }
   
	return (
		<div>
			{loading === 'loading' && <SinglePageLoading />}
			{loading === 'error' && <SinglePageErrorLoading />}
			{loading === 'success' && (
				<>
					{/* Header */}
					<div className="bg-gray-100 py-2 flex items-center justify-between border-b-2 border-gray-300">
						<div className="pl-4 flex items-center">
							<img src={invoice.company.logo ?? 'defoultLogo'} alt="logo" className="h-10" />
							<span className="ml-2">{invoice.company.phone ?? ''}</span>
						</div>

						<div className="pr-4">
							<span className="text-right text-gray-500">View appointment info</span>
						</div>
					</div>

					{/* END Header */}

					{/* Main */}
					<div className="w-full sm:w-3/4 m-auto">
						<div className="w-full p-2 md:w-1/2  m-auto grid grid-cols-1 md:grid-cols-2 text-sm">
							<div>
								<div className="header pb-4 mt-10">
									<h2 className="font-bold">
										<span className="text-lg">Customer Info</span>
									</h2>
								</div>
								<div className="flex flex-col gap-2">
                           <div>{invoice.customer_name}</div>
                           <div>{invoice.email}</div>
                           <div>{invoice.appointment.customer.phone}</div>
                           <address>{invoice.address}</address>
								</div>
							</div>
							<div className='text-right'>
								<div className="header pb-4 mt-10">
									<h2 className="font-bold">
										<span className="text-lg">Company Info</span>
									</h2>
								</div>
								<div className="flex flex-col gap-2">
                           <div>{invoice.company.name}</div>
                           <div>{invoice.company.email}</div>
                           <div>{invoice.company.phone}</div>
                           
								</div>
							</div>
						</div>
						<div className="w-full md:w-2/4 m-auto mt-6 text-sm p-2">
							<p>
								<span className="font-bold">Services</span>
							</p>
							<div className="mt-2">
								{invoice.appointment.services.map((service: any, index: number) => (
									<div key={index} className="flex justify-between border-b border-gray-300 py-2">
										<div className="w-1/2">
											<p>{service.title}</p>
											<p className="text-gray-500">{service.description}</p>
										</div>
										<div className="w-1/2 text-right">
											<p>{viewCurrency(service.price)}</p>
										</div>
									</div>
								))}
								<div className="total">
									<div className="flex justify-end border-b border-gray-300 py-2">
										<div className="w-3/4 text-right">
											<p>Tax:</p>
										</div>
										<div className="w-1/4 text-right">
											<p>{viewCurrency(invoice.appointment.tax)}</p>
										</div>
									</div>
									<div className="flex justify-end border-b border-gray-300 py-2">
										<div className="w-3/4 text-right">
											<p>Total:</p>
										</div>
										<div className="w-1/4 text-right">
											<p>{viewCurrency(invoice.appointment.total)}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full md:w-2/4 m-auto grid grid-cols-2 mt-4 text-sm p-2">
							<div>
								<a
									target="_blank"
									href={invoice.pdf_path}
									className="bg-blue-500 w-40 flex hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									type="button"
								>
									<IconDownload className="w-4" />
									<span className="ml-2">Download PDF</span>
								</a>
							</div>
							<div className="">
								<span className="text-gray-500">Payments</span>
								{invoice.appointment.payments.map((payment: any, index: number) => (
									<div key={index} className="flex justify-between border-b border-gray-300 py-2">
										<div className="w-2/4">{formatDate(payment.created_at, 'MMMM DD YYYY')}</div>
										<div className="w-1/4">
											<p>{payment.payment_type}</p>
										</div>
										<div className="w-1/4 text-right">
											<p>{viewCurrency(payment.amount)}</p>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="header border-b border-gray-300 p-2 pb-4 mt-10">
							<h2 className="font-bold">
								<div className="flex items-center justify-center">
									<span className="text-xl">Review Feedback</span>
								</div>
							</h2>
						</div>
						<div className="p-4">
							<div className="w-full md:w-3/4 m-auto">
								<div className="w-full md:w-1/2 m-auto">
                           {!customerReview ? (
                              <>
                              <div className="mb-4">
                                 <p>Tel us how was your experience?</p>
                              </div>
                              <div className="mb-4">
                                 <div className="flex text-[16px]">
                                    <label className="block text-gray-700 text-sm font-bold mb-2 mr-2">Rating:</label>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                       <span
                                          key={i}
                                          onMouseOver={() => {
                                             setMouseOverAt(i);
                                          }}
                                          onMouseOut={() => {
                                             setMouseOverAt(0);
                                          }}
                                          onClick={() => {
                                             setRating(i);
                                          }}
                                          className="cursor-pointer px-1"
                                       >
                                          <IconStar className={`text-warning ${mouseOverat >= i || rating >= i ? 'fill-warning' : ''}`} />
                                       </span>
                                    ))}
                                 </div>
                              </div>
                              <div className="w-full">
                                 <label className="block text-gray-700 text-sm font-bold mb-2">Review:</label>
                                 <textarea onChange={(e:any)=>{setFeedback(e.target.value)}} className="shadow appearance-none border rounded w-full h-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                              </div>
                              <div className="w-full mt-4">
                                 <button onClick={storeReview} className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                    {storeStatus ? 'Sending...' : 'Submit'}
                                 </button>
                              </div>
                              </>
                           ):(
                              <>
                                 <div className=''> Thank you for your feedback!</div>
                                    
                                 <div className="mb-4 mt-4">
                                    <div className="flex text-[16px] gap-2">
                                       <label className="block text-gray-700 text-sm font-bold mb-2 mr-2">Rating:</label>
                                       {[1, 2, 3, 4, 5].map((i) => (
                                          <span >
                                             <IconStar className={`text-warning ${customerReview.rating>=i ? 'fill-warning' : ''}`} />
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                                 <div className=''>
                                    <p className='pl-3 text-gray-500'>{customerReview.feedback}</p>
                                 </div>
                              </>
                           )}
								</div>
							</div>
						</div>
					</div>
					{/* END Main */}
				</>
			)}
		</div>
	);
}
