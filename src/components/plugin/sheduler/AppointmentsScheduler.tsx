import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { co } from '@fullcalendar/core/internal-common';
import { ref } from 'yup';

const AppointmentsScheduler = (props:any) => {
   const startTime = moment('07:00', 'HH:mm');
   const endTime = moment('18:00', 'HH:mm');
   const defaultBackgroundColor = props.eventDefoultBgColor || '#1565c0';
   const endTimeCopy = endTime.clone().add(1, 'hour');
   const totalDuration = moment.duration(endTimeCopy.diff(startTime));
   const daysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
   const blockHeight = 50;
   
   const onClickHandler = props.onClickHandler || null;

   const appointments = props.appointments || [];
   const [appointmentsList, setAppointmentsList] = useState();
   const dayInnerRef = useRef(null);
   let dayInnerHeight = useRef(0);
   let dayInnerOffsettop = useRef(0);

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

   const getAppointmentsByCurrentDate = (appointments:any) => {
      let selectedStartDay = curentDate.clone().startOf('week');
      let selectedEndDay = curentDate.clone().endOf('week');
      
      let returnAppointments = appointments.filter((appointment:any) => {
         appointment.start = moment(appointment.start);
         appointment.end = moment(appointment.end);
         appointment.bg = appointment.bg || defaultBackgroundColor;
         return (
            appointment.start.isBetween(selectedStartDay,selectedEndDay ) ||  
            appointment.end.isBetween( selectedStartDay, selectedEndDay ) ||
            (appointment.start.isBefore(selectedStartDay) && appointment.end.isAfter(selectedEndDay))
         );
      });
      return returnAppointments.sort((a:any, b:any) => a.start - b.start);
   }

   const groupAppointmentsByTime = (appointments:any) => {
      let groups:any = [];
      appointments.forEach((appointment:any) => {
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

   const [curentDate, setcurentDate] = useState(moment());

   const prevWeekHandle = () => {
      setcurentDate(curentDate.clone().subtract(1, 'week'));
   }
   const nextWeekHandle = () => {
      setcurentDate(curentDate.clone().add(1, 'week'));
   }
   const todayHandle = () => {
      setcurentDate(moment());
   }
   const onAppointmentClick = (appointment:any) => {
      if(onClickHandler) {
         onClickHandler(appointment);
      }
   }

   const timesArray = helper.getTimesArray();
   
   // get Appointment in view range
   let appointmentsByCurrentDate = getAppointmentsByCurrentDate(appointments);
   setAppointmentsList(appointmentsByCurrentDate);
   // group appointments by time
   let groupedAppointments = groupAppointmentsByTime(appointmentsByCurrentDate);

   // mesuring appointments position
   const appointmentList = fetchAppointments(groupedAppointments);

   
   const isDragging = useRef(false);
   const startPosition = useRef(0);
   const appointmentOffsetTop = useRef(0);
   const appointmentOffsetInner = useRef(0);
   const appointmentRef = useRef(null);
   const appointmentProcentHeightRef = useRef(0);
   const appointmentPxHeightRef = useRef(0);
   const appointmentIndex = useRef(0);
   const newProcentTop = useRef(0);
   const deltaProcent = (15 * 100) / totalDuration.asMinutes();
   const deltaPx = useRef(0);
   
   const handleMouseDown = (e:any,index:number) => {
      
      appointmentIndex.current = index;
      appointmentRef.current = e.currentTarget;
      const appointmentElement = e.currentTarget;
      const dayInnerElement = e.currentTarget.closest('.day-inner');

      dayInnerHeight.current = dayInnerElement.getBoundingClientRect().height;
      dayInnerOffsettop.current = dayInnerElement.getBoundingClientRect().top;
      appointmentOffsetTop.current = appointmentElement.getBoundingClientRect().top;
      
      appointmentOffsetInner.current = appointmentOffsetTop.current - dayInnerOffsettop.current;
      appointmentProcentHeightRef.current = helper.calculateTimePercentage(appointmentList[index].end) - helper.calculateTimePercentage(appointmentList[index].start);
      appointmentPxHeightRef.current = appointmentElement.getBoundingClientRect().height;
      startPosition.current = e.clientY;

      deltaPx.current = (deltaProcent * dayInnerHeight.current) / 100;
      appointmentElement.style.zIndex = '100';
      appointmentElement.style.width = '100%';
      appointmentElement.style.left = '0%';

      isDragging.current = true;
   }
   
   const handleMouseMove = (e:any) => {
      if(!isDragging.current) return;

      let changedPosition = e.clientY - startPosition.current;
      let newTopPosition = appointmentOffsetInner.current+changedPosition; // new position of appointment in px from top of dayInner
      if(newTopPosition >= 0 && appointmentPxHeightRef.current+newTopPosition <= dayInnerHeight.current){
         
         let t = Math.round(newTopPosition / deltaPx.current);
         newTopPosition = t * deltaPx.current;
         newProcentTop.current = (newTopPosition / dayInnerHeight.current) * 100;
         appointmentRef.current.style.top = newProcentTop.current + '%';
      }
   }

   const handleMouseUp = () => {
      if(!isDragging.current) return;

      appointmentList[appointmentIndex.current].start = moment(appointmentList[appointmentIndex.current].start.format('YYYY-MM-DD')+' '+startTime.format('HH:mm')).add(helper.procentToMinutes(newProcentTop.current), 'minutes');
      appointmentList[appointmentIndex.current].end = moment(appointmentList[appointmentIndex.current].end.format('YYYY-MM-DD')+' '+startTime.format('HH:mm')).add(helper.procentToMinutes(newProcentTop.current+appointmentProcentHeightRef.current), 'minutes');
      isDragging.current = false;

      appointmentRef.current.style.zIndex = '1';

      // console.log(appointmentList);
      setAppointmentsList(appointmentList);
   }

   return (
      <div className='select-none'>
         
         <div className="scheduler-container rounded bg-white dark:bg-gray-800 p-4">
            <div className="scheduler-header flex justify-between">
               <div className="scheduler-date text-base">{curentDate.format('MMMM YYYY')}</div>
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
                        <div key={index} className="weekday">{day} {curentDate.clone().weekday(index).format('DD')}</div>
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
                  <div className="dates grid grid-cols-7 w-full">
                     {daysArray.map((day, index) => (
                        <div className="date pt-2 first:border-0 border-l dark:border-gray-600 border-gray-300" key={index}>
                           <div className='day-inner relative h-full' ref={dayInnerRef}>
                              <div className="appointments-list absolute h-full left-0 top-0 right-0" onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                                 { appointmentList.map((appointment:any, aindex:number) => 
                                    {
                                       if(appointment.start.weekday() === index) {
                                          return (
                                             <div key={appointment.title+"-"+aindex+appointment.top} onMouseDown={(e)=>{handleMouseDown(e,aindex)}}  className={"appointment text-[.8em]  absolute p-[2px] cursor-pointer"} style={{ height: appointment.height+'%', width: appointment.width+'%', left: appointment.left+'%', top: appointment.top+'%' }}>
                                                <div className="appointment-conteiner rounded absolute opacity-90" style={{ background:appointment.bg,inset:'1px' }}></div>
                                                <div className='text-white sticky'>
                                                   <div className="appointment-title px-2 pt-1 hover:underline " onClick={()=>{onAppointmentClick(appointment)}}>{appointment.title}</div>
                                                   <div className="appointment-time px-2">{appointment.start.format('hh:mm A')} - {appointment.end.format('hh:mm A')}</div>
                                                </div>
                                             </div>
                                          )
                                       }
                                    }
                                 )}
                                 
                              </div>
                              { timesArray.map((time, index) => (
                                 <div key={index} className={"date-time h-["+(blockHeight)+"px] dark:border-gray-600 border-gray-300 border-t"}></div>
                              ))}
                           </div>
                        </div>
                     ))}

                  </div>
               </div>   
            </div>
         </div>
      </div>
   );
}

export default AppointmentsScheduler;