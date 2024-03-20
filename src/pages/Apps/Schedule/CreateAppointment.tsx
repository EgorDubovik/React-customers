import {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import MyTimePicker from '../../../components/plugin/mytimepicker/src';
import moment from 'moment';
import { time } from 'console';

const CreateAppointment = () => {
   const getCurrentDate = () => {
      const date = new Date();
      if(date.getMinutes() > 45 && date.getMinutes() <= 59)
         date.setHours(date.getHours() + 1);{
         date.setMinutes(0);
         date.setSeconds(0);
      }
      return date;
   }
   const [timeFrom, setTimeFrom] = useState(getCurrentDate());
   const [timeTo, setTimeTo] = useState(new Date(new Date().getTime() + 60*120*1000));
   const [selectedTime, setSelectedTime] = useState('timeFrom');
   const [timeToIsSelected, setTimeToIsSelected] = useState(false);
   const [timePicker, setTimePicker] = useState(timeFrom);
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
   const onDateChange = (date:any) => {
      if(selectedTime === 'timeFrom') {
         setTimeFrom(new Date(date));
         if(!timeToIsSelected) {
            setTimeTo(new Date(date.getTime() + 60*120*1000));
         }
      } else {
         setTimeToIsSelected(true);
         setTimeTo(new Date(date));
      }
   }

   useEffect(() => {
      if(selectedTime === 'timeFrom')
         setTimePicker(timeFrom);
      else
         setTimePicker(timeTo);
   }, [selectedTime]);

   useEffect(() => {
      console.log(timeTo);
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
                  <div className='mb-5 flex justify-center dark:bg-white-dark/10 rounded p-2'>
                     <div onClick={()=>setSelectedTime('timeFrom')} className={'w-1/2 timeFrom flex justify-center items-center cursor-pointer py-3 rounded '+((selectedTime === 'timeFrom') ? "dark:bg-black/25 dark:text-white font-bold" : "")}>
                        <div>From:</div>
                        <div className='ml-10 text-center'>
                           <div>{moment(timeFrom).format('MMM DD')}</div>
                           <div>{moment(timeFrom).format('hh:mm A')}</div>
                        </div>
                     </div>
                     <div onClick={()=>setSelectedTime('timeTo')} className={'w-1/2 timeFrom flex justify-center items-center cursor-pointer py-3 rounded '+((selectedTime === 'timeTo') ? "dark:bg-black/25 dark:text-white font-bold" : "")}>
                        <div>To:</div>
                        <div className='ml-10 text-center'>
                           <div>{moment(timeTo).format('MMM DD')}</div>
                           <div>{moment(timeTo).format('hh:mm A')}</div>   
                        </div>
                     </div>
                  </div>
                  <MyTimePicker 
                     currentDate = {timePicker}
                     onDateChange={onDateChange}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

export default CreateAppointment;