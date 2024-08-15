import React, { useState } from 'react';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
const GeneralInfo = () => {
   const [loadingStatus, setLoadingStatus] = useState('success');
    return (
      <div>
         {loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
         {loadingStatus === 'error' && <PageLoadError />}
         {loadingStatus === 'success' && (
            <div className="grid grid-flow-row gap-4">
               <div className='flex justify-start items-center text-lg'>
                  <h1>General Info</h1>

               </div>
            </div>
         )}
      </div>
    );
}

export default GeneralInfo;