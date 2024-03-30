import React,{Fragment, useState,useEffect} from 'react'
import IconTrashLines from '../../../components/Icon/IconTrashLines'
import IconPlus from '../../../components/Icon/IconPlus'
import { Dialog, Transition } from '@headlessui/react'
import { useSelector } from 'react-redux'
import { IRootState } from '../../../store'
import axiosClient from '../../../store/axiosClient'

const TechBlock = (preps:any) => {
   
   const [techs, setTechs]  = useState(preps.techs || []);
   const [techsIds, setTechsIds] = useState<Number[]>([]);
   const [companyTechs, setCompanyTechs] = useState([]);
   const appointmentId = preps.appointmentId || 0;
   const [modal, setModal] = React.useState(false);
   const rolesTitle = useSelector((state: IRootState) => state.themeConfig.rolesTitle);
   const rolesColor = useSelector((state: IRootState) => state.themeConfig.rolesColor);
   const [removeTechStatus, setRemovingTechStatus] = React.useState(0);

   const getTechAbr = (name:string) => {
      return name.split(' ').map((n:string) => n[0]).join('');
   }

   const isTechAdded = (techId:number) => {
      return techsIds.includes(techId);
   }

   const loadCompanyTechs = () => {
      axiosClient.get(`company/techs`)
         .then((res) => {

            setCompanyTechs(res.data.techs);
         })
         .catch((err) => {
            console.log(err);
         });
   }

   const saveNewTechs = () => {
      axiosClient.post(`appointment/tech/${appointmentId}`, {techs:techsIds})
         .then((res) => {
            console.log(res);
            if(res.status === 200){
               setTechs(companyTechs.filter((tech:any) => techsIds.includes(tech.id)));
            }
         })
         .catch((err) => {
            alert('Something went wrong. Please try again later');
            console.log(err);
         })
         .finally(() => {
            setModal(false);
         });
   }

   const initTechsIds = () => {
      setTechsIds(techs.map((tech:any) => tech.id));
   }
   const addRemovetechFromList = (techId:number) => {
      if(isTechAdded(techId)){
         setTechsIds(techsIds.filter((id) => id !== techId));
      }else{
         setTechsIds([...techsIds, techId]);
      }
   
   }

   useEffect(() => {
      loadCompanyTechs();
   }, []);

   useEffect(() => {
      initTechsIds();
   }, [techs]);

   const removeTech = (techId:number) => {
      setRemovingTechStatus(techId);
      axiosClient.delete(`appointment/tech/${appointmentId}/${techId}`)
         .then((res) => {
            if(res.status === 200){
               setTechs(techs.filter((tech:any) => tech.id !== techId));
               
            }
         })
         .catch((err) => {
            alert('Something went wrong. Please try again later');
            console.log(err);
         })
         .finally(() => {
            setRemovingTechStatus(0);
         });
   }
   return (
      <div className=''>
         <h3 className="font-semibold text-lg dark:text-white-light">Technical</h3>
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
                        {
                           removeTechStatus === tech.id ? <span className='text-danger'>Removing...</span> 
                           : 
                           <button type="button" onClick={()=>removeTech(tech.id)}>
                              <IconTrashLines />
                           </button>
                        }
                        
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

         <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" open={modal} onClose={() => setModal(false)}>
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
                                             companyTechs.map((tech:any, index:number) => (
                                             <li key={index} className={'p-2 mb-2 flex items-center  '+(isTechAdded(tech.id) ? 'dark:bg-[#050b14] text-primary' : "")+' '+(isTechAdded(tech.id) ? 'bg-gray-100 text-primary' : '')+' rounded cursor-pointer'} onClick={()=>addRemovetechFromList(tech.id)}>
                                                <div className='mr-2'>
                                                   <span className={"flex justify-center items-center w-10 h-10 text-center rounded-full object-cover text-white"} style={{ backgroundColor: tech.color }} >{getTechAbr(tech.name)}</span>
                                                </div>
                                                <div className="flex-grow ml-4 text-sm">
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
                                             </li>
                                             ))
                                          }
                                       </ul>
                                       <div className='mt-10'>
                                          <button type="button" className="btn btn-primary w-full" onClick={saveNewTechs}>Save</button>
                                       </div>
                                    </div>   
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

      </div>
   )
}

export default TechBlock