import { useState, useEffect } from 'react';
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
const BookAppointment = () => {
	const week = [
		{ day: 'Monday', value: 'monday' },
		{ day: 'Tuesday', value: 'tuesday' },
		{ day: 'Wednesday', value: 'wednesday' },
		{ day: 'Thursday', value: 'thursday' },
		{ day: 'Friday', value: 'friday' },
		{ day: 'Saturday', value: 'saturday' },
		{ day: 'Sunday', value: 'sunday' },
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
	const [workingTime, setWorkingTime] = useState<WorkingTime>({
		monday: { from: 0, to: 0 },
		tuesday: { from: 0, to: 0 },
		wednesday: { from: 0, to: 0 },
		thursday: { from: 0, to: 0 },
		friday: { from: 0, to: 0 },
		saturday: { from: 0, to: 0 },
		sunday: { from: 0, to: 0 },
	});

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
	useEffect(() => {
		console.log(workingTime);
	}, [workingTime]);
	return (
		<div>
			<div className="flex justify-start items-center text-lg">
				<h1>Book Appointments online settings</h1>
			</div>
			<div className="py-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
					<div className="panel p-4">
						<div className="mt-1 text-center font-bold text-lg mb-4">Working time</div>
						<div className="grid grid-flow-row gap-3">
							{week.map((day, index) => (
								<div key={index} className="grid grid-cols-3 gap-3">
									<label htmlFor={day.value}>{day.day}</label>
									<select id={day.value} name={day.value + '-from'} className="form-select text-white-dark" onChange={handleChangeTime}>
										{times.map((time, index) => (
											<option key={index} value={time.value}>
												{time.time}
											</option>
										))}
									</select>
									<select id={day.value} name={day.value + '-to'} className="form-select text-white-dark" onChange={handleChangeTime}>
										{times.map((time, index) => (
											<option key={index} value={time.value}>
												{time.time}
											</option>
										))}
									</select>
								</div>
							))}
							<div className='mt-4 w-full'>
								<button className="btn btn-primary w-full">Save</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookAppointment;
