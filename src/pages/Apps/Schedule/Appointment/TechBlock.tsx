import React,{Fragment} from 'react'
import IconTrashLines from '../../../../components/Icon/IconTrashLines'
import IconPlus from '../../../../components/Icon/IconPlus'
import { Dialog, Transition } from '@headlessui/react'

const TechBlock = (preps:any) => {
   const  techs  = preps.techs || [];
   const [modal, setModal] = React.useState(false);
   
   
   return (
      <div className='panel p-4'>
         <h3 className="font-semibold text-lg dark:text-white-light">Technical</h3>
         <ul className='mt-2'>
            {
               techs.map((tech:any, index:number) => (
                  <li key={index} className='p-2 mb-2 flex items-center dark:bg-gray-900 bg-gray-100 rounded'>
                     <div className='mr-2'>
                        <span className={"flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-'bg-danger text-white"} style={{ backgroundColor : tech.color }}>ED</span>
                     </div>
                     <div className="flex-grow ml-4">
                        <p className="font-semibold">{tech.name}</p>
                        <p className="font-semibold">{tech.phone}</p>
                     </div>
                     <div className='mr-4'>
                        <span className="badge badge-outline-primary ml-2">Tech</span>
                        <span className="badge badge-outline-success ml-2">Admin</span>
                     </div>
                     <div className=''>
                        <button type="button">
                           <IconTrashLines />
                        </button>
                     </div>
                  </li>
               ))
            }
         </ul>
         <div className='flex justify-center mt-4'>
            <span className='flex cursor-pointer border-b dark:border-gray-800 border-gray-200 py-2' onClick={()=>setModal(true)}>
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
                                    <div className="p-5">
                                       <ul className='list-group'>
                                          <li className='p-2 mb-2 flex items-center dark:bg-gray-900 bg-gray-100 rounded cursor-pointer'>
                                             <div className='mr-2'>
                                                <span className={"flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-danger text-white"} >ED</span>
                                             </div>
                                             <div className="flex-grow ml-4 text-sm">
                                                <p className="font-semibold">Yahor Dubovik</p>
                                                <p className="font-semibold">+1 754 226-4666</p>
                                             </div>
                                             <div className='mr-4'>
                                                <span className="badge badge-outline-primary ml-2">Tech</span>
                                                <span className="badge badge-outline-success ml-2">Admin</span>
                                             </div>
                                             
                                          </li>
                                       </ul>
                                       
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