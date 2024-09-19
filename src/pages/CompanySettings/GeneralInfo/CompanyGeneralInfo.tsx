import React, { useEffect, useState } from 'react';
import { PageCirclePrimaryLoader } from '../../../components/loading/PageLoading';
import { PageLoadError } from '../../../components/loading/Errors';
import axiosClient from '../../../store/axiosClient';
import TaxRate from './TaxRate';
import CompanyLogo from './CompanyLogo';
import CompanyInfo from './CompanyInfo';
const CompanyGeneralInfo = () => {
	const [loadingStatus, setLoadingStatus] = useState('loading');
   const [companySettings, setCompanySettings] = useState<any>({});
   const [company, setCompany] = useState<any>({});
   useEffect(() => {
      setLoadingStatus('loading');
      axiosClient.get('/company/settings')
      .then((res) => {
         console.log(res.data);
         setCompanySettings(res.data.companySettings);
         setCompany(res.data.company);
         setLoadingStatus('success');
      })
      .catch((err) => {
         console.log(err);
         setLoadingStatus('error');
      })
   }, []);
   
	return (
		<div>
			<div className="flex justify-start items-center text-lg">
				<h1>Company General Settings</h1>
			</div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<div className="py-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className='grid grid-rows-none gap-3'>
                     <CompanyLogo companySettings={companySettings} setCompanySettings={setCompanySettings}/>
                  </div>
                  <div className='grid grid-rows-none gap-3'>
						   <TaxRate companySettings={companySettings} setCompanySettings={setCompanySettings} />
                     <CompanyInfo company={company} setCompany={setCompany}/>
                  </div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CompanyGeneralInfo;
