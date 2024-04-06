const Pagination = () => {
   
   return (
      <div className="mt-4 flex justify-between items-center dark:bg-[#1a294166] px-5 py-2 rounded">
         <div className="pageSize">page size</div>
         <div className="papagination">
            <div className='pagination-list flex gap-2'>
               <button className='page bg-gray-900 w-8 h-8 rounded-2xl text-center text-white'></button>
               <button className='page bg-primary w-8 h-8 rounded-2xl text-center text-white'>1</button>
               <button className='page bg-gray-900 w-8 h-8 rounded-2xl text-center text-white'>2</button>
               <button className='page bg-gray-900 w-8 h-8 rounded-2xl text-center text-white'></button>
            </div>
         </div>
      </div>
   );
}

export default Pagination;