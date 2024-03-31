import React, { useState } from "react";
import "../css/style.css"
import DaysNameWheel from "./DaysNameWheel";
import AmPmWheel from "./AmPmWheel";
import Hour from "./HourWheel";
import MinuteWheel from "./MinuteWheel";

import {getDateFromShortFormat} from "./helper";

const MyTimePicker = (props:any) => {
   
   const [currentTime, setCurrentTime] = useState(props.currentDate || new Date());

   const onHourChange = (value:any) => {
      let newHour = value;
      if(params.is12AmPm){
         if(amPmLast === "PM")
            newHour = value === 12 ? 12 : (value+12);
         
         if(amPmLast === "AM")
            newHour = value === 12 ? 0 : value;
            
      }
      params.currentDate.setHours(newHour);
      onDateChange();
   }
   const onMinuteChange = (value:any) => {
      params.currentDate.setMinutes(value);
      onDateChange();
   }


   const onDaysNameChange = (value:any) => {
      const { baseDate } = getDateFromShortFormat(value);
      params.currentDate.setDate(baseDate.getDate());
      params.currentDate.setMonth(baseDate.getMonth());
      onDateChange();
   }

   const onAmPmChange = (value:any) => {
      
      if(value === "PM"){
         if(params.currentDate.getHours() < 12){
            params.currentDate.setHours(params.currentDate.getHours() + 12);
         }
      }else{
         if(params.currentDate.getHours() >= 12)
            params.currentDate.setHours(params.currentDate.getHours() - 12);
      }
      setAmPmLast(value);
      onDateChange();
   }


   const onDateChange = () => {
      if(params.onDateChange)
         params.onDateChange(params.currentDate);
   }

   const params = {
      itemHeight: 40,
      currentDate: currentTime,
      viewItems: 3,
      is12AmPm: true,
      minutesStep: 15,
      dots : true,
      onDateChange: props.onDateChange || null,
      onHourChange: onHourChange,
      onMinuteChange: onMinuteChange,
      onDaysNameChange: onDaysNameChange,
      onAmPmChange: onAmPmChange,
   }
   const [amPmLast, setAmPmLast] = useState((params.currentDate.getHours() >= 12) ? "PM" : "AM");
   const wrapperHeight = params.itemHeight * ((params.viewItems % 2 === 0) ? params.viewItems+1 : params.viewItems);
   
   return (
      <div className="picker-conteiner dark:text-white text-[15px]">
         <div className="picker-wrapper" style={{ height: wrapperHeight+"px" }}>
            <DaysNameWheel {...params}/>
            <Hour {...params}/>
            {params.dots && <div className="picker-dots">:</div>}
            <MinuteWheel {...params}/>
            {params.is12AmPm && <AmPmWheel {...params}/>}
         </div>
      </div>
   );
}

export default MyTimePicker;