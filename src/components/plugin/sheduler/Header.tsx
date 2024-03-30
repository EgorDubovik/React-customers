import React from 'react';
import moment from 'moment';
const Header = (props:any) => {
   const currentDate = props.currentdate || moment();
   const setCurrentDate = props.setcurrentdate || null;

   const prevWeekHandle = () => {
      setCurrentDate(currentDate.clone().subtract(1, 'week'));
   }
   const nextWeekHandle = () => {
      setCurrentDate(currentDate.clone().add(1, 'week'));
   }
   const todayHandle = () => {
      setCurrentDate(moment());
   }

   console.log(currentDate);

   return (
      <></>
   );
}