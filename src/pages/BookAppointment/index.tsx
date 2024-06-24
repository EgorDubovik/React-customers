import CustomerProvider from "./CustomerContext";
import MainPage from "./MainPage";

const BookAppointment = () => {
   return (
      <CustomerProvider>
         <MainPage />
      </CustomerProvider>
   )
};
export default BookAppointment;
