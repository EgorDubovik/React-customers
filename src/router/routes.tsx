import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));
const RecoverIdBoxed = lazy(() => import('../pages/Authentication/RecoverIdBox'));
const Error = lazy(() => import('../components/Error'));
import DefaultLayout from '../components/Layouts/DefaultLayout';
import BlankLayout from '../components/Layouts/BlankLayout';
import AuthPrivetRoute from '../middleware/AuthPrivetRoute';
import Customers from '../pages/Customers/Customers';
import Services from '../pages/Customers/Services';
import Schedule from '../pages/Customers/Schedule';
import Contacts from '../pages/Apps/Contacts';


const routes = [
    // dashboard
    {
        path: '/',
        element: <AuthPrivetRoute />,
        children : [
            {
                index : true,
                element : <DefaultLayout> <Index /></DefaultLayout>,
            },
            {
                path: '/schedule',
                element : <DefaultLayout> <Schedule /></DefaultLayout>,
            },
            {
                path: '/customers',
                element : <DefaultLayout> <Customers /></DefaultLayout>,
            },
            {
                path: '/services',
                element : <DefaultLayout> <Services /></DefaultLayout>,
            },
            
        ]
    },
    //Authentication
    {
        path: '/auth/signin',
        element: <BlankLayout><LoginBoxed /></BlankLayout>,
    },
    {
        path: '/auth/signup',
        element: <BlankLayout><RegisterBoxed /></BlankLayout>,
    },
    
    {
        path: '/auth/password-reset',
        element: <BlankLayout><RecoverIdBoxed /></BlankLayout>,
    },
    
    {
        path: '*',
        element: <BlankLayout><Error /></BlankLayout>,
    },
];

export { routes };
