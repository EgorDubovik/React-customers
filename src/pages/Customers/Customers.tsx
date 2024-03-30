import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconListCheck from '../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../components/Icon/IconLayoutGrid';
import IconSearch from '../../components/Icon/IconSearch';
import axiosClient from '../../store/axiosClient';
import { Link, useNavigate } from 'react-router-dom';

const Contacts = () => {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    useEffect(() => {
        dispatch(setPageTitle('Customers'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);

    const [viewType, setViewType] = useState<string>(localStorage.getItem('customerViewType') ||'grid');

    const changeViewType = (type: string) =>{
      localStorage.setItem('customerViewType',type);
      setViewType(type);
    }

    const addNewCustomer = () => {
        navigator('/customers/create');
    };

    const deleteUser = (user: any = null) => {
        
    };

    const [search, setSearch] = useState<any>('');
    const [customers, setCustomers] = useState<any>([]);
    const [filteredItems, setFilteredItems] = useState<any>(customers);

    useEffect(()=>{
      axiosClient.get('/customers')
         .then((res)=>{
            if(res.status == 200){
                setCustomers(res.data);
            }
         });
    },[]);

    useEffect(() => {
        setFilteredItems(() => {
            return customers.filter((item: any) => {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, customers]);    

    const editUser = (customer: any = null) => {
        navigator('/customer/'+customer.id);
    }

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Customers</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => addNewCustomer()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Customer
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${viewType === 'list' && 'bg-primary text-white'}`} onClick={() => changeViewType('list')}>
                                <IconListCheck />
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${viewType === 'grid' && 'bg-primary text-white'}`} onClick={() => changeViewType('grid')}>
                                <IconLayoutGrid />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Contacts" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {viewType === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Location</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((customer: any) => {
                                    return (
                                        <tr key={customer.id}>
                                            <td>{customer.id}</td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    { /* <div className="grid place-content-center h-8 w-8 ltr:mr-2 rtl:ml-2 rounded-full bg-primary text-white text-sm font-semibold"></div> */}
                                                    <div className='font-bold'>
                                                        <Link to={`/appointment/create/${customer.id}`}>
                                                            {customer.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{customer.phone}</td>
                                            <td className="whitespace-nowrap">{customer.email}</td>
                                            <td className="whitespace-nowrap">{customer.address[0].full}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(customer)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(customer)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {viewType === 'grid' && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                    {filteredItems.map((customer: any) => {
                        return (
                            <div className="bg-white dark:bg-[#1a294166] rounded-md overflow-hidden shadow" key={customer.id}>
                                 <div className="p-2">
                                    <div className='user-info flex'>
                                       
                                       <div className='user-name w-3/4 font-bold dark:text-white'>{customer.name}</div>
                                    </div>
                                    <div className='user-address mt-3 ml-1'>
                                       {customer.address[0].full}
                                    </div>
                                 </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Contacts;
