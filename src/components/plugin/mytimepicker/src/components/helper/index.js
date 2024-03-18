export const getHoursArray = (curentHour, is12AmPm) => {
      
   let hours12 = curentHour % 12;
   if (hours12 === 0) hours12 = 12;
   const del = is12AmPm ? 12 : 24;
   const currentHour = is12AmPm ? hours12 : curentHour;
   const start = is12AmPm ? -6 : -12;
   const end = is12AmPm ? 5 : 11;
   const hours1 = [];

   for (let i = start; i <= end; i++) {
      let hour = (currentHour + i + del) % del;
      hour = is12AmPm ? (hour === 0 ? 12 : hour) : hour;
      hours1.push({
         text:`${hour.toString().padStart(2, '0')}`,
         value: hour,
         isSelected: false,
      });
   }
   const hours2 = [];
   for (let i = start; i <= end; i++) {
      let hour = (currentHour + i + del) % del;
      hour = is12AmPm ? (hour === 0 ? 12 : hour) : hour;
      hours2.push({
         text:`${hour.toString().padStart(2, '0')}`,
         value: hour,
         isSelected: hour === currentHour,
      });
   }
   return [...hours1, ...hours2,...hours1];
}

export const getMinutesArray = (currentMinute,step) => {
   const arraySize = 60;
   const minutes = [];
   const halfSize = Math.floor(arraySize / 2);
   currentMinute = Math.ceil(currentMinute / step) * step;
   for (let i = -halfSize; i <= halfSize; i += step) {
      let minute = (currentMinute + i + 60) % 60; // Wrap around using modulo
      minutes.push({
         text: minute.toString().padStart(2, '0'),
         value: minute,
         isSelected: minute === currentMinute,
      });
   }

   if (minutes.length > 1 && minutes[0].value === minutes[minutes.length - 1].value) {
      minutes.pop(); // Remove the last element to prevent duplication
   }
   
   return [...minutes,...minutes,...minutes];
}



export const getDaysNameArray = (currentDay, daysBefore = 20, daysAfter = 19) => {
   
   // const weekDaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   // const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   // // Parse the input string
   // const [dayOfWeekShort, monthShort, dayOfMonth] = currentDay.split(' ');
   // const monthIndex = monthsShort.indexOf(monthShort);
   // const year = new Date().getFullYear(); // Assuming the current year for simplicity

   // // Construct the base date
   // const baseDate = currentDay === 'Today' ? new Date() : new Date(year, monthIndex, parseInt(dayOfMonth, 10));
   const {baseDate, weekDaysShort, monthsShort} = getDateFromShortFormat(currentDay);
   const today = new Date();
   
   const datesArray = [];

   // Generate days before
   for (let i = daysBefore; i > 0; i--) {
      const newDate = new Date(baseDate);
      newDate.setDate(baseDate.getDate() - i);
      const weekDayName = weekDaysShort[newDate.getDay()];
      const monthName = monthsShort[newDate.getMonth()];
      const dateOfMonth = newDate.getDate();
      const result = (newDate.getDate() === today.getDate() && newDate.getMonth() === today.getMonth() && newDate.getFullYear() === today.getFullYear()) ? `Today` : `${weekDayName} ${monthName} ${dateOfMonth}`;
      datesArray.push({
         text: result,
         value: result,
         isSelected: result === currentDay,
      });
   }

    // Generate current day and days after
   for (let i = 0; i <= daysAfter; i++) {
      const newDate = new Date(baseDate);
      newDate.setDate(baseDate.getDate() + i);
      const weekDayName = weekDaysShort[newDate.getDay()];
      const monthName = monthsShort[newDate.getMonth()];
      const dateOfMonth = newDate.getDate();
      const result = (newDate.getDate() === today.getDate() && newDate.getMonth() === today.getMonth() && newDate.getFullYear() === today.getFullYear()) ? `Today` : `${weekDayName} ${monthName} ${dateOfMonth}`;
      datesArray.push({
         text: result,
         value: result,
         isSelected: result === currentDay,
      });
   }
   
   return datesArray;
}

export const getFormatDate = (date) => {
   const weekDaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   const dayOfWeekShort = weekDaysShort[date.getDay()];
   const monthShort = monthsShort[date.getMonth()];
   const dayOfMonth = date.getDate();

   return `${dayOfWeekShort} ${monthShort} ${dayOfMonth}`;
}

export const getDateFromShortFormat = (date) => {
   const weekDaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   // Parse the input string
   const [dayOfWeekShort, monthShort, dayOfMonth] = date.split(' ');
   const monthIndex = monthsShort.indexOf(monthShort);
   const year = new Date().getFullYear(); // Assuming the current year for simplicity

   // Construct the base date
   const baseDate = date === 'Today' ? new Date() : new Date(year, monthIndex, parseInt(dayOfMonth, 10));
   return {baseDate, weekDaysShort, monthsShort};
}