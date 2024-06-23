import { lazy } from 'react';
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
import DefaultLayout from '../components/Layouts/DefaultLayout';
import BlankLayout from '../components/Layouts/BlankLayout';
import AuthPrivetRoute from '../middleware/AuthPrivetRoute';
import Customers from '../pages/Customers/Customers';
import Services from '../pages/Services/Services';
import Schedule from '../pages/Schedule/Schedule';
import Appointment from '../pages/Schedule/Appointment';
const Error404 = lazy(() => import('../components/Error404'));
import CreateCustomer from '../pages/Customers/CreateCustomer';
import Create from '../pages/Invoice/Create';
import {Update as CustomerUpdate} from '../pages/Customers/Update';
import Invoices from '../pages/Invoice/Invoices';
const Employees = lazy(() => import('../pages/Employees'));
import CreateAppointment from '../pages/Schedule/CreateAppointment';
import ViewCustomer from '../pages/Customers/ViewCustomer';
import ProfilePage from '../pages/Profile/ProfilePage';
import PaymentsIndex from '../pages/Payments/PaymentsIndex';
import BookAppointment from '../pages/BookAppointment';
const BookAppointmentSettings = lazy(() => import('../pages/CompanySettings/BookAppointment/Index'));


const routes = [
    // dashboard
    {
        path: '/',
        element: <AuthPrivetRoute />,
        children : [
            {
                index : true,
                element : <DefaultLayout> <Dashboard /></DefaultLayout>,
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
                element : <DefaultLayout> <ViewCustomer /></DefaultLayout>,
            },
            {
                path: '/customer/update/:id',
                element : <DefaultLayout> <CustomerUpdate /></DefaultLayout>,
            },
            {
                path: '/customers/create',
                element : <DefaultLayout> <CreateCustomer /></DefaultLayout>,
            },
            {
                path: '/company-settings/services',
                element : <DefaultLayout> <Services /></DefaultLayout>,
            },
            {
                path: '/company-settings/book-online',
                element : <DefaultLayout> <BookAppointmentSettings /></DefaultLayout>,
            },
            {
                path: '/employees',
                element: <DefaultLayout> <Employees /></DefaultLayout>,
            },
            {
                path: '/profile',
                element: <DefaultLayout><ProfilePage /></DefaultLayout>,
            },
            {
                path: '/payments',
                element: <DefaultLayout><PaymentsIndex /></DefaultLayout>
            },
        ]
    },
    //Authentication
    {
        path: '/auth/signin',
        element: <BlankLayout><LoginBoxed /></BlankLayout>,
    },
    {
        path: '/appointment/book/:key',
        element: <BookAppointment />,
    },
    {
        path: '*',
        element: <BlankLayout><Error404 /></BlankLayout>,
    },
    
];

export { routes };
