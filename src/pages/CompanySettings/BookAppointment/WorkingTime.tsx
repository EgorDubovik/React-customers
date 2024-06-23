import { useState, useEffect } from 'react';
import axiosClient from '../../../store/axiosClient';
import {ButtonLoader} from '../../../components/loading/ButtonLoader';
interface DayTime {
	from: number;
	to: number;
}

interface WorkingTime {
	monday: DayTime;
	tuesday: DayTime;
	wednesday: DayTime;
	thursday: DayTime;
	friday: DayTime;
	saturday: DayTime;
	sunday: DayTime;
}
const WorkingTime = (prop:any) => {
	const days: Array<{ value: keyof WorkingTime; label: string }> = [
		{ value: 'monday', label: 'Monday' },
		{ value: 'tuesday', label: 'Tuesday' },
		{ value: 'wednesday', label: 'Wednesday' },
		{ value: 'thursday', label: 'Thursday' },
		{ value: 'friday', label: 'Friday' },
		{ value: 'saturday', label: 'Saturday' },
		{ value: 'sunday', label: 'Sunday' },
	];
	const times = [
		{ time: '12:00 AM', value: 0 },
		{ time: '1:00 AM', value: 1 },
		{ time: '2:00 AM', value: 2 },
		{ time: '3:00 AM', value: 3 },
		{ time: '4:00 AM', value: 4 },
		{ time: '5:00 AM', value: 5 },
		{ time: '6:00 AM', value: 6 },
		{ time: '7:00 AM', value: 7 },
		{ time: '8:00 AM', value: 8 },
		{ time: '9:00 AM', value: 9 },
		{ time: '10:00 AM', value: 10 },
		{ time: '11:00 AM', value: 11 },
		{ time: '12:00 PM', value: 12 },
		{ time: '1:00 PM', value: 13 },
		{ time: '2:00 PM', value: 14 },
		{ time: '3:00 PM', value: 15 },
		{ time: '4:00 PM', value: 16 },
		{ time: '5:00 PM', value: 17 },
		{ time: '6:00 PM', value: 18 },
		{ time: '7:00 PM', value: 19 },
		{ time: '8:00 PM', value: 20 },
		{ time: '9:00 PM', value: 21 },
		{ time: '10:00 PM', value: 22 },
		{ time: '11:00 PM', value: 23 },
	];
	const [workingTime, setWorkingTime] = useState<WorkingTime>(prop.workingTime || {
		monday: { from: 8, to: 17 },
		tuesday: { from: 8, to: 17 },
		wednesday: { from: 8, to: 17 },
		thursday: { from: 8, to: 17 },
		friday: { from: 8, to: 17 },
		saturday: { from: 8, to: 17 },
		sunday: { from: 8, to: 17 },
	
	});
	const [loading, setLoading] = useState(false);

	const handleChangeTime = (e: any) => {
		const { name, value } = e.target;
		const [day, period] = name.split('-') as [keyof WorkingTime, keyof DayTime];

		setWorkingTime((prevWorkingTime) => ({
			...prevWorkingTime,
			[day]: {
				...prevWorkingTime[day],
				[period]: Number(value),
			},
		}));
	};

	const saveWorkingTime = () => {
		if (loading) return;
		setLoading(true);
		axiosClient
			.post('/company/settings/book-appointment/working-time', { workingTime: JSON.stringify(workingTime) })
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	

	return (
		<div className="panel p-4">
			<div className="mt-1 text-center font-bold text-lg mb-4">Working time</div>
			<div className="grid grid-flow-row gap-3">
				{days.map((day, index) => (
					<div key={index} className="grid grid-cols-3 gap-3">
						<label htmlFor={day.value}>{day.value}</label>
						<select id={day.value} value={workingTime[day.value].from} name={day.value + '-from'} className="form-select text-white-dark" onChange={handleChangeTime}>
							{times.map((time, index) => (
								<option key={index} value={time.value}>
									{time.time}
								</option>
							))}
						</select>
						<select id={day.value} value={workingTime[day.value].to} name={day.value + '-to'} className="form-select text-white-dark" onChange={handleChangeTime}>
							{times.map((time, index) => (
								<option key={index} value={time.value}>
									{time.time}
								</option>
							))}
						</select>
					</div>
				))}
				<div className="mt-4 w-full">
					<button className="btn btn-primary w-full" onClick={saveWorkingTime}>
						Save {loading && <ButtonLoader />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default WorkingTime;
