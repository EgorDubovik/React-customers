import React from 'react'
import IconTrashLines from '../../../../components/Icon/IconTrashLines'
import IconPencil from '../../../../components/Icon/IconPencil'
import IconPencilPaper from '../../../../components/Icon/IconPencilPaper'
import IconPlusCircle from '../../../../components/Icon/IconPlusCircle'
import IconPlus from '../../../../components/Icon/IconPlus'
const ServicesBlock = (props:any) => {
   const services = props.services || [];
   return (
      <div className='panel'>
         <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg dark:text-white-light">Services</h3>
            <a href="#" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
               <IconPlus className='w-4 h-4'/>
            </a>
         </div>
         <div className="mt-5">
            <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
               <table className="whitespace-nowrap">
                  <tbody className="dark:text-white">
                     {
                        services.map((service:any, index:number) => (
                           <tr key={index}>
                              <td>{service.title}</td>
                              <td> {service.description} </td>
                              <td className="">${ service.price}</td>
                              <td className="p-3 border-b border-[#ebedf2] dark:border-[#191e3a] text-right">
                                 <div className='text-right'>
                                    <button type="button">
                                       <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                    </button>
                                    <button type="button" className='ml-4'>
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
                        <td width={'20%'} className='text-danger'  style={{textAlign:'right'}}>$5.00 </td>
                     </tr>
                     <tr>
                        <td  style={{textAlign:'right'}}>TOTAL</td>
                        <td className='text-success'  style={{textAlign:'right'}}>$5.00 </td>
                     </tr>
                  </tbody>
               </table>
            </div>
            <div className='flex justify-center mt-4'>
               <span className='flex cursor-pointer border-b dark:border-gray-800 border-gray-200 py-2'>
                  <IconPlus className='mr-2'/>
                  Add new Service
               </span>
            </div>
         </div>
      </div>
   )
}

export default ServicesBlock