import {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import MyTimePicker from '../../../components/plugin/mytimepicker/src';
import moment from 'moment';
import IconEdit from '../../../components/Icon/IconEdit';
import IconPlus from '../../../components/Icon/IconPlus';
import IconTrashLines from '../../../components/Icon/IconTrashLines';


const viewCurrency = (amount:number) => {
   return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
   });
}


const CreateAppointment = () => {
   const getCurrentDate = () => {
      const date = new Date();
      if(date.getMinutes() > 45 && date.getMinutes() <= 59){
         date.setHours(date.getHours() + 1);
         date.setMinutes(0);
         date.setSeconds(0);
      }
      return date;
   }
   const [timeFrom, setTimeFrom] = useState(getCurrentDate());
   const [timeTo, setTimeTo] = useState(new Date(new Date().getTime() + 60*120*1000));
   const [selectedTime, setSelectedTime] = useState('timeFrom');
   const [timeToIsSelected, setTimeToIsSelected] = useState(false);
   const [services, setServices] = useState([]);
   const [tax, setTax] = useState(0);
   const [total, setTotal] = useState(0);
   const [formData, setFormData] = useState({
      dateFrom: timeFrom,
      dateTo: timeTo,
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
   const onTimeFromChanged = (date:any) => {
      setTimeFrom(new Date(date));
      if(!timeToIsSelected) 
         setTimeTo(new Date(date.getTime() + 60*120*1000));
   }

   const onTimeToChanged = (date:any) => {
      setTimeToIsSelected(true);
      setTimeTo(new Date(date));
   }

   useEffect(() => {
      
      setFormData({...formData, ["customerId"]: customer?.id.toString()});
      setFormData({...formData, ["addressId"]: customer?.addresses[0].id.toString()});
      
   }, []);

   const handeCreateNewService = () => {

   }

   const handleRemoveService = (service:any) => {
      setServices(services.filter((service:any) => service !== service));
   }

   return (
      <div>
         <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl">Create appointment</h2>
         </div>
         <div className='conteiner w-full md:w-1/3 m-auto'>
            <div className='panel'>
               <div className="mb-5">
                  <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                     <div className="flex items-center justify-between py-3">
                        <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                           {customer.name}
                           <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">{customer.addresses[0].address}</span>
                        </h6>
                        <div className="h-full p-2 cursor-pointer rounded hover:dark:bg-white-dark/10 hover:bg-gray-100">
                           <IconEdit />
                        </div>
                     </div>
                  </div>
               </div>
               <div className='mt-5'>
                  <div className='mb-5 flex justify-center bg-gray-100 dark:bg-white-dark/10 rounded p-2'>
                     <div onClick={()=>setSelectedTime('timeFrom')} className={'w-1/2 timeFrom flex justify-center items-center cursor-pointer py-3 rounded '+((selectedTime === 'timeFrom') ? "dark:bg-black/25 dark:text-white font-bold bg-gray-200" : "")}>
                        <div>From:</div>
                        <div className='ml-10 text-center'>
                           <div>{moment(timeFrom).format('MMM DD')}</div>
                           <div>{moment(timeFrom).format('hh:mm A')}</div>
                        </div>
                     </div>
                     <div onClick={()=>setSelectedTime('timeTo')} className={'w-1/2 timeFrom flex justify-center items-center cursor-pointer py-3 rounded '+((selectedTime === 'timeTo') ? "dark:bg-black/25 dark:text-white font-bold bg-gray-200" : "")}>
                        <div>To:</div>
                        <div className='ml-10 text-center'>
                           <div>{moment(timeTo).format('MMM DD')}</div>
                           <div>{moment(timeTo).format('hh:mm A')}</div>   
                        </div>
                     </div>
                  </div>
                  { selectedTime === "timeFrom" &&
                     <MyTimePicker 
                        currentDate = {timeFrom}
                        onDateChange={onTimeFromChanged}
                     />
                  }
                  { selectedTime === "timeTo" &&
                     <MyTimePicker 
                        currentDate = {timeTo}
                        onDateChange={onTimeToChanged}
                     />
                  }
                  
               </div>
               <div className='mt-5'>
                  <h2>Add services</h2>

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
                                             <button onClick={()=>handleRemoveService(service.id)} type="button">
                                                <IconTrashLines />
                                             </button>
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
                     
                  </div>

               </div>
            </div>
         </div>
      </div>
   );
}

export default CreateAppointment;