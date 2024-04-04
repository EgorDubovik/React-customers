import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useSignIn} from 'react-auth-kit';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import axiosClient from '../../store/axiosClient';

const LoginBoxed = () => {

    const navigate = useNavigate();
    const signIn = useSignIn();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMesage, setErrorMessage] = useState('Somthing went wrong. Please try again.');
    const [error, setError] = useState(false);
    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    },[]);
    
    const [formData, setFormData] = useState({email: '', password: ''})
    
    const submitForm = (event: any) => {
        setLoading(true);
        event.preventDefault();
        axiosClient.post('/signin', formData)
            .then((res)=>{
                console.log(res);
                if(res.status === 200){
                    if(signIn({
                        token: res.data.success.token,
                        expiresIn:3600,
                        tokenType: "Bearer",
                        authState : {'name' : 'egor'},
                    })){
                        navigate('/customers');
                    }
                } else {
                    console.log('Error')
                }
            })
            .catch((err:any)=>{
                if(err.response.status === 403)
                    setErrorMessage(err.response.data.error);
                setError(true);
            })
            .finally(()=>{
                setLoading(false);
            });

    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        
                        <div className="mx-auto w-full max-w-[440px] relative">
                            
                            <div className="mb-8">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">SIGN IN</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            {error && (
                            <div className="flex mb-2 items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                                <span className="ltr:pr-2 rtl:pl-2">
                                    {errorMesage}
                                </span>
                            </div>)}
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="Email" onChange={(e)=>setFormData({...formData, email: e.target.value})} type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" onChange={(e)=>setFormData({...formData, password: e.target.value})} type="password" placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    {
                                    loading 
                                        ?
                                        (<div role='status'>
                                         <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg> Sending... </div>)
                                        :
                                        'Sign in'
                                    }
                                </button>
                            </form>
                            
                            <div className="text-center mt-10 dark:text-white">
                                Don't have an account ?&nbsp;
                                <Link to="/auth/signup" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN UP
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
