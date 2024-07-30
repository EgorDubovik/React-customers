import { useState } from 'react';
import { viewCurrency } from '../../../helpers/helper';
import IconTrash from '../../../components/Icon/IconTrash';

interface IExpense {
   partNumber: string;
   cost: number;
}

const Expense = () => {
   const [expensesList, setExpensesList] = useState<IExpense[]>([]);
   const [formData, setFormData] = useState<IExpense>({partNumber: '', cost: 0});
   

   const onKeyPress = (e:any) => {
      if(e.key === 'Enter')
         addExpense();

   }

   const formDataChange = (e:any) => {
      setFormData({...formData, [e.target.name]: e.target.value});
   }

   const addExpense = () => {
      if(formData.partNumber === '' || formData.cost === 0) return;
      setExpensesList([...expensesList, formData]);
      setFormData({partNumber: '', cost: 0});
   }


	return (
		<div className="panel p-4">
			<h3 className="font-semibold text-lg dark:text-white-light">Expense</h3>
         <div className="flex justify-between mt-4 gap-4">
            <div className="w-3/5">
               <input className="form-input" value={formData.partNumber} placeholder="Part number" name='partNumber' onChange={formDataChange} onKeyDown={onKeyPress} />
            </div>
            <div className="">
               <input className="form-input" value={formData.cost} placeholder="Cost" name='cost' onChange={formDataChange} onKeyDown={onKeyPress}/>
            </div>
            <div className="">
               <button className="btn btn-primary" onClick={addExpense}>Add</button>
            </div>
         </div>
         <div className="mt-4">
            <div className='grid grid-cols-3 gap-2'>
               <div className='col-span-2'>
                  {expensesList.map((expense, index) => (
                     <div key={index} className="grid grid-cols-4 mt-3">
                        <div className="text-sm font-semibold col-span-2">{expense.partNumber}</div>
                        <div className="text-sm font-semibold">{viewCurrency(expense.cost)}</div>
                        <div className="action text-danger">
                           <IconTrash />
                        </div>
                     </div>
                  ))}
               </div>
               <div className='flex items-center justify-center j-full mt-2'>
                  <div className='text-center'>
                     <p className='text-xl font-bold'>{viewCurrency(expensesList.reduce((acc, cur) => acc + parseFloat(cur.cost.toString()), 0))}</p>
                     <p>total</p>
                  </div>
               </div>
            </div>
            
         </div>
		</div>
	);
};

export default Expense;
