import { useContext, useState } from 'react';
import { viewCurrency } from '../../helpers/helper';
import IconTrash from '../../components/Icon/IconTrash';
import axiosClient from '../../store/axiosClient';
import {ButtonLoader} from '../../components/loading/ButtonLoader';
import { useAppointmentContext } from '../../context/AppointmentContext';
import { SmallDangerLoader } from '../../components/loading/SmallCirculeLoader';
import { IExpense } from '../../types';


const Expense = (props:any) => {
   const COST_DEFAULT = '$0.00';

   const {appointment} = useAppointmentContext();
   const [expensesList, setExpensesList] = useState<IExpense[]>(appointment?.expenses || []);
   const [formData, setFormData] = useState<IExpense>({title: '', amount: 0, id: 0});
   const [cost, setCost] = useState(COST_DEFAULT);
   
   const [storeStatus, setStoreStatus] = useState(false)
   const [removeExpenseId, setRemoveExpenseId] = useState(0);


   const costInput = (e:any) => {
      const value = parseFloat(e.target.value.replace(/\D/g, ''))/100;
      setCost(viewCurrency(value));
      setFormData({...formData, amount: value});
   }
   const onKeyPress = (e:any) => {
      if(e.key === 'Enter')
         addExpense();
   }

   const formDataChange = (e:any) => {
      setFormData({...formData, [e.target.name]: e.target.value});
   }

   const addExpense = () => {
      if(storeStatus) return;
      if(formData.title === '' || formData.amount === 0) return;
      setStoreStatus(true);
      axiosClient.post(`/appointment/expense/${appointment?.job_id}`, formData)
      .then((res) => {
         if(res.status === 200){
            console.log(res.data.expanse);
            setExpensesList([...expensesList, res.data.expanse]);
            setFormData({title: '', amount: 0, id: 0});
            setCost(COST_DEFAULT);
         }
      })
      .catch((err) => {
         console.log(err);
      })
      .finally(() => {
         setStoreStatus(false);
      });
   }

   const removeExpense = (id:number) => {
      setRemoveExpenseId(id);
      axiosClient.delete(`/appointment/expense/${id}`)
      .then((res) => {
         if(res.status === 200){
            setExpensesList(expensesList.filter((expense) => expense.id !== id));
         }
      })
      .catch((err) => {
         console.log(err);
      })
      .finally(() => {
         setRemoveExpenseId(0);
      });
   }


	return (
		<div className="panel p-4">
			<h3 className="font-semibold text-lg dark:text-white-light">Expense</h3>
         <div className="flex justify-between mt-4 gap-4">
            <div className="w-3/5">
               <input className="form-input" value={formData.title} placeholder="Part number" name='title' onChange={formDataChange} onKeyDown={onKeyPress} />
            </div>
            <div className="">
               <input className="form-input" value={cost} placeholder="Cost" name='cost' onChange={costInput} onKeyDown={onKeyPress}/>
            </div>
            <div className="">
               <button className="btn btn-primary" onClick={addExpense}>
                  {storeStatus ? <ButtonLoader /> : 'Add'}
                  
               </button>
            </div>
         </div>
         <div className="mt-4">
            <div className='grid grid-cols-3 gap-2'>
               <div className='col-span-2'>
                  {expensesList.map((expense, index) => (
                     <div key={index} className="grid grid-cols-4 mt-3 border-b border-gray-700 p-2 rounded">
                        <div className="text-sm font-semibold col-span-2">{expense.title}</div>
                        <div className="text-sm font-semibold text-center">{viewCurrency(expense.amount)}</div>
                        <div className="action flex justify-end">
                           <span className='text-danger cursor-pointer' onClick={() => removeExpense(expense.id)}>
                              {removeExpenseId === expense.id ? <SmallDangerLoader /> :<IconTrash/>}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
               <div className='flex items-center justify-center j-full mt-2'>
                  <div className='text-center'>
                     <p className='text-xl font-bold'>{viewCurrency(expensesList.reduce((acc, cur) => acc + parseFloat(cur.amount.toString()), 0))}</p>
                     <p>total</p>
                  </div>
               </div>
            </div>
            
         </div>
		</div>
	);
};

export default Expense;
