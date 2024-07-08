import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconUserPlus from '../components/Icon/IconUserPlus';
import IconListCheck from '../components/Icon/IconListCheck';
import IconLayoutGrid from '../components/Icon/IconLayoutGrid';
import IconSearch from '../components/Icon/IconSearch';
import axiosClient from '../store/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import Dropdown from '../components/Dropdown';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import IconPencilPaper from '../components/Icon/IconPencilPaper';
import IconTrashLines from '../components/Icon/IconTrashLines';
import IconX from '../components/Icon/IconX';
import { CirclePicker } from 'react-color';
import { ButtonLoader } from '../components/loading/ButtonLoader';

const getTechAbr = (name:string) => {
   return name.split(' ').map((n:string) => n[0]).join('');
}

const Employees = () => {
   const dispatch = useDispatch();
   const navigator = useNavigate();
   useEffect(() => {
      dispatch(setPageTitle('Employees'));
   });
   
   const rolesTitle = useSelector((state: IRootState) => state.themeConfig.rolesTitle);
   const rolesColor = useSelector((state: IRootState) => state.themeConfig.rolesColor);
   const user = useSelector((state: IRootState) => state.themeConfig.user);
   
   const [modal, setModal] = useState(false);
   const [viewType, setViewType] = useState<string>(localStorage.getItem('customerViewType') ||'grid');
   const [rolesForm, setRolesForm] = useState<number[]>([]);
   const [dataForm, setDataForm] = useState<any>({
      id : '',
      name : '',
      email : '',
      phone : '',
      pass1 : '',
      pass2 : '',
      rolesArray : [2],
      color : '#1565c0'
   });

   const changeViewType = (type: string) =>{
      localStorage.setItem('customerViewType',type);
      setViewType(type);
   }

   const deleteUser = (user: any = null) => {
      
   };

   const [search, setSearch] = useState<any>('');
   const [employees, setEmployees] = useState<any[]>([]);
   const [filteredItems, setFilteredItems] = useState<any>(employees);
   const [loadingDataForm, setLoadingDataForm] = useState(false);

   useEffect(()=>{
      axiosClient.get('/employees')
         .then((res)=>{
            
            if(res.status == 200){
               setEmployees(res.data.employees);
            }
         })
         .catch((err)=>{
            console.log(err);
         });
   },[]);

   useEffect(() => {
      setFilteredItems(() => {
         return employees.filter((item: any) => {
            return item.name.toLowerCase().includes(search.toLowerCase());
         });
      });
   }, [search, employees]);    


   const chooseRole = (role: number) => {
      if(dataForm.rolesArray.includes(role)){
         setDataForm({...dataForm, rolesArray:dataForm.rolesArray.filter((r:number) => r !== role)});
      }else{
         setDataForm({...dataForm, rolesArray:[...dataForm.rolesArray, role]});
      }
      console.log(rolesForm)
   }

   const editEmployee = (employee: any = null) => {
      
      setDataForm(employee);
      setModal(true);
   }

   const deleteEmployee = (employee: any = null) => {
         
   }
   const saveEmployee = () => {
      if(dataForm.id){
         setLoadingDataForm(true);
         axiosClient.put(`/employees/${dataForm.id}`, dataForm)
            .then((res) => {
               setEmployees(employees.map((employee) => {
                  if(employee.id === dataForm.id){
                     return dataForm;
                  }
                  return employee;
               }));
               showMessage('Employee updated successfully');
               setModal(false);
            })
            .catch((err) => {
               console.log(err);
               showMessage('Something went wrong. Please try again later', 'error');
            })
            .finally(() => {
               setLoadingDataForm(false);
            });
      } else {
         setLoadingDataForm(true);
         axiosClient.post('/employees', dataForm)
            .then((res) => {
               setEmployees([...employees, res.data.employee]);
               showMessage('Employee added successfully');   
               setModal(false);
            })
            .catch((err) => {
               console.log(err);
               showMessage('Something went wrong. Please try again later', 'error');
            })
            .finally(() => {
               setLoadingDataForm(false);
            });
      }
      
   }

   const addNewEmployee = () => {
      setDataForm({
         id : '',
         name : '',
         email : '',
         phone : '',
         pass1 : '',
         pass2 : '',
         rolesArray : [2],
         color : '#1565c0'
      });
      setModal(true);
   }

   const changeValue = (e: any) => {
      setDataForm({...dataForm, [e.target.name]: e.target.value});
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
            <h2 className="text-xl">Employees</h2>
            <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
               <div className="flex gap-3">
                  <div>
                     {user.roles.includes(1) && (
                        <button type="button" className="btn btn-primary" onClick={() => addNewEmployee()}>
                           <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                           Add Employee
                        </button>
                     )}
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
                              <th></th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Email</th>
                              <th>Roles</th>
                              <th className="!text-center">Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {filteredItems.map((employee: any) => {
                              return (
                                 <tr key={employee.id}>
                                    <td>
                                       <span className="flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-'bg-danger text-white" style={{ backgroundColor:employee.color }} >
                                          {getTechAbr(employee.name)}
                                       </span>
                                    </td>
                                    <td>
                                       <div className="flex items-center w-max">
                                          <div className='font-bold'>{employee.name}</div>
                                       </div>
                                    </td>
                                    <td>{employee.phone}</td>
                                    <td className="whitespace-nowrap">{employee.email}</td>
                                    <td>
                                       {
                                          employee.rolesArray.map((role:number, index:number) => (
                                             <span key={index} className={`badge badge-outline-${rolesColor[role]} ml-2`}>{rolesTitle[role]}</span>
                                          ))
                                       }
                                    </td>
                                    <td>
                                       
                                       {user.roles.includes(1) && (
                                          <div className="flex gap-4 items-center justify-center">
                                             <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editEmployee(employee)}>
                                                Edit
                                             </button>
                                             <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteEmployee(employee)}>
                                                Delete
                                             </button>
                                          </div>
                                       )}
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
                  {filteredItems.map((employee: any) => {
                     return (
                           <div className="bg-white dark:bg-[#1a294166] rounded-md shadow" key={employee.id}>
                              <div className="p-4">
                                 <div className='flex items-center relative'>
                                    {user.roles.includes(1) && (
                                    <div className='absolute top-0 right-0 z-10'>
                                       <div className="dropdown">
                                          <Dropdown
                                             offset={[0, 5]}
                                             btnClassName="align-middle"
                                             button={<IconHorizontalDots className="rotate-90 opacity-70" />}
                                          >
                                             <ul className="whitespace-nowrap">
                                                <li>
                                                   <button type="button" onClick={() => editEmployee(employee)}>
                                                         <IconPencilPaper className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                         Edit
                                                   </button>
                                                </li>
                                                <li>
                                                   <button type="button" onClick={() => deleteEmployee(employee)}>
                                                         <IconTrashLines className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                                         Delete
                                                   </button>
                                                </li>
                                             </ul>
                                          </Dropdown>
                                       </div>
                                    </div>
                                    )}
                                    <div className='avatar'>
                                       <span className="flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-'bg-danger text-white" style={{ backgroundColor:employee.color }} >{getTechAbr(employee.name)}</span>
                                    </div>
                                    <div className='ml-2 w-full overflow-hidden'>
                                       <div className='user-info'>
                                          <div className='user-name w-full font-bold dark:text-white'>
                                             {employee.name}
                                             {
                                                employee.rolesArray.map((role:number, index:number) => (
                                                   <span key={index} className={`badge badge-outline-${rolesColor[role]} ml-2 text-[10px]`} onClick={()=>chooseRole(index)}>{rolesTitle[role]}</span>
                                                ))
                                             }
                                          </div>
                                       </div>
                                       <div className='user-address mt-2 ml-1'>
                                          {employee.phone}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                     );
                  })}
               </div>
         )}

         <Transition appear show={modal} as={Fragment}>
               <Dialog as="div" open={modal} onClose={() => setModal(false)} className="relative z-[51]">
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
                                       onClick={() => setModal(false)}
                                       className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                 >
                                       <IconX />
                                 </button>
                                 <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                    {dataForm.id ? 'Edit Contact' : 'Add Contact'}
                                 </div>
                                 <div className="p-5">
                                    <form>
                                       <div className="mb-5">
                                          <label htmlFor="name">Name</label>
                                          <input id="name" type="text" name='name' placeholder="Enter Name" className="form-input" value={dataForm.name} onChange={(e) => changeValue(e)} />
                                       </div>
                                       <div className="mb-5">
                                          <label htmlFor="email">Email</label>
                                          <input id="email" type="email" name='email' placeholder="Enter Email" className="form-input" value={dataForm.email} onChange={(e) => changeValue(e)} />
                                       </div>
                                       <div className="mb-5">
                                          <label htmlFor="number">Phone Number</label>
                                          <input id="phone" type="text" name='phone' placeholder="Enter Phone Number" className="form-input" value={dataForm.phone} onChange={(e) => changeValue(e)} />
                                       </div>
                                       <div className="mb-5">
                                          <label htmlFor="pass1">Password</label>
                                          <input id="pass1" type="password" name='pass1' placeholder="Enter Password" className="form-input" value={dataForm.pass1} onChange={(e) => changeValue(e)} />
                                       </div>
                                       <div className="mb-5">
                                          <label htmlFor="pass2">Confirm password</label>
                                          <input id="pass2" type="password" name='pass2' placeholder="Confirm password" className="form-input" value={dataForm.pass2} onChange={(e) => changeValue(e)} />
                                       </div>
                                       <div className='mb-5'>
                                          <span>Choose role:</span>
                                          {
                                             rolesTitle.map((role:string, index:number) => {
                                                if(index === 0) return;
                                                return (  
                                                   <span key={index} className={`badge cursor-pointer ${dataForm.rolesArray.includes(index) ? "bg" : "badge-outline"}-${rolesColor[index]} ml-4`} onClick={()=>chooseRole(index)}>{rolesTitle[index]}</span>
                                                )
                                             })
                                          }
                                       </div>
                                       <div className='mt-8'>
                                          <label htmlFor="color">Choose Color:</label>
                                       </div>
                                       <div className='choose-color mb-5 flex justify-center items-center'>
                                          <div className=''>
                                             <span className="flex justify-center items-center w-10 h-10 text-center rounded-full object-cover bg-'bg-danger text-white" style={{ backgroundColor:dataForm.color }} >{getTechAbr(dataForm.name)}</span>
                                          </div>
                                          <div className='ml-10'>
                                             <CirclePicker 
                                                onChangeComplete = {(color) => setDataForm({...dataForm, color:color.hex})}
                                                colors={["#1565c0", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#00bcd4", "#009688", "#4caf50", "#60b300", "#ff9800", "#ff5722"]}
                                             />
                                          </div>
                                       </div>
                                       <div className="flex justify-end items-center mt-8">
                                          <button type="button" className="btn btn-outline-danger" onClick={() => setModal(false)}>
                                                Cancel
                                          </button>
                                          <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveEmployee}>
                                             {dataForm.id ? 'Update' : 'Add'}
                                             {loadingDataForm && <ButtonLoader />}
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

export default Employees;
