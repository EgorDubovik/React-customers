import { ButtonLoader } from '../../../components/loading/ButtonLoader';
import axiosClient from '../../../store/axiosClient';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { alertError, alertSuccsess } from '../../../helpers/helper';
const TaxRate = (props: any) => {
	const { companySettings, setCompanySettings } = props;
	const [loadingStatus, setLoadingStatus] = useState(false);
	const changeTaxRate = (e: any) => {
		if (isNaN(e.target.value)) {
			return;
		}
		setCompanySettings({ ...companySettings, taxRate: e.target.value });
	};
	const saveTaxRate = () => {
		if (loadingStatus) return;
		setLoadingStatus(true);
		axiosClient
			.put('/company/settings', { taxRate: companySettings.taxRate })
			.then((res) => {
				alertSuccsess('Tax Rate Updated');
				console.log(res);
			})
			.catch((err) => {
				alertError('Something went wrong, Please try again later');
				console.log(err);
			})
			.finally(() => {
				setLoadingStatus(false);
			});
	};
	return (
		<div className="panel">
			<div className="panel-header">Tax Rate</div>
			<div className="panel-body mt-2">
				<div className="flex justify-between items-center gap-2">
					<input value={companySettings.taxRate} type="text" className="form-input" placeholder="Tax Rate" onChange={changeTaxRate} />
					<span>%</span>
					<button className="btn btn-primary" onClick={saveTaxRate}>
						Save {loadingStatus && <ButtonLoader />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default TaxRate;
