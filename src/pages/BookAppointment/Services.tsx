import React, {useContext} from 'react';
import { CustomerContext } from './CustomerContext';
import { CustomerContextType } from './@types';
const Services = () => {

   const {services, selectedServices, updateSelectedServices, setSliderIndex} = useContext(CustomerContext) as CustomerContextType;
   const onselected = (id:number) => {
      updateSelectedServices(id);
   }

   const nextPage = () => {
      setSliderIndex(2);
   };
   
   return (
      <div className="col-span-2 text-left p-2" >
         <h2 className='font-bold'>Select service</h2>
         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4'>
            
            {services.map((service,index) => {

               return (<div key={index} className='bg-white border border-gray-400 rounded text-sm cursor-pointer' onClick={()=>{onselected(service.id)}} >
                  <div className={"p-2 rounded-t rounded-tr flex justify-between border-gray-400 border-b "+(selectedServices.includes(service.id) ? 'bg-blue-500 text-white' : 'bg-white text-gray-600')}>
                     <div className='font-bold'>
                        {service.title}
                     </div>
                     <div className={'selected '+(selectedServices.includes(service.id) ? 'visible' : 'invisible')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                     </div>
                  </div>
                  <div className='text-gray-500 p-2 text-center pt-4'>{service.description}</div>
                  <div className='text-blue-600 p-2 text-center text-md'>${service.price}</div>
               </div>);
            })}

         </div>
         <div className='pt-10 text-right'>
            { selectedServices.length > 0 
               ? 
               <button onClick={nextPage} type="button" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-md text-sm px-3 py-1.5 me-2 mb-2">continue</button>
               :
               <button type="button" className="text-white bg-blue-300 font-medium rounded-md text-sm px-3 py-1.5 me-2 mb-2" disabled>Continue</button>
            }
         </div>
      </div>
   );
};

export default Services;
