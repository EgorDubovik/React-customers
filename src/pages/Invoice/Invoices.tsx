import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch} from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconEye from '../../components/Icon/IconEye';
import moment from 'moment';
import axiosClient from '../../store/axiosClient';

const Invoice = () => {
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(setPageTitle('Invoice List'));
   });
   const [items, setItems] = useState([]);

   const [page, setPage] = useState(1);
   const [totalRecords, setTotalRecords] = useState(0);
   const PAGE_SIZES = [10, 20, 30, 50, 100];
   const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
   const [initialRecords, setInitialRecords] = useState(sortBy(items, 'invoice'));
   const [records, setRecords] = useState(initialRecords);
   const [loadingStatus, setLoadingStatus] = useState('loading');
   const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
      columnAccessor: 'firstName',
      direction: 'asc',
   });

   useEffect(() => {
      setPage(1);
      /* eslint-disable react-hooks/exhaustive-deps */
   }, [pageSize]);

   // useEffect(() => {
   //    const from = (page - 1) * pageSize;
   //    const to = from + pageSize;
   //    console.log('Set Records');
   //    setRecords([...initialRecords.slice(from, to)]);
   // }, [page, pageSize, initialRecords]);

   useEffect(() => {
      const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
      setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
      // setPage(1);
   }, [sortStatus, initialRecords]);

   // load Ivocies
   useEffect(() => {
      setLoadingStatus('loading');
      axiosClient.get('invoice?page='+page+"&limit="+pageSize)
         .then((res:any) => {
            console.log('data:',res.data.invoices.data);
            setInitialRecords(res.data.invoices.data);
            setTotalRecords(res.data.invoices.total);
            setLoadingStatus('succsess');
         })
         .catch((err) => {
            setLoadingStatus('error');
            console.log(err);
         })

   }, [page, pageSize]);

   return (
      <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
         <div className="invoice-table">
            <div className="datatables pagination-padding">
               {loadingStatus === 'loading' && <div className='text-center mt-10'><span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span></div>}
               {loadingStatus === 'error' && 
                  <div>
                     <div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                        <span className="ltr:pr-2 rtl:pl-2">
                           <strong className="ltr:mr-1 rtl:ml-1">Woops!</strong>Something went wrong. Please try again or <a href="" onClick={()=>{window.location.reload(); }} className="underline">reload the page</a>
                        </span>
                     </div>
                  </div>
               }
               {loadingStatus === 'succsess' && 
               (
               <DataTable
                  className="whitespace-nowrap table-hover invoice-table"
                  records={records}
                  columns={[
                        {
                           accessor: 'invoice',
                           sortable: true,
                           render: ({ id }) => (
                              <NavLink to="/apps/invoice/preview">
                                 <div className="text-primary underline hover:no-underline font-semibold">{`#Invoice${id}`}</div>
                              </NavLink>
                           ),
                        },
                        // {
                        //    accessor: 'appointment',
                        //    sortable: true,
                        //    render: ({ appointment }) => (
                        //       <NavLink to="/apps/invoice/preview">
                        //          <div className="text-primary underline hover:no-underline font-semibold">{`#${appointment.id}`}</div>
                        //       </NavLink>
                        //    ),
                        // },
                        {
                           accessor: 'name',
                           sortable: true,
                           render: ({ customer_name, customer_id }) => (
                              <div className="flex items-center font-semibold">  
                                    <div>{customer_name} ({customer_id})</div>
                              </div>
                           ),
                        },
                        {
                           accessor: 'email',
                           sortable: true,
                        },
                        {
                           accessor: 'date',
                           sortable: true,
                           render: ({ created_at }) => (
                              <div className="font-semibold">{moment(created_at).format('MMMM Do YYYY, h:mm:ss a')}</div>
                           ),
                        },
                        {
                           accessor: 'amount',
                           sortable: true,
                           titleClassName: 'text-left',
                           render: ({ amount, id }) => <div className="text-left font-semibold">{`$${amount}`}</div>,
                        },
                        {
                           accessor: 'action',
                           title: 'Actions',
                           sortable: false,
                           textAlignment: 'center',
                           render: ({ id }) => (
                              <div className="flex gap-4 items-center w-max mx-auto">
                                    
                                    <NavLink to="/apps/invoice/preview" className="flex hover:text-primary">
                                       <IconEye />
                                    </NavLink>
                                   
                              </div>
                           ),
                        },
                  ]}
                  highlightOnHover
                  totalRecords={totalRecords}
                  recordsPerPage={pageSize}
                  page={page}
                  onPageChange={(p) => setPage(p)}
                  recordsPerPageOptions={PAGE_SIZES}
                  onRecordsPerPageChange={setPageSize}
                  sortStatus={sortStatus}
                  onSortStatusChange={setSortStatus}
                  paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
               />
               )}
            </div>
         </div>
      </div>
    );
};

export default Invoice;
