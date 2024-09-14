import React, { useState } from 'react';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
const CompanyGeneralInfo = () => {
	const [loadingStatus, setLoadingStatus] = useState('success');
	return (
		<div>
			<div className="flex justify-start items-center text-lg">
				<h1>Book Appointments online settings</h1>
			</div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<div className="py-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
						<div className="panel">
                     <div className="panel-header">Tax Rate</div>
                     <div className="panel-body mt-2">
                        <div className='flex justify-between items-center gap-2'>
                           <input type="text" className="form-input" placeholder="Tax Rate" />
                           <button className="btn btn-primary">Save</button>
                        </div>
                     </div>
                  </div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CompanyGeneralInfo;
