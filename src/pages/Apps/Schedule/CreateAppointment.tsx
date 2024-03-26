import {useState, useEffect, Fragment} from 'react';
import { Link, useParams } from 'react-router-dom';
import MyTimePicker from '../../../components/plugin/mytimepicker/src';
import moment from 'moment';
import IconEdit from '../../../components/Icon/IconEdit';
import IconPlus from '../../../components/Icon/IconPlus';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Dialog, Transition } from '@headlessui/react';
import { calculateTaxTotal, viewCurrency, getTechAbr } from '../../../helpers/helper';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import ServicesList from './includes/ServicesList';
import TechList from './includes/TechList';
import { use } from 'i18next';


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
   const [services, setServices] = useState<any[]>([]);
   const [tax, setTax] = useState(0);
   const [total, setTotal] = useState(0);
   const [modalService, setModalService] = useState(false);
   const [myId, setMyId] = useState(0);
   const userId = useSelector((state:IRootState) => state.themeConfig.user.id);
   // Services...
   const onRemoveService = (id:number) => {
      setServices(services.filter((service:any) => service.id !== id));
   }
   const onSaveService = (service:any) => {
      
      service.id = services.length+1;
      setServices([...services, service]);
      setModalService(false);
   }

   useEffect(() => {
      const {tax, total} = calculateTaxTotal(services);
      setTax(tax);
      setTotal(total);
   }, [services]);


   // Load customer Info
   const {customerId} = useParams();
   const [customer, setCustomer] = useState<any>({
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
   });

   const onTimeFromChanged = (date:any) => {
      setTimeFrom(new Date(date));
      if(!timeToIsSelected) 
         setTimeTo(new Date(date.getTime() + 60*120*1000));
   }

   const onTimeToChanged = (date:any) => {
      setTimeToIsSelected(true);
      setTimeTo(new Date(date));
   }

   // Techs
   const [modalTech, setModalTech] = useState(false);
   const [techsIds, setTechsIds] = useState<Number[]>([]);
   const [techs, setTechs] = useState<any[]>([]);
   const isTechAdded = (techId:number) => {
      return techsIds.includes(techId);
   }
   const onRemoveTech = (techId:number) => {
      setTechs(techs.filter((tech:any) => tech.id !== techId));
   }
   
   const onCompanyTechsLoaded = () => {
      console.log('Company techs loaded');
      console.log('my id', myId);
      setTechsIds([myId]);
   }

   const onAddRemovetechFromList = (techId:number) => {
      if(isTechAdded(techId)){
         setTechsIds(techsIds.filter((id) => id !== techId));
      }else{
         setTechsIds([...techsIds, techId]);
      }
   
   }

   const onSaveTeachs = () => {
      setModalTech(false);
   }
   useEffect(() => {
      console.log('setMyId', userId)
      setMyId(userId);
   }, [userId]);

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
                     <ServicesList
                        services={services} 
                        onRemoveService={onRemoveService}
                        onSaveService={onSaveService}
                        modal={modalService}
                        setModal={setModalService}
                     />
                     
                  </div>

               </div>
               <div className='mt-5'>
                  <h2>Add Technical</h2>
                  <div className="mt-5">
                     <TechList
                        techs={techs}
                        techsIds={techsIds}
                        removeTech={onRemoveTech}
                        modal={modalTech}
                        setModal={setModalTech}
                        onAddRemovetechFromList={onAddRemovetechFromList}
                        onSaveTeachs={onSaveTeachs}
                        onCompanyTechsLoaded={onCompanyTechsLoaded}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default CreateAppointment;