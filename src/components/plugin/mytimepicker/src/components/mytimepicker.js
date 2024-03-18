import React, { useState } from "react";
import "../css/style.css"
import DaysNameWheel from "./DaysNameWheel";
import AmPmWheel from "./AmPmWheel";
import Hour from "./HourWheel";
import MinuteWheel from "./MinuteWheel";

import {getDateFromShortFormat} from "./helper";

const MyTimePicker = (props) => {
   
   const onHourChange = (value) => {
      if(params.is12AmPm){
         if(amPmLast === "PM")
            params.currentDate.setHours(value === 12 ? 12 : (value+12));
         if(amPmLast === "AM")
            params.currentDate.setHours(value === 12 ? 0 : value);
      } else {
         params.currentDate.setHours(value);
      }
      
      onDateChange();
   }
   const onMinuteChange = (value) => {
      
      params.currentDate.setMinutes(value);
      onDateChange();
   }

   

   const onDaysNameChange = (value) => {
      const { baseDate } = getDateFromShortFormat(value);
      params.currentDate.setDate(baseDate.getDate());
      params.currentDate.setMonth(baseDate.getMonth());
      onDateChange();
   }

   const onAmPmChange = (value) => {
      
      if(value === "PM"){
         console.log(params.currentDate.getHours());
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
      currentDate: props.currentDate || new Date(),
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
      <div className="picker-conteiner">
         <div className="picker-wrapper" style={{ border:"1px solid #ccc",height: wrapperHeight+"px" }}>
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