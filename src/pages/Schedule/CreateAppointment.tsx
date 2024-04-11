import {useState, useEffect, Fragment} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MyTimePicker from '../../components/plugin/mytimepicker/src';
import moment from 'moment';
import IconEdit from '../../components/Icon/IconEdit';
import { Dialog, Transition } from '@headlessui/react';
import { manualIsoString } from '../../helpers/helper';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import ServicesList from './includes/ServicesList';
import TechList from './includes/TechList';
import axiosClient from '../../store/axiosClient';
import {ButtonLoader} from '../../components/loading/ButtonLoader';

const CreateAppointment = () => {

   const navigate = useNavigate();

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
   const [modalService, setModalService] = useState(false);
   const [modalAddresses, setModalAddresses] = useState(false);
   const [openAddresses, setOpenAddresses] = useState(false);
   const [loadingCreate, setLoadingCreate] = useState(false);
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
   
   const {customerId} = useParams();
   const [customer, setCustomer] = useState<any>({
      id: 0,
      name: 'Unknown',
      phone: '+1 123 456 7890',
      idAddress : 0,
      addresses : []
   });
   // Load customer Info
   useEffect(() => {
      axiosClient.get(`customers/${customerId}`)
         .then((res) => {
            // console.log(res.data);
            setCustomer({
               id: res.data.id,
               name: res.data.name,
               phone: res.data.phone,
               addresses: res.data.address,
               idAddress: 0
            });
         })
         .catch((err) => {
            console.log(err);
         })
         .finally(() => {
            
         });
   }, []);

   const onTimeFromChanged = (date:any) => {
      console.log('time from:',date);
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

   const isTechAdded = (techId:number) => {
      return techsIds.includes(techId);
   }
   const onRemoveTech = (techId:number) => {
      setTechsIds(techsIds.filter((id:any) => id !== techId));
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
      setTechsIds([userId]);
   }, [userId]);


   const setNewAddress = (addressIndex:number) => {
      setCustomer({...customer,['idAddress']:addressIndex});
      setOpenAddresses(false);
   }

   const createNewAppointment = () => {
      if(loadingCreate) return;
      axiosClient.post('appointment', {
         timeFrom: manualIsoString(timeFrom),
         timeTo: manualIsoString(timeTo),
         services: services,
         techs: techsIds,
         customerId: customerId,
         addressId: customer.addresses[customer.idAddress].id || 0
      }).then((res) => {
            if(res.status === 200){
               navigate('/appointment/'+res.data.appointment.id);
            }
         })
         .catch((err) => {
            console.log(err);
            alert('Error, please try again')
         })
         .finally(() => {

         });
   }

   return (
      <div>
         <div className="flex items-center justify-center flex-wrap gap-4 my-4 md:my-0 md:justify-start">
            <h2 className="text-xl">Create appointment</h2>
         </div>
         <div className='conteiner w-full md:w-1/3 m-auto'>
            <div className='panel'>
               <div className="mb-5 relative">
                  <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b] bg-gray-800 px-2 rounded-t">
                     <div className="flex items-center justify-between py-3">
                        <h6 className="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                           {customer.name}
                           <span className="block text-white-dark dark:text-white-light font-normal text-xs mt-1">{customer.addresses[customer.idAddress]?.full}</span>
                        </h6>
                        <div className="h-full p-2 cursor-pointer rounded hover:dark:bg-white-dark/10 hover:bg-gray-100" onClick={()=>setOpenAddresses(!openAddresses)}>
                           <IconEdit />
                        </div>
                     </div>
                  </div>
                  <div className={'absolute '+(!openAddresses ? "hidden" : "" )+' left-0 right-0 top-17 bg-gray-800 py-4 rounded-b z-50'} >
                     { customer.addresses.map((address:any, index:number) => (
                        <div key={index} className='address-list p-4 hover:bg-gray-900 cursor-pointer' onClick={()=>setNewAddress(index)}>
                           {address.full}
                        </div>
                     )) }
                     
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
                        techsIds={techsIds}
                        onRemoveTech={onRemoveTech}
                        modal={modalTech}
                        setModal={setModalTech}
                        onAddRemovetechFromList={onAddRemovetechFromList}
                        onSaveTeachs={onSaveTeachs}
                     />
                  </div>
               </div>
               <div className='mt-8'>
                  <button onClick={createNewAppointment} className='btn btn-primary w-full'>
                     {loadingCreate 
                        ? <div>Loading...<ButtonLoader/></div>
                        : 'Create appointment'
                     }
                  </button>
               </div>
            </div>
         </div>
         <Transition appear show={modalAddresses} as={Fragment}>
            <Dialog as="div" open={modalAddresses} onClose={() => setModalAddresses(false)}>
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
                           <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                              <div className="p-4">
                                 <ul className='list-group'>
                                    {
                                       customer.addresses.map((address:any, index:number) => (
                                       <li key={index} className={'px-2 py-4  mb-2 flex items-center  '+(customer.idAddress === index ? 'dark:bg-[#050b14] text-primary' : "hover:dark:bg-white-dark/10")+' '+(customer.idAddress === index ? 'bg-gray-100 text-primary' : 'hover:bg-gray-200')+' rounded cursor-pointer'} onClick={()=>{setCustomer({...customer,['idAddress']:index}); setModalAddresses(false)}}>
                                          
                                          <div className="flex-grow ml-4 text-sm">
                                             <p className="font-semibold">{address.full}</p>                                             
                                          </div>
                                       </li>
                                       ))
                                    }
                                 </ul>
                              </div>   
                           </Dialog.Panel>
                        </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </div>
   );
}

export default CreateAppointment;