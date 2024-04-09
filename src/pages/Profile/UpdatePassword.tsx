import { useState } from 'react';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import axiosClient from '../../store/axiosClient';
const UpdatePassword = () => {
	const [updateStatus, setUpdateStatus] = useState('loading');
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [passwordForm, setPasswordForm] = useState({
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handlePasswordFormChange = (e: any) => {
		setPasswordForm({
			...passwordForm,
			[e.target.name]: e.target.value,
		});
	};

	const updatePassword = (e: any) => {
		e.preventDefault();
		setUpdateStatus('loading');
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setUpdateStatus('error');
			setErrorMessage('New and Confirm passwords do not match');
			return;
		}
		if (passwordForm.newPassword.length < 4 || passwordForm.oldPassword.length < 4) {
			setUpdateStatus('error');
			setErrorMessage('Password must be at least 4 characters');
			return;
		}

		if (loading) return;
		setLoading(true);
      setUpdateStatus('loading');
		axiosClient
			.post('/user/update-password', passwordForm)
			.then((res) => {
				console.log(res.data);
            setUpdateStatus('success');
            setErrorMessage(res.data.message);
				setLoading(false);
            setPasswordForm({
               oldPassword: '',
               newPassword: '',
               confirmPassword: '',
            });
			})
			.catch((err) => {
				console.log(err);
            setUpdateStatus('error');
            setErrorMessage(err.response.data.message);
				setLoading(false);
			});
	};

	return (
		<div className="panel">
			<p className="text-base text-center">Update password</p>
			{updateStatus === 'error' && <div className="flex my-2 items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">{errorMessage}</div>}
         {updateStatus === 'success' && <div className="flex my-2 items-center p-3.5 rounded text-success bg-success-light dark:bg-success-dark-light">{errorMessage}</div>}
			<form className="space-y-5" onSubmit={updatePassword}>
				<div>
					<label htmlFor="groupFname">Enter old password</label>
					<input id="groupFname" type="password" placeholder="Old Password" className="form-input" name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordFormChange} />
				</div>
				<div>
					<label htmlFor="groupLname">Enter new password</label>
					<input id="groupLname" type="password" placeholder="New password" className="form-input" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordFormChange} />
				</div>
				<div>
					<label htmlFor="groupsecond">Confirm new password</label>
					<input id="groupsecond" type="password" placeholder="Confirm password" className="form-input" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordFormChange} />
				</div>
				<button type="submit" className="btn btn-primary !mt-6">
					Submit
					{loading && <ButtonLoader />}
				</button>
			</form>
		</div>
	);
};

export default UpdatePassword;
