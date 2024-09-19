import { ButtonLoader } from "../../../components/loading/ButtonLoader";
import { alertError, alertSuccsess } from "../../../helpers/helper";
import axiosClient from "../../../store/axiosClient";
import { useState } from "react";
const CompanyInfo = (props: any) => {
	const { company, setCompany } = props;
   const [loadingStatus, setLoadingStatus] = useState(false);
	const handleChange = (field: string, value: string) => {
		setCompany((prevCompany: any) => ({
			...prevCompany,
			[field]: value,
		}));
	};

	const handleAddressChange = (field: string, value: string) => {
		setCompany((prevCompany: any) => ({
			...prevCompany,
			address: {
				...prevCompany.address,
				[field]: value,
			},
		}));
	};

   const updateCopmanyInfo = () => {
      if(loadingStatus) return;
      setLoadingStatus(true);
      axiosClient.put('/company/settings/update-info', company)
      .then((res) => {
         alertSuccsess('Company Info Updated');
      })
      .catch((err) => {
         console.log(err);
         alertError('Something went wrong, Please try again later');
      })
      .finally(() => {
         setLoadingStatus(false);
      });
   }

	return (
		<div className="panel">
			<div className="panel-header">Company Info</div>
			<div className="panel-body">
				{/* Company Name */}
				<div className="mt-4">
					<label>Company Name</label>
					<input value={company.name ?? ''} type="text" className="form-input" placeholder="Company Name" onChange={(e) => handleChange('name', e.target.value)} />
				</div>

				{/* Company Email */}
				<div className="mt-4">
					<label>Company Email</label>
					<input value={company.email ?? ''} type="text" className="form-input" placeholder="Company Email" onChange={(e) => handleChange('email', e.target.value)} />
				</div>

				{/* Company Phone */}
				<div className="mt-4">
					<label>Company Phone</label>
					<input value={company.phone ?? ''} type="text" className="form-input" placeholder="Company Phone" onChange={(e) => handleChange('phone', e.target.value)} />
				</div>

				{/* Address Line1 */}
				<div className="mt-4">
					<label>Address line 1</label>
					<input value={company.address?.line1 ?? ''} type="text" className="form-input" placeholder="Address, street" onChange={(e) => handleAddressChange('line1', e.target.value)} />
				</div>

            {/* Address Line2 */}
				<div className="mt-4">
					<label>Address line 2</label>
					<input value={company.address?.line2 ?? ''} type="text" className="form-input" placeholder="Apt, Suite" onChange={(e) => handleAddressChange('line2', e.target.value)} />
				</div>

				{/* City */}
				<div className="mt-4">
					<label>City</label>
					<input value={company.address?.city ?? ''} type="text" className="form-input" placeholder="Company City" onChange={(e) => handleAddressChange('city', e.target.value)} />
				</div>

				{/* State */}
				<div className="mt-4 flex justify-between items-center gap-4">
					<div className="">
						<label>State</label>
						<input value={company.address?.state ?? ''} type="text" className="form-input" placeholder="Company State" onChange={(e) => handleAddressChange('state', e.target.value)} />
					</div>

					{/* Zip */}
					<div className="">
						<label>Zip</label>
						<input value={company.address?.zip ?? ''} type="text" className="form-input" placeholder="Company Zip" onChange={(e) => handleAddressChange('zip', e.target.value)} />
					</div>
				</div>

				{/* Save Button */}
				<div className="mt-4">
					<button className="btn btn-primary w-full" onClick={() => updateCopmanyInfo()}>
						Update Company Info
                  {loadingStatus && <ButtonLoader />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CompanyInfo;
