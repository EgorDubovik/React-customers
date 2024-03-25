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


   // Services...
   const [modal, setModal] = useState(false);
   const [serviceForm, setServiceForm] = useState({
      id : 0,
      title: '',
      description: '',
      price: '',
      taxable: true,
   });
   // const serviceFormChangeHandler = (e:any) => {
   //    if(e.target.name === 'price' && isNaN(e.target.value)) return;
   //    if(e.target.name === 'taxable')
   //       setServiceForm({...serviceForm, [e.target.name]: e.target.checked});
   //    else 
   //       setServiceForm({...serviceForm, [e.target.name]: e.target.value});
   // }
   // const handleSaveService = () => {
   //    setServiceForm({...serviceForm, id: services.length+1});
   //    setServices([...services, serviceForm]);
   //    setModal(false);
   // }

   const onRemoveService = (id:number) => {
      setServices(services.filter((service:any) => service.id !== id));
   }
   const onSaveService = (service:any) => {
      console.log(service);
      service.id = services.length+1;
      setServices([...services, service]);
      // setModal(false);  
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

   useEffect(() => {
            
   }, []);

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
   const [techs, setTechs] = useState<any[]>([]);
   const rolesTitle = useSelector((state: IRootState) => state.themeConfig.rolesTitle);
   const rolesColor = useSelector((state: IRootState) => state.themeConfig.rolesColor);
   
   const removeTech = (techId:number) => {
      setTechs(techs.filter((tech:any) => tech.id !== techId));
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
                     <ServicesList
                        services={services} 
                        onRemoveService={onRemoveService}
                        onSaveService={onSaveService}
                     />
                     {/* <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
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
                        <span className='flex cursor-pointer border-b dark:border-gray-800 border-gray-200 py-2' onClick={()=>setModal(true)}>
                           <IconPlus className='mr-2'/>
                           Add new Service
                        </span>
                     </div> */}
                     
                  </div>

               </div>
               <div className='mt-5'>
                  <h2>Add Technical</h2>
                  <div className="mt-5">
                     <ul className='mt-2'>
                        {
                           techs.map((tech:any, index:number) => (
                              <li key={index} className='p-2 mb-2 flex items-center dark:bg-gray-900 bg-gray-100 rounded'>
                                 <div className='mr-2'>
                                    <span className={"flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-'bg-danger text-white"} style={{ backgroundColor : tech.color }}>{getTechAbr(tech.name)}</span>
                                 </div>
                                 <div className="flex-grow ml-4">
                                    <p className="font-semibold">{tech.name}</p>
                                    <p className="font-semibold">{tech.phone}</p>
                                 </div>
                                 <div className='mr-4'>
                                    {
                                       tech.roles.map((role:any, roleIndex:number) => (
                                          <span key={roleIndex} className={`badge badge-outline-${rolesColor[role.role]} ml-2`}>{rolesTitle[role.role]}</span>
                                       ))
                                    }
                                 </div>
                                 <div className=''>
                                    <button type="button" onClick={()=>removeTech(tech.id)}>
                                       <IconTrashLines />
                                    </button>
                                 </div>
                              </li>
                           ))
                        }
                     </ul>
                     <div className='flex justify-center mt-4'>
                        <span className={'flex cursor-pointer border-b dark:border-gray-800 border-gray-200 py-2'} onClick={()=>setModal(true)}>
                           <IconPlus className='mr-2'/>
                           Add Tech
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {/* <Transition appear show={modal} as={Fragment}>
            <Dialog 
                  as="div" 
                  open={modal} 
                  onClose={() => setModal(false)}
               
               >
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
                        <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
                           <div className="flex items-center justify-between p-3 dark:text-white">
                              <h5>Update Service</h5>
                           </div>
                           <div className="p-3">
                                 <form>
                                    <div className="relative mb-4">
                                       <input type="text" placeholder="Title" className="form-input" name='title' onChange={serviceFormChangeHandler} value={serviceForm.title} />
                                    </div>
                                    <div className="relative mb-4">
                                       <input type="text" placeholder='Price' className="form-input" pattern="\d*\.?\d*" name='price' onChange={serviceFormChangeHandler} value={serviceForm.price} />
                                    </div>
                                    <div className="relative mb-4">
                                       <textarea placeholder="Description" className="form-textarea" name='description' onChange={serviceFormChangeHandler} value={serviceForm.description}></textarea>
                                    </div>
                                    <div className="relative mb-4">
                                       <label className="inline-flex items-center text-sm">
                                          <input type="checkbox" className="form-checkbox outline-primary" name='taxable' onChange={serviceFormChangeHandler} checked={serviceForm.taxable}  />
                                          <span className=" text-white-dark">Taxable</span>
                                       </label>
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                       <button type="button" onClick={() => setModal(false)} className="btn btn-outline-danger">
                                          Discard
                                       </button>
                                       <button type="button" onClick={handleSaveService} className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                          Save
                                       </button>
                                    </div>
                                 </form>
                           </div>
                        </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition> */}
      </div>
   );
}

export default CreateAppointment;