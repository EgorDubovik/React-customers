const CompanyInfo = (props:any) => {
   const { companySettings, setCompanySettings } = props;
	return <div className="panel">
      <div className="panel-header">Company info</div>
      <div className="panel-body">
         <div className="mt-4">
            <label>Company Name</label>
            <input value={companySettings.name} type="text" className="form-input" placeholder="Company Name" onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })} />
         </div>
         <div className="mt-4">
            <label>Company Email</label>
            <input value={companySettings.email} type="text" className="form-input" placeholder="Company Email" onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })} />
         </div>
         <div className="mt-4">
            <label>Company Phone</label>
            <input value={companySettings.phone} type="text" className="form-input" placeholder="Company Phone" onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })} />
         </div>
         <div className="mt-4">
            <label>Address</label>
            <input value={companySettings.address} type="text" className="form-input" placeholder="Company Address" onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })} />
         </div>
         <div className="mt-4">
            <label>City</label>
            <input value={companySettings.city} type="text" className="form-input" placeholder="Company City" onChange={(e) => setCompanySettings({ ...companySettings, city: e.target.value })} />
         </div>
         <div className="mt-4 flex justify-between items-center gap-4">
            <div className="">
               <label>State</label>
               <input value={companySettings.state} type="text" className="form-input" placeholder="Company State" onChange={(e) => setCompanySettings({ ...companySettings, state: e.target.value })} />
            </div>
            <div className="">
               <label>Zip</label>
               <input value={companySettings.zip} type="text" className="form-input" placeholder="Company Zip" onChange={(e) => setCompanySettings({ ...companySettings, zip: e.target.value })} />
            </div>
         </div>
         <div className="mt-4">
            <button className="btn btn-primary w-full" onClick={() => console.log('save')}>Update Company Info</button>
         </div>
      </div>
   </div>;
};

export default CompanyInfo;
