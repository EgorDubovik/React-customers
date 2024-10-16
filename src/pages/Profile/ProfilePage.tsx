import { useEffect, useState } from 'react';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
import { Link } from 'react-router-dom';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import axiosClient from '../../store/axiosClient';
import { getTechAbr } from '../../helpers/helper';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import UpdatePassword from './UpdatePassword';
import UpdateUserInfo from './UpdateUserInfo';

const ProfilePage = () => {
	const [loadingStatus, setLoadingStatus] = useState('loading');
	const [user, setUser] = useState<any>({});
	const rolesTitle = useSelector((state: IRootState) => state.themeConfig.rolesTitle);
	const rolesColor = useSelector((state: IRootState) => state.themeConfig.rolesColor);

	useEffect(() => {
		// Load user information
		setLoadingStatus('loading');
		axiosClient
			.get('/user')
			.then((res) => {
				console.log('data:', res.data);
				setLoadingStatus('success');
				setUser(res.data.user);
			})
			.catch((err) => {
				setLoadingStatus('error');
				console.log(err);
			});
	}, []);

	return (
		<div>
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h2 className="text-lg">Profile information</h2>
			</div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-4">
						<div className="grid grid-rows-none gap-3">
							<div className="panel">
								<div className="flex items-center justify-center">
									<div
										className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-2xl text-gray-300"
										style={{ backgroundColor: user.color ?? '#ccc' }}
									>
										{getTechAbr(user.name)}
									</div>
									<div className="ml-5">
										<h5 className="font-semibold text-lg dark:text-white">{user.name}</h5>
										<p>{user.phone}</p>
										<p>{user.email}</p>
									</div>
								</div>
								<div className="mt-5 flex flex-wrap items-center justify-center gap-3">
									{user.roles.map((role: any, index: number) => (
										<span key={index} className={'badge badge-outline-' + (rolesColor[role.role] ?? 'primary')}>
											{rolesTitle[role.role] ?? 'unknown'}
										</span>
									))}
								</div>
							</div>
							<UpdatePassword />
						</div>
						<div className='grid grid-rows-none gap-3'>
							<UpdateUserInfo user={user} setUser={setUser}/>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default ProfilePage;
