import { useState} from 'react'
import moment from 'moment'
import axiosClient from '../../../store/axiosClient'
import { useAppointmentContext } from '../../../context/AppointmentContext'
import { calculateRemaining, calculateTaxTotal, viewCurrency } from '../../../helpers/helper'
import ServicesList from '../includes/ServicesList'

const ServicesBlock = (props:any) => {
   const {appointment, updateServices} = useAppointmentContext();
   const payments = appointment?.payments || [];
   const services = appointment?.services || [];

   const [modal, setModal] = useState(false);
   const [serviceFormLoading, setServiceFormLoading] = useState(false);
   const appointmentId = appointment?.id;

   const {total} = calculateTaxTotal(services);
   const remaining = calculateRemaining(payments, total);

   const handleSaveService = (service:any) => {
      console.log('service:',service);
      setServiceFormLoading(true);
      if(service.id !==''){ // update
         console.log('update service:')
         axiosClient.put(`appointment/service/${appointmentId}/${service.id}`, service)
            .then((res:any) => {
               if(res.status === 200){
                  const updatedServices = services.map((s) => {
                     if(s.id === service.id){
                        return service;
                     }
                     return s;
                  });
                  updateServices(updatedServices);
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
         axiosClient.post(`appointment/service/${appointmentId}`, service)
            .then((res:any) => {
               if(res.status === 200){
                  services.push(res.data.service);
                  updateServices(services);
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
      
      axiosClient.delete(`appointment/service/${appointmentId}/${serviceId}`)
         .then((res) => {
            if(res.status === 200){
               updateServices(services.filter((service) => service.id !== serviceId));
            }
         })
         .catch((err) => {
            alert('Something went wrong. Please try again later');
            console.log(err);
         });
   }

   return (
      <div className='panel'>
         <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg dark:text-white-light">Services</h3>
            {/* <button className="btn btn-primary p-2 rounded-full" onClick={handeCreateNewService}>
               <IconPlus className='w-4 h-4'/>
            </button> */}
         </div>
         <div className="mt-5">
            <ServicesList
               services={services}
               onRemoveService={handleRemoveService}
               onSaveService = {handleSaveService}
               onUpdateService = {handleSaveService}
               modal={modal}
               loadingStatus={serviceFormLoading}
               isEditble={true}
               setModal={setModal}
            />
            <div className='mt-4 flex justify-between items-center py-4'>
               <div className='text-sm'>
                  
                  { remaining > 0 && <span className='text-danger ml-2'>Remaining: {viewCurrency(remaining)}</span> }
                  { remaining <= 0 && services.length>0 && <span className='text-success ml-2'>Paid full</span>}
               </div>
               <button type="button" className="btn btn-outline-dark btn-sm">Issue refund</button>
            </div>
            <div className='table-responsive text-[#515365] dark:text-white-light font-semibold'>
               <table className="whitespace-nowrap">
                  <tbody className="dark:text-white-dark">
                     {
                        payments.map((payment:any, index:number) => (
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
      </div>
   )
}

export default ServicesBlock