import {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import MyTimePicker from '../../../components/plugin/mytimepicker/src';
const CreateAppointment = () => {
      const [formData, setFormData] = useState({
         date: '',
         customerId: '',
         addressId: '',
         service: '',
         tech: '',
      });
      const customer = {
         id: 1,
         name: 'John Doe',
         phone: '+1 (754) 226-4666',
         addresses : [
            {
               id: 1,
               address: '2249 Caynor Circle, New Brunswick, New Jersey',
               city: 'New Brunswick',
               state: 'New Jersey',
               zip: '08901'
            },
            {
               id: 2,
               address: '2249 Caynor Circle, New Brunswick, New Jersey',
               city: 'New Brunswick',
               state: 'New Jersey',
               zip: '08901'
            },
            {
               id: 3,
               address: '2249 Caynor Circle, New Brunswick, New Jersey',
               city: 'New Brunswick',
               state: 'New Jersey',
               zip: '08901'
            }
         ]
      }

      const {customerId} = useParams();
      const onDateChange = (date:any) => {
         console.log(date);
      }
      useEffect(() => {
         setFormData({...formData, ["customerId"]: customer?.id.toString()});
         setFormData({...formData, ["addressId"]: customer?.addresses[0].id.toString()});
      }, []);

      return (
         <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
               <h2 className="text-xl">Create appointment</h2>
            </div>
            <div className='conteiner w-full md:w-1/2 m-auto'>
               <div className='panel'>
                  <div className="mb-5">
                     <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                        <div className="flex items-start justify-between py-3">
                           <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                              {customer.name}
                              <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">{customer.addresses[0].address}</span>
                           </h6>
                           <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                              <button className="btn btn-dark">Edit</button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className='mt-5'>
                     <MyTimePicker 
                        onDateChange={onDateChange}
                     />
                  </div>
               </div>
            </div>
         </div>
      );
}

export default CreateAppointment;