import React, { useContext, useState } from 'react';
import { CustomerContext } from './CustomerContext';
import { CustomerContextType, SelectedTimeType } from './@types';

const SelectDateTime = () => {

   const {selectedDateTime,setSelectedDateTime, setSliderIndex, workingTime} = useContext(CustomerContext) as CustomerContextType;
   const today = new Date();
   today.setHours(0,0,0,0);
   
   const [viewDate, setViewDate] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState(new Date());
   const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   function getTimeArray(startTime:number, endTime:number, interval:number) : SelectedTimeType[]{
      
      let timeArray = [];
      let start = new Date();
      start.setHours(startTime);
      start.setMinutes(0);
      let end = new Date();
      end.setHours(endTime);
      end.setMinutes(0);
      while(start <= end){
         let isActive = false;
         let currentTime = new Date();
         let newTime =  new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), start.getHours(), start.getMinutes());
         if(newTime >= today){
            isActive = newTime >= currentTime;
         }
         timeArray.push({
               title: start.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}),
               value: start.getHours(),
               isActive: isActive
            }  
         );
         start = new Date(start.getTime() + interval*60000);
      }
      return timeArray;
   }
   
   function getDaysArrayForCalendar(year:number, month:number) {
      const daysInMonth = new Date(year, month, 0).getDate();
      const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); 
      const daysArray = [];
      console.log(firstDayOfMonth);
      const previousMonthDays = (firstDayOfMonth === 0 ? 7 : firstDayOfMonth);
      const previousMonthLastDay = new Date(year, month - 1, 0).getDate(); 
      for (let i = previousMonthLastDay - previousMonthDays +1 ; i <= previousMonthLastDay; i++) {
         daysArray.push({ day: i, isActive: false, isSelected: false});
      }
      for (let i = 1; i <= daysInMonth; i++) {
         let isSelected = false;
         let isActive = false;
         let date = new Date(year, month - 1, i);
         let compareDate = selectedDate;
         if (date >= today){
            isActive = true;
         }
         
         if(date.getDate() === compareDate.getDate() && year === compareDate.getFullYear() && month === compareDate.getMonth() + 1){
            isSelected = true;
         }

         daysArray.push({ day: i, isActive: isActive, isSelected: isSelected});
      }
      
      const remainingDays = Math.ceil(daysArray.length/7)*7 - daysArray.length;
      for (let i = 1; i <= remainingDays; i++) {
         daysArray.push({ day: i, isActive: false, isSelected: false});
      }
    
      return daysArray;
   }
   
   const days = getDaysArrayForCalendar(viewDate.getFullYear(), viewDate.getMonth() + 1);
   const dayOfWeek = selectedDate.getDay();
   const workingDay = (workingTime && workingTime[daysName[dayOfWeek].toLocaleLowerCase()]) ? workingTime[daysName[dayOfWeek].toLowerCase()] : {from: 8, to: 17};
   console.log('workingDay:',workingDay);
   const timeArray = getTimeArray(workingDay.from, workingDay.to, 60);

   const nextMonthHandel = () => {
      setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)));
   }
   const previousMonthHandel = () => {
      setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)));
   }

   const selectDayHandle = (day:number,isActive:boolean) => {
      if(isActive)
         setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
   }
   const selectTimeHandle = (time:number,isActive:boolean) => {
      if(isActive){
            let newDateTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(),time);
            setSelectedDateTime(newDateTime);
            setSliderIndex(3);
         }
   }

   return (
      <div className='p-2 col-span-2'>
         <h2 className='font-bold text-left'>Choose day:</h2>
         <div className='pt-4 grid grid-cols-1 gap-2'>
            <div className="calendar bg-white col-span-3 rounded pb-2 px-2" >
               <div className="calendar__header p-2 pt-4 pb-4 border-b flex justify-between">
                  <div className="left-arrow text-sm cursor-pointer" onClick={previousMonthHandel}>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />  
                     </svg>
                  </div>
                  <div className="calendar__header__month">{viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}</div> 
                  <div className="right-arrow cursor-pointer" onClick={nextMonthHandel}>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                     </svg>
                  </div>
               </div>
               <div className="calendar__days grid grid-cols-7 gap-2 mt-2">
                  <div className="day text-center text-sm text-gray-500">Sun</div>
                  <div className="day text-center text-sm text-gray-500">Mon</div>
                  <div className="day text-center text-sm text-gray-500">Tue</div>
                  <div className="day text-center text-sm text-gray-500">Wed</div>
                  <div className="day text-center text-sm text-gray-500">Thu</div>
                  <div className="day text-center text-sm text-gray-500">Fri</div>
                  <div className="day text-center text-sm text-gray-500">Sat</div>
               </div>
               <div className="calendar__dates grid grid-cols-7 gap-2 mt-2">
                  {days.map((day, index) => {
                     return (<div key={index} onClick={()=>{selectDayHandle(day.day,day.isActive)}} className={"date text-center p-2 text-sm "+(day.isActive ? " cursor-pointer hover:bg-blue-500 hover:rounded hover:text-white" : "text-gray-300 cursor-default")+ " " +(day.isSelected ? "bg-blue-500 text-white font-bold rounded" : "")}>{day.day}</div>)
                  })}
               </div>
            </div>
            <div className='p-2 text-left text-sm mt-2'>
               <h2 className='font-bold text-left text-base'>Choose time:</h2>
               <div className='grid grid-cols-1 sm:grid-cols-6 gap-3 mt-4'>
               {
                  timeArray.map((time,index) => {
                     return (
                        <div key={index} onClick={()=>{selectTimeHandle(time.value, time.isActive)}} className={'p-2 rounded px-4 text-center '+(time.isActive ?  ' bg-white border border-blue-300 text-blue-600 hover:bg-blue-500 cursor-pointer hover:text-white hover:font-bold' : 'text-gray-400')}>{time.title}</div>
                     )
                  })
               }
               </div>
            </div>
         </div>
      </div>
   )
}

export default SelectDateTime;