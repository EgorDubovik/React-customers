import React, { useState, useRef, useEffect } from "react";
interface AmPmWheelProps {
   itemHeight: number; 
   currentDate: Date; 
   viewItems: number; 
   onAmPmChange: (newAmPm: string) => void;
 }
const AmPmWheel = ({
      itemHeight,
      currentDate,
      viewItems,
      onAmPmChange,
   }:AmPmWheelProps) => {
   
   const getCurrentTranslateY = () => {
      return currentDate.getHours() < 12 ? itemHeight*itemsView : itemHeight* (itemsView-1);
   }
   const getAmPmArray = (index:number) => {
      const items = [
         { 
            text:"AM", 
            value:'AM',
            isSelected: index === 0
         },
         {
            text:"PM",
            value:'PM',
            isSelected: index === 1
         },
      ];
      return items;
   }
   const itemsView = (viewItems % 2 === 0) ? viewItems/2 : (viewItems-1)/2;
   const [curentTranslateY, setCurentTranslateY] = useState(getCurrentTranslateY());
   const [currentIndex, setCurrentIndex] = useState((Math.round(curentTranslateY/itemHeight) - itemsView) < 0 ? 1 : Math.round(curentTranslateY/itemHeight) - itemsView);
   const [marginTop, setMarginTop] = useState(0);
   const [items, setItems] = useState(getAmPmArray(currentDate.getHours() < 12 ? 0 : 1));
   const wrapperRef = useRef<HTMLDivElement>(null);
   const isDraging = useRef(false);
   const startY = useRef(0);

   useEffect(() => {
      setItems(getAmPmArray(currentIndex));
      
      if(onAmPmChange) onAmPmChange(items[currentIndex].value);
   }, [currentIndex]);

   useEffect(() => {
      let newCurrentIndex = Math.round(curentTranslateY/itemHeight) - itemsView
      newCurrentIndex = newCurrentIndex < 0 ? 1 : newCurrentIndex;
      
      setCurrentIndex(newCurrentIndex);
   }, [curentTranslateY]);

   const handleMouseDown = (e:any) => {
      isDraging.current = true;
      if(wrapperRef.current)
         wrapperRef.current.style.transition = 'transform 0s ease-out';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      startY.current = e.clientY;
   }
   const handleMouseMove = (e:any) => {
      if (!isDraging.current) return;
      const diff = e.clientY - startY.current;
      setCurentTranslateY(prev => {

         if(prev + diff < itemHeight * (itemsView-1)) return (itemsView-1) * itemHeight;
         if(prev + diff > itemHeight * itemsView) return (itemsView) * itemHeight;
         return prev + diff;
      });
      startY.current = e.clientY;
   }
   const handleMouseUp = (e:any) => {
      isDraging.current = false;
      setCurentTranslateY(prev => Math.round(prev/itemHeight) * itemHeight);
      if(wrapperRef.current)
         wrapperRef.current.style.transition = 'transform 0.5s ease-out';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
   }
   
   
   const handleClick = (index:number) => {
      if(onAmPmChange) onAmPmChange(items[index].value);
   }
   const handleOnWheel = (e:any) => {
      if(e.deltaY > 0){
         setCurentTranslateY(prev => {
            if(prev - itemHeight <= itemHeight * (itemsView-1) ) return (itemsView-1) * itemHeight;
            return prev - itemHeight;
         });
      }else{
         setCurentTranslateY(prev => {
            if(prev + itemHeight > itemHeight * itemsView) return itemHeight * itemsView;
            return prev + itemHeight;
         });
         
      }
   }

   useEffect(() => {
      return () => {
         document.removeEventListener('mousemove', handleMouseMove);
         document.removeEventListener('mouseup', handleMouseUp);
      }
   }, []);

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
export default AmPmWheel;