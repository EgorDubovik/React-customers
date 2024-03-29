import React, { ReactElement, useEffect, useState } from 'react';
import {viewCurrency} from '../../../helpers/helper';
interface AutoCompleteProps {
   children: ReactElement;
   list: any;
   onInputChange: (value: string) => void;
   onSaggestionClick: (item: any) => void;
   inputValue: string;
 }
const AutoComplete = ({children, inputValue, list, onInputChange, onSaggestionClick}:AutoCompleteProps):ReactElement => {

   const [showSuggestions, setShowSuggestions] = useState(false);
   const [suggestions, setSuggestions] = useState([]); // list of suggestions
   const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1); // selected suggestion

   const InputChange = (e:any) => {
      const value = e.target.value;
      getSuggestions(value);
   }

   const onKeyDow = (e:any) => {
      if(e.key === 'ArrowDown'){
         if(selectedSuggestion < suggestions.length - 1){
            setSelectedSuggestion(selectedSuggestion + 1);
         } else {
            setSelectedSuggestion(0);
         }
      }else if(e.key === 'ArrowUp'){

         if(selectedSuggestion > 0){
            setSelectedSuggestion(selectedSuggestion - 1);
         } else {
            setSelectedSuggestion(suggestions.length - 1);
         }
      }else if(e.key === 'Enter'){
         if(selectedSuggestion !== null){
            suggestionClick(suggestions[selectedSuggestion]);
         }
      }
   }

   const getSuggestions = (value:string) => {
      if(value === ''){
         setSuggestions(list);
      }else{
         setSuggestions(list.filter((item:any) => item.title.toLowerCase().includes(value.toLowerCase())));
      }
      onInputChange(value);
   }

   useEffect(() => {
      getSuggestions(inputValue);
   },[]);

   const returnInput = () => {
      if(React.isValidElement(children) && children.type === 'input'){
         return React.cloneElement(children as ReactElement<any>, {
            value: inputValue,
            onChange: (e:any) => InputChange(e),
            onFocus: (e:any) => {
               getSuggestions(e.target.value);
               setShowSuggestions(true);
            },
            onBlur: () => setTimeout(()=>setShowSuggestions(false), 150),
            onKeyDown: (e:any) => onKeyDow(e)
         });
      
      }
      return children;
   }

   const suggestionClick = (item:any) => {
      
      onSaggestionClick(item);
      setShowSuggestions(false);
   }

   return (
      <div className='relative'>
         {returnInput()}
         <div className={'absolute '+(!showSuggestions ? 'hidden' : '')+' top-10 left-0 w-full dark:bg-zinc-900 z-50 rounded'}>
            <ul className='list'>
               {
                  suggestions.map((item:any, index:number) => (
                     <li key={index} className={'p-2 px-4 border-b dark:border-gray-700 cursor-pointer last:border-0 hover:dark:text-primary hover:dark:bg-zinc-950 flex justify-between '+(index === selectedSuggestion ? "dark:bg-zinc-950 dark:text-primary" : "")} onClick={()=>suggestionClick(item)}>
                        <div>{item.title}</div>
                        <div>{viewCurrency(item.price)}</div>
                     </li>
                  ))
               }
            </ul>
         </div>
      </div>
   )
}

export default AutoComplete;