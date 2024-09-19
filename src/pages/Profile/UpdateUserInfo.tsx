import { ButtonLoader } from "../../components/loading/ButtonLoader";
import { alertError, alertSuccsess } from "../../helpers/helper";
import axiosClient from "../../store/axiosClient";
import { useEffect, useState } from "react";
const UpdateUserInfo = (props: any) => {
	const { user, setUser } = props;
   const [errors, setErrors] = useState<any>({});
   const [loadingStatus, setLoadingStatus] = useState(false);
	const handleChange = (field: string, value: string) => {
		setUser((prevUser: any) => ({
			...prevUser,
			[field]: value,
		}));
	};

   const updateUserInfo = () => {
      setErrors({});
      if(loadingStatus) return;
      setLoadingStatus(true);
      axiosClient.put('/user', user)
      .then((res) => {
         alertSuccsess('User Info Updated');
      })
      .catch((err) => {
         console.log(err);
         setErrors(err.response.data.errors);
         
      })
      .finally(() => {
         setLoadingStatus(false);
      });
   }
   useEffect(() => {
      console.log(errors);
   }, [errors]);
	return (
		<div className="panel">
			<h3 className="text-lg font-semibold">Update personal information</h3>
         {Object.keys(errors).map((field: any, index: number) => (
            <div className="flex mb-2 items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
               <span className="ltr:pr-2 rtl:pl-2">{errors[field]}</span>
            </div>  
         ))}
			<div className="mt-3">
				<div className="mt-4">
					<label>User Name</label>
					<input value={user.name ?? ''} type="text" className="form-input" placeholder="User Name" onChange={(e) => handleChange('name', e.target.value)} />
				</div>

				<div className="mt-4">
					<label>User Email</label>
					<input value={user.email ?? ''} type="text" className="form-input" placeholder="User Email" onChange={(e) => handleChange('email', e.target.value)} />
				</div>

				<div className="mt-4">
					<label>User Phone</label>
					<input value={user.phone ?? ''} type="text" className="form-input" placeholder="User Phone" onChange={(e) => handleChange('phone', e.target.value)} />
				</div>
				<div className="mt-4">
					<button className="btn btn-primary w-full" onClick={updateUserInfo}>
                  Update User Inforation
                  {loadingStatus && <ButtonLoader />}
               </button>
				</div>
			</div>
		</div>
	);
};

export default UpdateUserInfo;
