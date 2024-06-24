import React, {useContext} from 'react';
import { CustomerContext } from './CustomerContext';
import { CustomerContextType, ServiceType } from './@types';
const Information =() => {
   const {services, selectedDateTime, customer, selectedServices,  sliderIndex, setSliderIndex} = useContext(CustomerContext) as CustomerContextType;

   const viewCheck = (index:number) => {
      if(sliderIndex > index)  
         return (
            <svg className="w-4 h-4 me-2 text-blue-600 dark:text-blue-500 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
         )
      else 
         return (
            <svg aria-hidden="true" className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-blue-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            </svg>
         )
   }

   const changeSlider = (index:number) => {
      setSliderIndex(index);
   }

   return (
      <div className='p-2 hidden sm:block' >
         <h2 className='font-bold text-left'>Information</h2>
         <div className='text-left'>
            <div className='py-2'>
               <div className='text-gray-600 font-bold mt-4  text-left p-2 text-sm flex items-center'>
                  {viewCheck(1)}
                  Selected service: 
                  {sliderIndex > 1 &&
                     <span onClick={()=>{changeSlider(1)}} className='text-blue-600 cursor-pointer underline ml-3'>Edit</span>
                  }
               </div>
               { selectedServices.length > 0 &&
                  <div className='bg-gray-100 rounded p-2 ml-0 sm:ml-8'>
                  {selectedServices.map((service_id,index) => {
                     var service = services.find(s => s.id === service_id) as ServiceType;
                     return (
                        <div key={index} className='border-b p-2 text-left flex justify-between text-sm text-gray-600'>
                           <span className=''>{service.title}</span>
                           <span>${service.price}</span>
                        </div>
                     )
                  })}
                  </div>
               }  
               <div className='text-gray-600 mt-6 font-bold  text-left p-2 text-sm flex items-center'>

                  {viewCheck(2)}
               
                  Selected day and time:
                  {sliderIndex > 2 &&
                     <span onClick={()=>{changeSlider(2)}} className='text-blue-600 cursor-pointer underline ml-3'>Edit</span>
                  }
               </div>
               {selectedDateTime &&
                  <div className='py-2 px-4 ml-2 text-sm text-gray-600 bg-gray-100 rounded sm:ml-8'>
                     {selectedDateTime.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}<br/>
                     {selectedDateTime.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})}
                  </div>
               }           
               
               <div className='text-gray-600 mt-6 font-bold  text-left p-2 text-sm flex items-center'>
                  {viewCheck(3)}
                  Your information:
               </div>
               {customer.name &&
                  <div className='px-2 py-4 ml-2 text-sm bg-gray-100 rounded text-gray-500 sm:ml-8'>
                     <div className='mt-2'>{customer.name}</div>
                     <div className='mt-2'>{customer.email ?? ','} {customer.phone}</div>
                     <div className='mt-2'>{customer.address1} {customer.address2} {customer.city} {customer.state} {customer.zip}</div>
                  </div>
               }        
            </div>
         </div>
      </div>
   );
}

export default Information;