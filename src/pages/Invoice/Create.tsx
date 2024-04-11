import { useEffect,useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconDownload from '../../components/Icon/IconDownload';
import IconEdit from '../../components/Icon/IconEdit';
import IconPlus from '../../components/Icon/IconPlus';
import axiosClient from '../../store/axiosClient';
import moment from 'moment';
import {ButtonLoader} from '../../components/loading/ButtonLoader';

interface Appointment {
   id: number;
   company: {
      name: string;
      logo: string;
      address: {
         full: string;
      };
      phone: string;
      email: string;
   };
   customer: {
      name: string;
      phone: string;
      email: string;
   };
   address: {
      full: string;
   };
   services: any[];
   tax: number;
   subtotal: number;
   total: number;
   due: number;
   payments: any[];

}

const Create = () => {
   const {appointmentId} = useParams();
   const dispatch = useDispatch();
   const navigator = useNavigate();
   const [appointment, setAppointment] = useState<Appointment>();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(false);
   const [sendLoading, setSendLoading] = useState(false);
   useEffect(() => {
      dispatch(setPageTitle('Invoice Preview'));
   },[]);

   useEffect(() => {
      setLoading(true);
      axiosClient.get('appointment/invoice/'+appointmentId)
      .then((res) => {
         console.log(res.data);
         
         setAppointment(res.data.appointment);
      })
      .catch((err) => {
         setError(true);
         console.log(err);
      })
      .finally(() => {
         setLoading(false);
      })

   },[]);
   const sendInvoice = () => {
      setSendLoading(true);
      axiosClient.post("appointment/"+appointmentId+"/invoice-send")
      .then((res) => {
         navigator('/invoices');
      })
      .catch((err) => {
         alert('Something went wrong');
         console.log(err);
      })
      .finally(() => {
         setSendLoading(false);
      })

      
   }
   return (
      <>
      {error && <div>
               <div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                  <span className="ltr:pr-2 rtl:pl-2">
                     <strong className="ltr:mr-1 rtl:ml-1">Woops!</strong>Something went wrong. Please try again or <a href="" onClick={()=>{window.location.reload(); }} className="underline">reload the page</a>
                  </span>
               </div>
            </div>}
      {loading && <div className='text-center mt-10'><span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span></div>}
      {!loading &&
         (<div className="conteiner w-full md:w-2/3 m-auto">
         <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
            <button type="button" className="btn btn-info gap-2" onClick={sendInvoice}>
               <IconSend />
               Send Invoice
               {
                  sendLoading && <ButtonLoader />
               }
            </button>

            <button type="button" className="btn btn-primary gap-2">
               <IconPrinter />
               Print
            </button>

            <button type="button" className="btn btn-success gap-2">
               <IconDownload />
               Download
            </button>
         </div>
         <div className='panel'>
            <div className='panel-logo flex justify-between'>
               <img src={"https://edservice.s3.us-east-2.amazonaws.com/"+appointment?.company?.logo} alt='logo' className='h-[50px]' />
               <h2 className='text-2xl font-bold'>#INV-{appointment?.id}</h2>
            </div>
            <div className='company-info pt-10 space-y-2'>
               <h3 className='font-bold text-xl'>{appointment?.company?.name}</h3>
               <p>{appointment?.company?.address.full}</p>
               <p>{appointment?.company?.phone}</p>
               <p>{appointment?.company?.email}</p>
            </div>
            <div className='invoice-to flex justify-between mt-10'>
               <div className='customer-info space-y-2'>
                  <h3 className='font-bold text-xl'>Invoice To</h3>
                  <p>{appointment?.customer?.name}</p>
                  <p>{appointment?.address?.full}</p>
                  <p>{appointment?.customer?.phone}</p>
                  <p>{appointment?.customer?.email}</p>
               </div>
               <div className='payment-due'>
                  <h3 className='font-bold text-xl'>Payment Details:</h3>
                  <p className='text-right mt-2 text-lg'>Total Due: {appointment?.due?.toLocaleString('en-US', {
                                                                                                   style: 'currency',
                                                                                                   currency: 'USD',
                                                                                                   minimumFractionDigits: 2})}
                  </p>
               </div>
            </div>
            <div className='table-responsive mt-10'>
               <table className="">
                  <thead>
                        <tr>
                           <th></th>
                           <th>ITEM</th>
                           <th className='text-right' style={{ textAlign:"right" }}>TOTAL</th>
                           
                        </tr>
                  </thead>
                  <tbody>
                     {
                        appointment?.services?.map((service:any, index:number) => (
                           <tr key={index}>
                              <td>{index+1}</td>
                              <td style={{ width:"70%" }}>
                                 <p className='dark:text-white'>{service.title}</p>
                                 <p className='dark:text-gray-600'>{service.description}</p>
                              </td>
                              <td className='text-right dark:text-white' style={{ textAlign:"right" }}>${service.price}</td>
                           </tr>
                        ))
                     }
                     <tr>
                        <td></td>
                        <td className='text-right dark:text-white' style={{ textAlign:"right" }}>TAX:</td>
                        <td className='text-right dark:text-white' style={{ textAlign:"right" }}>${appointment?.tax}</td>
                     </tr>
                     <tr>
                        <td></td>
                        <td className='text-right dark:text-white font-bold' style={{ textAlign:"right" }}>TOTAL:</td>
                        <td className='text-right dark:text-white font-bold' style={{ textAlign:"right" }}>${appointment?.total}</td>
                     </tr>
                     
                  </tbody>
               </table>
            </div>
            <div className='payment mt-10 flex justify-end'>
               <h2 className='font-bold'>Payment History:</h2>
               <div className="table-responsive mb-5 w-full md:w-1/2 ml-4">
                  <table>
                     <tbody>
                     {
                        appointment?.payments?.map((payment:any, index:number) => (
                           <tr key={index}>
                              <td>{moment(payment.created_at).format('MMM DD YYYY h:mm A')}</td>
                              <td>{payment.payment_type}</td>
                              <td className='text-right' style={{ textAlign:"right" }}>${payment.amount}</td>
                           </tr>
                        ))
                     }
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>)}
      </>
   )
}

export default Create