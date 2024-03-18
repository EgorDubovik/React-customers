import { useEffect, useState, useRef } from "react";
import { getDaysNameArray } from "./helper";
import { getFormatDate } from "./helper";
const DaysNameWheel =({
      itemHeight,
      currentDate,
      viewItems,
      onDaysNameChange,
   }) =>{
   
   const getItemIndexTranslate = () => {
      return Math.round(curentTranslateY / itemHeight) * -1 + itemsView;
   }

   const getCurrentItemValue = () => {
      return items[indexTranslate-indexMarginTop].value;
   }

   const getItemsArray = (curentElelemt) => {
      return getDaysNameArray(curentElelemt);
   }

   const itemsView = (viewItems % 2 === 0) ? viewItems/2 : (viewItems-1)/2;
   const wrapperRef = useRef(null);
   const isDraging = useRef(false);
   const startY = useRef(null);
   const [items, setItems] = useState(getItemsArray(getFormatDate(currentDate)));
   const [curentTranslateY, setCurentTranslateY] = useState((items.length/2-itemsView) * -itemHeight);
   const [marginTop, setMarginTop] = useState(0);
   const [indexTranslate, setIndexTranslate] = useState(getItemIndexTranslate());
   const [indexMarginTop, setIndexMarginTop] = useState(0);
   const [index, setIndex] = useState(indexTranslate);
   
   useEffect(() => {
      setMarginTop((indexMarginTop * itemHeight));
      if(onDaysNameChange) onDaysNameChange(getCurrentItemValue());
   }, [indexMarginTop]);

   useEffect(() => {
      setItems(getItemsArray(getCurrentItemValue()));
      setIndexMarginTop((indexTranslate - index));
   }, [indexTranslate]);

   useEffect(() => {
      setIndexTranslate(getItemIndexTranslate());
   }, [curentTranslateY]);

   const handleMouseDown = (e) => {
      
      isDraging.current = true;
      startY.current = e.clientY;
      wrapperRef.current.style.transition = 'transform 0s ease-out';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

   }
   const handleMouseMove = (e) => {
      
      if (!isDraging.current) return;
      const diff = e.clientY - startY.current;
      setCurentTranslateY(prev => prev + diff);
      startY.current = e.clientY;
   }
   const handleMouseUp = (e) => {
      isDraging.current = false;
      setCurentTranslateY(prev => Math.round(prev/itemHeight) * itemHeight);
      wrapperRef.current.style.transition = 'transform 0.5s ease-out';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
   }

   const handleOnWheel = (e) => {
      if (e.deltaY < 0) {
         setCurentTranslateY(prev => prev + itemHeight);
      } else {
         setCurentTranslateY(prev => prev - itemHeight);
      }
   }

   const handleClick = (ind) => {
      const indaxDiff = index - ind;
      setCurentTranslateY(prev => prev + (indaxDiff * itemHeight));  
   }

   useEffect(() => {
      return () => {
         document.removeEventListener('mousemove', handleMouseMove);
         document.removeEventListener('mouseup', handleMouseUp);
       };
   },[]);

   return (
      <div className="picker-wheel">
         <div className="picker-wheel-middel-line" style={{ height:itemHeight+"px" }}></div>
         <div 
            onMouseDown={handleMouseDown}
            ref = {wrapperRef} 
            onWheel={handleOnWheel}
            className="picker-wheel-items" 
            style={{ transform:'translateY('+curentTranslateY+'px)',marginTop:marginTop+'px'}}>
            {items.map((item, index) => (
               <div onClick={()=>handleClick(index)} key={index} className="picker-wheel-item" style={{ height: itemHeight+"px" }}>
                  <div className={`picker-wheel-item-inner ${item.isSelected ? 'active' : ''}`}>{item.text}</div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default DaysNameWheel;