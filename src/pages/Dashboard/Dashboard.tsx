import { useEffect, useState } from 'react';
import axiosClient from '../../store/axiosClient';
import { viewCurrency } from '../../helpers/helper';

const Dashboard = () => {
	const [currentMonth, setCurrentMonth] = useState(0);
	const [mainState, setMainState] = useState<any>({
		currentMonth: 0,
		currentWeek: 0,
		today: 0,
		avarage: 0,
	});

	useEffect(() => {
		// Load data
		axiosClient
			.get('/dashboard')
			.then((res) => {
				console.log('data:', res.data);
            const newStat = {
               currentMonth: res.data.sumCurrentMonth,
               currentWeek: res.data.sumCurrentWeek,
               today: res.data.sumCurrentDay,
               avarage: 0,
            }
				setMainState(newStat);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div>
			<h1>Dashboard</h1>
			<div className="py-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
					{/* Total Today */}
					<div className="panel bg-gradient-to-r from-violet-500 to-violet-400 flex justify-between items-center">
						<div className="text-md font-semibold">Total for today</div>
						<div className="text-3xl font-bold"> {viewCurrency(mainState.today)} </div>
					</div>
					{/* Total for week */}
					<div className="panel bg-gradient-to-r from-blue-500 to-blue-400 flex justify-between items-center">
						<div className="text-md font-semibold">Total for current week</div>
						<div className="text-3xl font-bold"> {viewCurrency(mainState.currentWeek)} </div>
					</div>
					{/* Current month */}
					<div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400 flex justify-between items-center">
						<div className="text-md font-semibold">Total for current month</div>
						<div className="text-3xl font-bold"> {viewCurrency(mainState.currentMonth)} </div>
					</div>
					{/* Avarage per day */}
					<div className="panel bg-gradient-to-r from-fuchsia-400 to-fuchsia-300 flex justify-between items-center">
						<div className="text-md font-semibold">Avarage for month</div>
						<div className="text-3xl font-bold"> {viewCurrency(mainState.avarage)} </div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
