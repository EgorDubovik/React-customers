import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import env from '../../store/env';
import { CompanyInfoType } from './@types';
import Header from './Header';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { SinglePageErrorLoading, SinglePageLoading } from '../../components/loading/Loadings';
const AppointmentCanceled = () => {
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(setPageTitle('Appointment Canceled'));
   });
   const {paramKey} = useParams();

   const [loadingStatus, setLoadingStatus] = useState('loading');
   const [companyInfo, setCompanyInfo] = useState<CompanyInfoType>({
      name: '',
      phone: '',
      logo: '',
   });

   const navigate = useNavigate();

   useEffect(() => {
     
     fetch(env.API_URL+'/appointment/book/'+paramKey)
       .then(response => response.json())
       .then(data => {
         setCompanyInfo(data.company);   
         setLoadingStatus('success');
       }).catch((error) => {
         console.error('Error:', error);
         setLoadingStatus('error');
       })
     
   }, []);

   const openBookAppointment = () => {
      window.location.href = '/appointment/book/'+paramKey;
   }
   return (
      <div className="App h-full">
      {loadingStatus === 'loading' && <SinglePageLoading />}
      {loadingStatus === 'error' && <SinglePageErrorLoading />}
      {loadingStatus === 'success' &&
        ( <div className='text-center'>
            <Header { ...companyInfo}/>
            <div className='w-full px-4 m-auto md:w-3/5 max-w-6xl mt-5'>
               <div className='text-center mt-10 text-red-500'>Your appointment has been cancelled</div>
               <div className='mt-10'>
                  <button onClick={openBookAppointment} className="mx-auto bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" style={{ display: 'block', margin: '0 auto' }}>
                     Create new appointment
                  </button>
               </div>
               <div className='mt-6 text-gray-500 pt-4 border-t border-gray-300'>Or call to <b><a href={`tel:${companyInfo.phone}`}>{companyInfo.phone}</a></b> for any questions</div>
            </div>
            
          </div>
        )
      }
    </div>
   );
}

export default AppointmentCanceled;
