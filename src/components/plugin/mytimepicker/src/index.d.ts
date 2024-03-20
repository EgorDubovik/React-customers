import React from "react";

interface MyTimePickerProps {
   date: string;
   onDateChange: (date: string) => void;
}

declare const MyTimePicker: React.FC<MyTimePickerProps>;
export default MyTimePicker;