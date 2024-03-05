import { useEffect, useState, Fragment, useRef} from 'react'
import IconTrashLines from '../../../../components/Icon/IconTrashLines'
import IconPencil from '../../../../components/Icon/IconPencil'
import IconPlus from '../../../../components/Icon/IconPlus'
import {SmallDangerLoader} from '../../../../components/loading/SmallCirculeLoader'
import { ButtonLoader } from '../../../../components/loading/ButtonLoader'
import moment from 'moment'
import { Dialog, Transition } from '@headlessui/react'
import axiosClient from '../../../../store/axiosClient'

const ServicesBlock = (props:any) => {
   const [tax, setTax] = useState<number>(0);
   const [total, setTotal] = useState<number>(0);
   const [remaining, setRemaining] = useState<number>(0);
   const [services, setServices] = useState<any[]>(props.services || []);
   const paymmets = props.payments || [];
   const [serviceFormData, setServiceFormData] = useState<any>({});
   const [modal, setModal] = useState(false);
   const [removeServiceStatus, setRemoveServiceStatus] = useState(0);
   const [serviceFormLoading, setServiceFormLoading] = useState(false);
   const appointmentId = props.appointmentId || 0;
   const priceInputRef = useRef<HTMLInputElement>(null);
   
   const calculateTaxTotal = (services:any) => {
      let tax = 0;
      let total = 0;
      services.forEach((service:any) => {
         const price = parseFloat(service.price);
         total += price;
         if(service.taxable) tax += (price * 0.0825);
      });
      total += tax;
      return {tax, total};
   }

   const calculateRemaining = (payments:any, total:number) => {
      const totalPaid = payments.reduce((acc:any, payment:any) => {
         const amount = parseFloat(payment.amount);
         return acc + amount;
      }, 0);
      const remaining = total - totalPaid;
      return Math.round(remaining*100)/100;
   }

   useEffect(()=>{
      const {tax, total} = calculateTaxTotal(services);
      setTax(tax);
      setTotal(total);
   },[services])

   useEffect(()=>{
      const remaining = calculateRemaining(paymmets, total);
      setRemaining(remaining);
   },[paymmets, total])
   
   
   const editService = (service:any) => {
      setServiceFormData(service);
      setModal(true);
   }

   const handeCreateNewService = () => {
      setServiceFormData({
         title:'',
         description:'',
         price:'',
         taxable:true
      });
      setModal(true);
   }

   const handleChangeService = (event:any) => {
      if(event.target.name === 'price' && isNaN(event.target.value)) return;

      if(event.target.name === 'taxable')
         setServiceFormData({...serviceFormData, [event.target.name]: event.target.checked});
      else 
         setServiceFormData({...serviceFormData, [event.target.name]: event.target.value});
   }

   const handleSaveService = () => {
      setServiceFormLoading(true);
      if(serviceFormData.id){ // update
         axiosClient.put(`appointment/service/${appointmentId}/${serviceFormData.id}`, serviceFormData)
            .then((res:any) => {
               if(res.status === 200){
                  const updatedServices = services.map((service) => {
                     if(service.id === serviceFormData.id){
                        return serviceFormData;
                     }
                     return service;
                  });
                  setServices(updatedServices);
                  setModal(false);
               }
            })
            .catch((err) => {
               alert('Something went wrong. Please try again later');
               console.log(err);
            })
            .finally(() => {
               setServiceFormLoading(false);
            });
      } else { // add
         axiosClient.post(`appointment/service/${appointmentId}`, serviceFormData)
            .then((res:any) => {
               if(res.status === 200){
                  setServices([...services, res.data.service]);
                  setModal(false);
               }
            })
            .catch((err) => {
               alert('Something went wrong. Please try again later');
               console.log(err);
            })
            .finally(() => {
               setServiceFormLoading(false);
            });
      }
      
   }
   
   const handleRemoveService = (serviceId:number) => {
      setRemoveServiceStatus(serviceId);
      axiosClient.delete(`appointment/service/${appointmentId}/${serviceId}`)
         .then((res) => {
            if(res.status === 200){
               setServices(services.filter((service) => service.id !== serviceId));
            }
         })
         .catch((err) => {
            alert('Something went wrong. Please try again later');
            console.log(err);
         })
         .finally(() => {
            setRemoveServiceStatus(0);
         });
   }

   const viewCurrency = (amount:number) => {
      return amount.toLocaleString('en-US', {
         style: 'currency',
         currency: 'USD',
         minimumFractionDigits: 2
      });
   }

   return (
      <div className='panel'>
         <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg dark:text-white-light">Services</h3>
            <a href="#" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
               <IconPlus className='w-4 h-4'/>
            </a>
         </div>
         <div className="mt-5">
            <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
               <table className="whitespace-nowrap">
                  <tbody className="dark:text-white">
                     {
                        services.map((service:any, index:number) => (
                           <tr key={index}>
                              <td>{service.title}</td>
                              <td> {service.description} </td>
                              <td className="">{viewCurrency(parseFloat(service.price))}</td>
                              <td className="p-3 border-b border-[#ebedf2] dark:border-[#191e3a] text-right">
                                 <div className='text-right'>
                                    <button onClick={()=>editService(service)} type="button" className='mr-4' >
                                       <IconPencil />
                                    </button>
                                    {
                                       removeServiceStatus === service.id ? <SmallDangerLoader />
                                       :   
                                       <button onClick={()=>handleRemoveService(service.id)} type="button">
                                          <IconTrashLines />
                                       </button>
                                    }
                                 </div>
                              </td>
                           </tr>
                        ))
                     }
                  </tbody>
               </table>
            </div>
            <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
               <table className="whitespace-nowrap text-right">
                  <tbody className="dark:text-white-dark">
                     <tr>
                        <td  style={{textAlign:'right'}}>Tax</td>
                        <td width={'20%'} className='text-danger'  style={{textAlign:'right'}}>
                           {viewCurrency(tax)} 
                        </td>
                     </tr>
                     <tr>
                        <td  style={{textAlign:'right'}}>TOTAL</td>
                        <td className='text-success'  style={{textAlign:'right'}}>
                           {viewCurrency(total)} 
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
            <div className='flex justify-center mt-4'>
               <span className='flex cursor-pointer border-b dark:border-gray-800 border-gray-200 py-2' onClick={handeCreateNewService}>
                  <IconPlus className='mr-2'/>
                  Add new Service
               </span>
            </div>
            <div className='mt-4 flex justify-between items-center py-4'>
               <div className='text-sm'>
                  
                  { remaining > 0 && <span className='text-danger ml-2'>Remaining: {remaining.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 2
                           })}</span> }
                  { remaining <= 0 && services.length>0 && <span className='text-success ml-2'>Paid full</span>}
               </div>
               <button type="button" className="btn btn-outline-dark btn-sm">Issue refund</button>
            </div>
            <div className='table-responsive text-[#515365] dark:text-white-light font-semibold'>
               <table className="whitespace-nowrap">
                  <tbody className="dark:text-white-dark">
                     {
                        paymmets.map((payment:any, index:number) => (
                           <tr key={index}>
                              <td>#{payment.id}</td>
                              <td>{moment(payment.created_at).format('MMM DD YYYY h:mm A')}</td>
                              <td>{payment.payment_type}</td>
                              <td className="">${ payment.amount}</td>
                              
                           </tr>
                        ))
                     }
                  </tbody>
               </table>
            </div>
         </div>
         <Transition appear show={modal} as={Fragment}>
            <Dialog 
               as="div" 
               open={modal} 
               onClose={() => setModal(false)}
               initialFocus={serviceFormData.id ? priceInputRef : undefined}
            >
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
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
                           <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
                              <div className="flex items-center justify-between p-3 dark:text-white">
                                 <h5>Update Service</h5>
                              </div>
                              <div className="p-3">
                                    <form>
                                       <div className="relative mb-4">
                                          <input type="text" placeholder="Title" className="form-input" name='title' onChange={handleChangeService} value={serviceFormData.title} />
                                       </div>
                                       <div className="relative mb-4">
                                          <input type="text" ref={priceInputRef} placeholder='Price' className="form-input" pattern="\d*\.?\d*" name='price' onChange={handleChangeService} value={serviceFormData.price} onFocus={(e)=> e.target.select()}/>
                                       </div>
                                       <div className="relative mb-4">
                                          <textarea placeholder="Description" className="form-textarea" name='description' onChange={handleChangeService} value={serviceFormData.description}></textarea>
                                       </div>
                                       <div className="relative mb-4">
                                          <label className="inline-flex items-center text-sm">
                                             <input type="checkbox" className="form-checkbox outline-primary" name='taxable' onChange={handleChangeService} checked={serviceFormData.taxable}  />
                                             <span className=" text-white-dark">Taxable</span>
                                          </label>
                                       </div>
                                       <div className="flex justify-end items-center mt-8">
                                          <button type="button" onClick={() => setModal(false)} className="btn btn-outline-danger">
                                             Discard
                                          </button>
                                          <button type="button" onClick={handleSaveService} className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                             Save
                                             {serviceFormLoading && <ButtonLoader />}
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
   )
}

export default ServicesBlock