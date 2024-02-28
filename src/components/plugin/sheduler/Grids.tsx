import React, { useState,useRef } from 'react';

const Grids = (props:any) => {
   const appointmentList = props.appointmentList || [];

   const daysArray = props.daysArray || [];
   const timesArray = props.timesArray || [];
   const handleAppointmentClick = props.onAppointmentClick || null;
   const startTime = props.startTime || null;
   const blockHeight = props.blockHeight || 0;
   
   const dayInnerRef = useRef(null);
   const dayInnerHeight = useRef(0);
   const dayInnerOffsettop = useRef(0);
   
   

   const isDragging = useRef(false);
   const startPosition = useRef(0);
   const appointmentOffsetTop = useRef(0);
   const appointmentOffsetInner = useRef(0);
   const appointmentRef = useRef(null);
   const appointmentProcentHeightRef = useRef(0);
   const appointmentIndex = useRef(0);
   const newProcentTop = useRef(0);

   const onAppointmentClick = (appointment:any) => {
      if(handleAppointmentClick) {
         handleAppointmentClick(appointment);
      }
   }
   
   const handleMouseDown = (e:any,index:number) => {
       
      appointmentIndex.current = index;
      appointmentRef.current = e.target.closest('.appointment');
      dayInnerOffsettop.current = dayInnerRef.current.getBoundingClientRect().top;
      appointmentOffsetTop.current = e.target.closest('.appointment')?.getBoundingClientRect().top;
      dayInnerHeight.current = dayInnerRef.current.getBoundingClientRect().height;
      appointmentOffsetInner.current = appointmentOffsetTop.current - dayInnerOffsettop.current;
      appointmentProcentHeightRef.current = helper.calculateTimePercentage(appointmentList[index].end) - helper.calculateTimePercentage(appointmentList[index].start);
      startPosition.current = e.clientY;

      appointmentRef.current.style.width = '100%';
      appointmentRef.current.style.left = '0%';
      appointmentRef.current.style.zIndex = '100';
      isDragging.current = true;
   }
   const handleMouseUp = () => {
      if(!isDragging.current) return;

      appointmentList[appointmentIndex.current].start = moment(appointmentList[appointmentIndex.current].start.format('YYYY-MM-DD')+' '+startTime.format('HH:mm')).add(helper.procentToMinutes(newProcentTop.current), 'minutes');
      appointmentList[appointmentIndex.current].end = moment(appointmentList[appointmentIndex.current].end.format('YYYY-MM-DD')+' '+startTime.format('HH:mm')).add(helper.procentToMinutes(newProcentTop.current+appointmentProcentHeightRef.current), 'minutes');
      isDragging.current = false;
      setAppointments(appointmentList);
   }
   const handleMouseMove = (e:any) => {
      if(isDragging.current) {
         let changedPosition = e.clientY - startPosition.current;
         let newTopPosition = appointmentOffsetInner.current+changedPosition; // new position of appointment in px from top of dayInner
         if(newTopPosition >= 0 && newTopPosition <= dayInnerHeight.current){
            newProcentTop.current = (newTopPosition/dayInnerHeight.current)*100;
            appointmentRef.current.style.top = newProcentTop.current+'%';
         }
         
      }
   }

   return (
      <div>
      {daysArray.map((day:any, index:number) => (
         <div className="date pt-2 first:border-0 border-l dark:border-gray-600 border-gray-300" key={index}>
            <div className='day-inner relative h-full' ref={dayInnerRef}>
               <div className="appointments-list absolute h-full left-0 top-0 right-0" onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                  { appointmentList.map((appointment:any, aindex:number) => 
                     {
                        if(appointment.start.weekday() === index) {
                           return (
                              <div key={aindex} onMouseDown={(e)=>{handleMouseDown(e,aindex)}}  className={"appointment text-[.8em]  absolute p-[2px] cursor-pointer"} style={{ height: appointment.height+'%', width: appointment.width+'%', left: appointment.left+'%', top: appointment.top+'%' }}>
                                 <div className={"appointment-conteiner w-full h-full rounded text-white"} style={{ background:appointment.bg }}>
                                    <div className="appointment-title px-2 pt-1 hover:underline " onClick={()=>{onAppointmentClick(appointment)}}>{appointment.title}</div>
                                    <div className="appointment-time px-2">{appointment.start.format('hh:mm A')} - {appointment.end.format('hh:mm A')}</div>
                                 </div>
                              </div>
                           )
                        }
                     }
                  )}
                  
               </div>
               { timesArray.map(() => (
                  <div className={"date-time h-["+(blockHeight)+"px] dark:border-gray-600 border-gray-300 border-t"}></div>
               ))}
            </div>
         </div>
      ))}
      </div>
   )
}

export default Grids;