import { useEffect, useState, useRef } from "react";
import { getHoursArray } from "./helper";

const Hour =(props:any) =>{
   const itemHeight = props.itemHeight || 40;
   const currentDate = props.currentDate || new Date();
   const viewItems = props.viewItems || 3;
   const is12AmPm = props.is12AmPm || true;
   const onHourChange = props.onHourChange || null;
      
   const getItemIndexTranslate = () => {
      return Math.round(curentTranslateY / itemHeight) * -1 + itemsView;
   }

   const getCurrentItemValue = () => {
      return items[indexTranslate-indexMarginTop].value;
   }

   const itemsView = (viewItems % 2 === 0) ? viewItems/2 : (viewItems-1)/2;
   const wrapperRef = useRef(null);
   const isDraging = useRef(false);
   const startY = useRef(0);
   const [items, setItems] = useState(getHoursArray(currentDate.getHours(), is12AmPm));
   const [curentTranslateY, setCurentTranslateY] = useState((items.length/2-itemsView) * -itemHeight);
   const [marginTop, setMarginTop] = useState(0);
   const [indexTranslate, setIndexTranslate] = useState(getItemIndexTranslate());
   const [indexMarginTop, setIndexMarginTop] = useState(0);
   const [index, setIndex] = useState(indexTranslate);
   
   useEffect(() => {
      setMarginTop((indexMarginTop * itemHeight));
      if(onHourChange) onHourChange(getCurrentItemValue());
   }, [indexMarginTop]);

   useEffect(() => {
      setItems(getHoursArray(getCurrentItemValue(), is12AmPm));
      setIndexMarginTop((indexTranslate - index));
   }, [indexTranslate]);

   useEffect(() => {
      setIndexTranslate(getItemIndexTranslate());
   }, [curentTranslateY]);

   const handleMouseDown = (e:any) => {
      
      isDraging.current = true;
      startY.current = e.clientY;
      wrapperRef.current.style.transition = 'transform 0s ease-out';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

   }
   const handleMouseMove = (e:any) => {
      
      if (!isDraging.current) return;
      const diff = e.clientY - startY.current;
      setCurentTranslateY(prev => prev + diff);
      startY.current = e.clientY;
   }
   const handleMouseUp = (e:any) => {
      isDraging.current = false;
      setCurentTranslateY(prev => Math.round(prev/itemHeight) * itemHeight);
      wrapperRef.current.style.transition = 'transform 0.5s ease-out';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
   }

   const handleOnWheel = (e:any) => {
      if (e.deltaY < 0) {
         setCurentTranslateY(prev => prev + itemHeight);
      } else {
         setCurentTranslateY(prev => prev - itemHeight);
      }
   }

   const handleClick = (ind:number) => {
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

export default Hour;