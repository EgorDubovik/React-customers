import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Grids from './Grids';

const AppointmentsScheduler = (props:any) => {
   const startTime = props.startTime || moment('07:00', 'HH:mm');
   const endTime = props.endTime || moment('18:00', 'HH:mm');
   const defaultBackgroundColor = props.eventDefoultBgColor || '#1565c0';
   const endTimeCopy = endTime.clone().add(1, 'hour');
   const totalDuration = moment.duration(endTimeCopy.diff(startTime));
   const daysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

   const blockHeight = props.blockHeight || 50;
   const onClickHandler = props.onClickHandler || null;
   const appointments = props.appointments || [];

   const [currentDate, setCurrentDate] = useState(moment());
   const [appointmentForCurentDate, setAppointmentForCurentDate] = useState([]);

   const helper = {
      calculateTimePercentage : (time:any) => {
         const relativeTime = time.clone().set({hour: startTime.hour(), minute: startTime.minute()});
         const elaspseTime = moment.duration(time.diff(relativeTime));
         return (elaspseTime.asMinutes() / totalDuration.asMinutes()) * 100;
      },
      getTimesArray : (interval:number=60) => {
         const times = [];
         const start = startTime.clone();
         const end = endTime.clone();
         while (start <= end) {
            times.push(start.format('hh A'));
            start.add(interval, 'minutes');
         }
         return times;
      },
      procentToMinutes: function (procent:number) {
         var minutes = Math.round((totalDuration.asMinutes() * procent) / 100);
         return minutes;
      },
   }

   const getAppointmentsByCurrentDate = (appointmentsArray:any) => {
      let selectedStartDay = currentDate.clone().startOf('week');
      let selectedEndDay = currentDate.clone().endOf('week');
      console.log(appointmentsArray);
      let returnAppointments = appointmentsArray.filter((appointment:any) => {
         appointment.start = moment(appointment.start);
         appointment.end = moment(appointment.end);
         appointment.bg = appointment.bg || defaultBackgroundColor;
         return (
            appointment.start.isBetween(selectedStartDay,selectedEndDay ) ||  
            appointment.end.isBetween( selectedStartDay, selectedEndDay ) ||
            (appointment.start.isBefore(selectedStartDay) && appointment.end.isAfter(selectedEndDay))
         );
      });
      let sortedAppointments = returnAppointments.sort((a:any, b:any) => a.start - b.start);
      return sortedAppointments;
   }

   const groupAppointmentsByTime = (appointmentsArray:any) => {
      let groups:any = [];
      appointmentsArray.forEach((appointment:any) => {
         const matchingGroup = groups.find(
            (group:any) => 
               appointment.start.isBetween(group.start, group.end, null,"[)") ||
               appointment.end.isBetween(group.start, group.end, null,"(]")
         );
         if (matchingGroup) {
            matchingGroup.appointments.push(appointment);
         } else {
            groups.push({
               start: appointment.start,
               end: appointment.end,
               appointments: [appointment],
            });
         }
      });
      return groups;
   }

   const fetchAppointments = (appointmentsGroup:any) => {
      let returnAppointments:any = [];
      appointmentsGroup.forEach((group:any) => {
         const groupAppointments = group.appointments;
         groupAppointments.forEach((appointment:any, index:number) => {
            
            appointment.width = 100 / groupAppointments.length;
            appointment.left = appointment.width * index;
            appointment.top = helper.calculateTimePercentage(appointment.start);
            appointment.bottom = helper.calculateTimePercentage(appointment.end);
            appointment.height = appointment.bottom - appointment.top;
            returnAppointments.push(appointment);
         });
      });
      return returnAppointments;
   }

   const onAppointmentClick = (appointment:any) => {
      if(onClickHandler) {
         onClickHandler(appointment);
      }
   }

   const timesArray = helper.getTimesArray();
   
   useEffect(() => {
      let currentAppointments = getAppointmentsByCurrentDate(appointments);
      setAppointmentForCurentDate(currentAppointments);

   }, [currentDate]);

   let groupedAppointment = groupAppointmentsByTime(appointmentForCurentDate);
   
   let appointmentList = fetchAppointments(groupedAppointment);

   const prevWeekHandle = () => {
      setCurrentDate(currentDate.clone().subtract(1, 'week'));
   }
   const nextWeekHandle = () => {
      setCurrentDate(currentDate.clone().add(1, 'week'));
   }
   const todayHandle = () => {
      setCurrentDate(moment());
   }

   return (
      <div className='select-none'>
         
         <div className="scheduler-container rounded bg-white dark:bg-gray-800 p-4">
            <div className="scheduler-header flex justify-between">
               <div className="scheduler-date text-base">{currentDate.format('MMMM YYYY')}</div>
               <div className="scheduler-nav flex gap-4">
                  <button className="btn btn-sm btn-outline btn-outline-primary" onClick={prevWeekHandle}>{'<'}</button>
                  <button className="btn btn-sm btn-outline btn-outline-primary" onClick={todayHandle}>Today</button>
                  <button className="btn btn-sm btn-outline btn-outline-primary" onClick={nextWeekHandle}>{'>'}</button>
               </div>
            </div>
            
            <div className="scheduler-body">
               <div className="scheduler-weekdays flex pt-4 pb-4 border-b dark:border-gray-600 border-gray-300">
                  <div className="first-item w-10"></div>
                  <div className="weekdays text-center grid grid-cols-7 w-full">
                     {daysArray.map((day, index) => (
                        <div key={index} className="weekday">{day} {currentDate.clone().weekday(index).format('DD')}</div>
                     ))}
                     
                  </div>
               </div>
               <div className="scheduler-dates flex relative">
                  <div className={"times text-[0.8em] w-10 pt-2"}>
                     {timesArray.map((time, index) => (
                        <div key={index} className={"time h-["+(blockHeight)+"px] border-t border-transparent"}>
                           <div className="time-title  -mt-2">{time}</div>
                        </div>
                     ))}
                  </div>
                  <Grids
                     blockHeight={blockHeight}
                     startTime={startTime}
                     endTime={endTime}
                     timesArray={timesArray}
                     appointmentList={appointmentList}
                     setAppointmentForCurentDate={setAppointmentForCurentDate}
                     onAppointmentClick={onAppointmentClick}
                     totalDuration={totalDuration}
                  />
                  
               </div>   
            </div>
         </div>
      </div>
   );
}

export default AppointmentsScheduler;