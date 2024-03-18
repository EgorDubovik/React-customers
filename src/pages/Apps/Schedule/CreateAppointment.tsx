import {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';

const CreateAppointment = () => {
      const customer = {
         name: 'John Doe',
         phone: '+1 (754) 226-4666',
      }
      const {customerId} = useParams();

      return (
         <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
               <h2 className="text-xl">Create appointment</h2>
            </div>
            <div className='conteiner w-full md:w-1/2 m-auto'>
               <div className='panel'>
                  
               </div>
            </div>
         </div>
      );
}

export default CreateAppointment;