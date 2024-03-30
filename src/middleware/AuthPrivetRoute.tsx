import { Navigate, Outlet } from "react-router";
import {useIsAuthenticated} from 'react-auth-kit';

const AuthPrivetRoute = () => {
   
   const isAuthenticated = useIsAuthenticated()

   return isAuthenticated() ? <Outlet/> : <Navigate to='/auth/signin' />
}

export default AuthPrivetRoute;