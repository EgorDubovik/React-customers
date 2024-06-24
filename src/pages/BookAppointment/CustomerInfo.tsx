import React, { useState, useContext } from 'react';
import { CustomerContext } from './CustomerContext';
import { useNavigate } from 'react-router-dom';
import env from '../../store/env';
import { CustomerContextType, CustomerInfoType } from './@types';

const CustomerInfo = () => {

   const {key, selectedServices, updateCustomer, setSliderIndex,selectedDateTime} = useContext(CustomerContext) as CustomerContextType;
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const [customerInfo, setCustomerInfo] = useState<CustomerInfoType>({
      name: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
   });

   const onChange = (e:any) => {
      setCustomerInfo({...customerInfo, [e.target.name]: e.target.value});
   }

   const sendInfo = () => {
      
      if(customerInfo.name === '' || customerInfo.email === '' || customerInfo.phone === '' || customerInfo.address1 === '' || customerInfo.city === '' || customerInfo.state === '' || customerInfo.zip === ''){
         alert('Please fill in all fields');
         return;
      }
      updateCustomer(customerInfo);
      setLoading(true);
      setSliderIndex(4);
      if(selectedDateTime === undefined || selectedDateTime === null){
         alert('Please select a date and time');
         return;
      }
      
      fetch(env.API_URL+'/appointment/book/'+key, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            customer: {
               name: customerInfo.name,
               email: customerInfo.email,
               phone: customerInfo.phone,
               address1: customerInfo.address1,
               address2: customerInfo.address2,
               city: customerInfo.city,
               state: customerInfo.state,
               zip: customerInfo.zip
            },
            services: selectedServices,
            selectedDateTime: selectedDateTime?.getFullYear()+'-'+(selectedDateTime?.getMonth() + 1)+'-'+selectedDateTime?.getDate()+' '+selectedDateTime?.getHours()+':'+((selectedDateTime?.getMinutes() || 0 <= 9 ? '0' : '' )+selectedDateTime?.getMinutes())+':00',
         }),
      })
         .then(response => response.json())
         .then(data => {
            let providerKey = data.providerKey;
            navigate('/appointment/book/view/'+providerKey);
      }).catch((error) => {
         console.error('Error:', error);
      }).finally(() => {
         setLoading(false);
      });
   }

   return (
      <div className="col-span-2 text-left p-2 relative items-center block">
         {loading && <div className="absolute inset-0 z-10"></div>}
         <div className={loading ? 'blur-sm' : ""}>
            <h2 className='font-bold'>Enter your information</h2>
            <div className='pt-4'>
               <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 p-3 px-6 bg-white rounded'>
                  <div className='col-span-2'>
                     <div className="relative h-11 w-full ">
                        <input name="name" value={customerInfo.name} onChange={onChange} placeholder="" className="peer h-full w-full border-b border-gray-400 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                           className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                           You name
                        </label>
                     </div>
                  </div>
                  <div className=''>
                     <div className="relative h-11 w-full ">
                        <input name="email" onChange={onChange} placeholder="" className="peer h-full w-full border-b border-gray-400 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                           className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                           Email
                        </label>
                     </div>
                  </div>
                  <div className=''>
                     <div className="relative h-11 w-full ">
                        <input name="phone" onChange={onChange} placeholder="" className="peer h-full w-full border-b border-gray-400 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                           className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                           Phone number
                        </label>
                     </div>
                  </div>
                  <div className=''>
                     <div className="relative h-11 w-full ">
                        <input name="address1" onChange={onChange} placeholder="" className="peer h-full w-full border-b border-gray-400 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                           className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                           Address line 1
                        </label>
                     </div>
                  </div>
                  <div className=''>
                     <div className="relative h-11 w-full ">
                        <input name="address2" onChange={onChange} placeholder="" className="peer h-full w-full border-b border-gray-400 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                           className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                           Address line 2
                        </label>
                     </div>
                  </div>
                  <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-10">
                     <div className="relative h-11 w-full ">
                        <input name="city" onChange={onChange} placeholder="" className="peer h-full w-full border-b border-gray-400 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                           className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                           City
                        </label>
                     </div>
                     <div className="relative h-11 w-full ">
                        <input name="state" onChange={onChange} placeholder="" className="peer h-full w-full border-b border-gray-400 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                           className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                           State
                        </label>
                     </div>
                     <div className="relative h-11 w-full ">
                        <input name="zip" onChange={onChange} placeholder="" className="peer h-full w-full border-b border-gray-400 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100" />
                        <label
                           className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                           Zip code
                        </label>
                     </div>
                  </div>
                  <div className='col-span-2 pt-3 text-right'>
                     <button onClick={()=>{sendInfo()}} type="button" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-md text-sm px-3 py-1.5 me-2 mb-2">Create appointment</button>
                  </div>
               </div>
            </div>
         </div>
         { loading &&
            <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-20">
               <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-blue-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
               <span className="sr-only">Loading...</span>
            </div>
         }
      </div>
   )
}

export default CustomerInfo