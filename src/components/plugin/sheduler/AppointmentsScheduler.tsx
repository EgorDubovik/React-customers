import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Grids from './Grids';

const AppointmentsScheduler = (props:any) => {
   const startTime = moment(props.startTime || '00:00', 'HH:mm');
   const endTime = moment(props.endTime || '23:00', 'HH:mm');
   const defaultBackgroundColor = props.eventDefoultBgColor || '#1565c0';
   const endTimeCopy = endTime.clone().add(1, 'hour');
   const totalDuration = moment.duration(endTimeCopy.diff(startTime));
   const [daysArray, setDaysArray] = useState<any>([]);
   const [viewType, setViewType] = useState(props.viewType || "week"); // week | day 
   const scheduleBgClass = props.scheduleBgClass || 'bg-white dark:bg-gray-800';

   const blockHeight = props.blockHeight || 50;
   const onClickHandler = props.onClickHandler || null;
   const appointments = props.appointments || [];
   const [currentDate, setCurrentDate] = useState(moment(props.currentDate) || moment());
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
      getDaysArray: function () {
         if(viewType === 'week') {
            for (let i = 0; i < 7; i++) {
               daysArray[i] = currentDate.clone().weekday(i).format('ddd') + ' ' + currentDate.clone().weekday(i).format('DD');
            }
         } else if(viewType === 'day') {
            daysArray[0] = currentDate.format('ddd') + ' ' + currentDate.format('DD');
         }
         return daysArray;
      }

   }

   const getAppointmentsByCurrentDate = (appointmentsArray:any) => {
      let selectedStartDay = currentDate.clone().startOf('week');
      let selectedEndDay = currentDate.clone().endOf('week');
      
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
      setDaysArray(helper.getDaysArray());

   }, [currentDate, appointments, viewType]);

   
   let groupedAppointment = groupAppointmentsByTime(appointmentForCurentDate);
   let appointmentList = fetchAppointments(groupedAppointment);


   const prevWeekHandle = () => {
      if(viewType === 'week')
         setCurrentDate(currentDate.clone().subtract(1, 'week'));
      if(viewType === 'day')
         setCurrentDate(currentDate.clone().subtract(1, 'days'));
   }
   const nextWeekHandle = () => {
      if(viewType === 'week')
         setCurrentDate(currentDate.clone().add(1, 'week'));
      if(viewType === 'day')
         setCurrentDate(currentDate.clone().add(1, 'days'));
   }
   const todayHandle = () => {
      setCurrentDate(moment());
   }

   return (
      <div className='select-none'>
         
         <div className={"scheduler-container rounded "+scheduleBgClass+" p-4"}>
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
                  <div key={daysArray.length} className={"weekdays text-center grid grid-cols-"+daysArray.length+" w-full"}>
                     {daysArray.map((day:string, index:number) => (
                        <div key={index} className="weekday">{day}</div>
                     ))}
                     
                  </div>
               </div>
               <div className="scheduler-dates flex relative">
                  <div className={"times text-[0.8em] w-10 pt-2"}>
                     {timesArray.map((time, index) => (
                        <div key={index} className={"time  border-t border-transparent"} style={{ height:blockHeight+"px" }}>
                           <div className="time-title  -mt-2">{time}</div>
                        </div>
                     ))}
                  </div>
                  <Grids
                     blockHeight={blockHeight}
                     startTime={startTime}
                     endTime={endTime}
                     timesArray={timesArray}
                     daysArray={daysArray}
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