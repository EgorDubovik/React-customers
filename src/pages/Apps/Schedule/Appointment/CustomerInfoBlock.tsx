import { useState } from 'react';
import { Link } from 'react-router-dom';
import IconPencilPaper from '../../../../components/Icon/IconPencilPaper';
import IconMapPin from '../../../../components/Icon/IconMapPin';
import IconPhone from '../../../../components/Icon/IconPhone';
import IconMail from '../../../../components/Icon/IconMail';
const CustomerInfoBlock = (props:any) => {

   const [customer, setCustomer] = useState(props.customer || {});   
   const [address, setAddress] = useState(props.address || {});
   return (
      <div className="panel p-0">
         <div className="flex items-center justify-between p-4">
               <h3 className="font-semibold text-lg dark:text-white-light">Customer</h3>
               <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                  <IconPencilPaper className='w-4 h-4'/>
               </Link>
         </div>
         <div className="mb-1">
            <div className="flex flex-col justify-center items-center ">
               <div className='w-full h-[200px] rounded text-center dark:bg-gray-800 bg-gray-200'>
                  MAP
               </div>
               
               <p className="font-semibold text-primary text-lg mt-4">
                  <Link to={'/customer/'+customer?.id} className="hover:underline">
                     {customer?.name}
                  </Link>
               </p>

            </div>
            <div className='px-4 pb-4'>
               <ul className="mt-5 flex flex-col m-auto space-y-4 font-semibold text-white-dark">
                  <li className="flex items-center gap-2">
                     <IconMapPin className="shrink-0" />
                     {address?.full}
                  </li>
                  <li className="flex items-center gap-2">
                     <IconPhone />
                     <span className="whitespace-nowrap" dir="ltr">
                        {customer?.phone}
                     </span>
                  </li>
                  <li>
                     <button className="flex gap-2">
                        <IconMail className="w-5 h-5 shrink-0" />
                        <span className="text-primary truncate">{ customer?.email }</span>
                        
                     </button>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default CustomerInfoBlock;