import { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store'; 
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import axiosClient from '../../store/axiosClient';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import { SmallDangerLoader } from '../../components/loading/SmallCirculeLoader';
import Swal from 'sweetalert2';



const Services = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Services'));
    });
    

    const [loading,setLoading] = useState(false);
    const [loadingRequest,setLoadingRequest] = useState(false);
    const [error,setError] = useState(false);
    const [services,setServices] = useState<any[]>([]);
    const [addContactModal, setAddContactModal] = useState(false);
    const [service, setService] = useState({id: null, title:'',description:'',price:''});
    const [emptyTitle,setEmptyTitle] = useState(false);
    const [emptyPrice,setEmptyPrice] = useState(false);
    const [userRole, setUserRole] = useState<String[]>([]);
    const [removeService, setRemoveService] = useState<number>(0);
    const [updateService, setUpdateService] = useState({
        id: null,
        title: '',
        price: '',
        description: '',
    });
    const fetchServices = () => {
        setLoading(true);
        axiosClient.get("company/settings/services")
            .then((response)=>{
                setUserRole(response.data.userRols);
                setServices(response.data.services);
            })
            .catch((error)=>{
                console.error('Error:', error);
                setError(true);
            })
            .finally(()=>{
                setLoading(false);
                
            });
    }

    useEffect(()=>{
        fetchServices();
    },[]);

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

    const addservice = () => {
        setService({id: null, title:'',description:'',price:''});
        setAddContactModal(true);
    }

    const onChange = (e: any) => {
        if(e.target.name === 'title' && emptyTitle)
            setEmptyTitle(false);
        if(e.target.name === 'price' && emptyPrice)
            setEmptyPrice(false);
        setService({ ...service, [e.target.name]: e.target.value });
    }

    const saveService = () => {
        if(!loadingRequest){
            let empty = false;
            if(!service.title?.trim()){
                setEmptyTitle(true);
                empty = true;
            }
            if(!service.price?.trim()){
                setEmptyPrice(true);
                empty = true;
            }
            
            if(empty)  return;
            
            if(service.id){
                setLoadingRequest(true);
                axiosClient.put('company/settings/services/'+service.id,service)
                .then((response)=>{
                    setAddContactModal(false);
                    for(let i=0; i<services.length; i++){
                        if(services[i].id === service.id){
                            services[i] = service;
                            break;
                        }
                    }
                    setServices([...services]);
                })
                .catch((error)=>{
                    console.error('Error:', error);
                    showMessage('Somthing went wrong. Please try again.','error');
                })
                .finally(()=>{
                    
                    setLoadingRequest(false);
                });
            } else {
                setLoadingRequest(true);
                axiosClient.post('company/settings/services',service)
                .then((response)=>{
                    setAddContactModal(false);
                    services.unshift(response.data.service);
                    setServices([...services]);
                })
                .catch((error)=>{
                    console.error('Error:', error);
                    showMessage('Somthing went wrong. Please try again.','error');
                })
                .finally(()=>{
                    setLoadingRequest(false);
                });
            }
        }
    }

    const editService = (id:number) => {
        for(let i=0; i<services.length; i++){
            if(services[i].id === id){
                setService(services[i]);
                break;
            }
        }
        setAddContactModal(true);
    }

    const deleteService = (id:number) => {
        setRemoveService(id);
        axiosClient.delete('company/settings/services/'+id)
        .then((response)=>{
            for(let i=0; i<services.length; i++){
                if(services[i].id === id){
                    services.splice(i,1);
                    setServices([...services]);
                    break;
                }
            }
        }).catch((error)=>{
            alert('Somthing went wrong. Please try again.');
            console.error('Error:', error);
        })
        .finally(()=>{
            setRemoveService(0);
        });
        
    }
    
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Company services</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            { (userRole.includes('Admin') || userRole.includes('Dispatcher')) &&
                                <button type="button" className="btn btn-primary" onClick={() => addservice()}>
                                    <IconPlus className="ltr:mr-2 rtl:ml-2" />
                                    Add New service
                                </button>
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
            {
            loading ? (
                    <div className='text-center mt-10'>
                        <div role="status">
                            <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) :

                
                error ? (
                    <div className="flex mt-6 mb-2 items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                        <span className="ltr:pr-2 rtl:pl-2">
                            <strong className="ltr:mr-1 rtl:ml-1">Whoops!</strong>Somthing went wrong. Please try again.
                        </span>
                    </div>
                )

                :

                ( 
                   <div className="mt-5 panel p-0 border-0 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th className='text-gray-400'>Title</th>
                                        <th className='text-gray-400'>Description</th>
                                        <th className='text-gray-400'>Price</th>
                                        <th className="!text-center text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((service : any,index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="flex items-center w-max">
                                                        { /* <div className="grid place-content-center h-8 w-8 ltr:mr-2 rtl:ml-2 rounded-full bg-primary text-white text-sm font-semibold"></div> */}
                                                        <div className='font-bold'>{service.title}</div>
                                                    </div>
                                                </td>
                                                <td>{service.description}</td>
                                                <td className="whitespace-nowrap">${service.price}</td>
                                                
                                                <td>
                                                    
                                                    {(userRole.includes('Admin') || userRole.includes('Dispatcher')) 
                                                        ?
                                                        (
                                                            <div className="flex gap-4 items-center justify-center">
                                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editService(service.id)}>
                                                                    Edit
                                                                </button>
                                                                {
                                                                    removeService === service.id
                                                                        ? <SmallDangerLoader />
                                                                        :
                                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteService(service.id)}>
                                                                            Delete
                                                                        </button>
                                                                }
                                                            </div>
                                                        )
                                                        :    
                                                            <div className='text-gray-400 text-center'>No action</div>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {service.id ? 'Edit Service' : 'Add Service'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className={"mb-5 "+(emptyTitle ? 'has-error': '')}>
                                                <label htmlFor="name">Title</label>
                                                <input id="title" name='title' value={service.title} type="text" placeholder="Enter Title" className="form-input" onChange={(e) => {onChange(e)}} />
                                            </div>
                                            <div className={"mb-5 "+(emptyPrice ? 'has-error': '')}>
                                                <label htmlFor="email">Price</label>
                                                <input id="price" name='price' value={service.price} type="number" placeholder="Enter price" className="form-input" onChange={(e) => {onChange(e)}} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address">Dfescription</label>
                                                <textarea
                                                    name='description'
                                                    value={service.description}
                                                    rows={2}
                                                    placeholder="Enter Address"
                                                    className="form-textarea resize-none min-h-[70px]"
                                                    onChange={(e) => {onChange(e)}}
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveService}>
                                                    { service.id ? 'Update' : 'Save'}
                                                    {loadingRequest &&  <div role='status'><ButtonLoader /></div>}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Services;
