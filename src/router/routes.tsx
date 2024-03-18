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
import Services from '../pages/Services/Services';
import Schedule from '../pages/Apps/Schedule/Schedule';
import Appointment from '../pages/Apps/Schedule/Appointment';
import Error404 from '../pages/Pages/Error404';
import CreateCustomer from '../pages/Customers/CreateCustomer';
import Create from '../pages/Invoice/Create';
import Update from '../pages/Customers/Update';
import Invoices from '../pages/Invoice/Invoices';
import Employees from '../pages/Employees';
import CreateAppointment from '../pages/Apps/Schedule/CreateAppointment';


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
                path: '/appointment/:id',
                element : <DefaultLayout> <Appointment /></DefaultLayout>,
            },
            {
                path: 'appointment/create/:customerId',
                element : <DefaultLayout> <CreateAppointment /></DefaultLayout>,
            },
            {
                path: 'invoice/send/:appointmentId',
                element : <DefaultLayout> <Create /></DefaultLayout>,
            },
            {
                path:'invoices',
                element : <DefaultLayout> <Invoices /></DefaultLayout>,
            },
            {
                path: '/customers',
                element : <DefaultLayout> <Customers /></DefaultLayout>,
            },
            {
                path: '/customer/:id',
                element : <DefaultLayout> <Update /></DefaultLayout>,
            },
            {
                path: '/customers/create',
                element : <DefaultLayout> <CreateCustomer /></DefaultLayout>,
            },
            {
                path: '/services',
                element : <DefaultLayout> <Services /></DefaultLayout>,
            },
            {
                path: '/employees',
                element: <DefaultLayout> <Employees /></DefaultLayout>,
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
        element: <BlankLayout><Error404 /></BlankLayout>,
    },
];

export { routes };
