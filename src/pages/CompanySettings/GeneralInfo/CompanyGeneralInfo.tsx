import React, { useEffect, useState } from 'react';
import { PageCirclePrimaryLoader } from '../../../components/loading/PageLoading';
import { PageLoadError } from '../../../components/loading/Errors';
import axiosClient from '../../../store/axiosClient';
import TaxRate from './TaxRate';
const CompanyGeneralInfo = () => {
	const [loadingStatus, setLoadingStatus] = useState('loading');
   const [companySettings, setCompanySettings] = useState<any>({});
   useEffect(() => {
      setLoadingStatus('loading');
      axiosClient.get('/company/settings')
      .then((res) => {
         setCompanySettings(res.data.companySettings);
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
					<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
						<TaxRate companySettings={companySettings} setCompanySettings={setCompanySettings} />
					</div>
				</div>
			)}
		</div>
	);
};

export default CompanyGeneralInfo;
