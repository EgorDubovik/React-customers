import React,{createContext,useState} from "react";
import { CustomerContextType, CustomerInfoType, ServiceType, CompanyInfoType } from "./@types";

export const CustomerContext = createContext<CustomerContextType | null>(null);

const CustomerProvider = ({children}: {children: React.ReactNode}) => {

      const [services, setServices] = useState<ServiceType[]>([]);
      const [companyInfo, setCompanyInfo] = useState<CompanyInfoType>({
         name: '',
         phone: '',
         logo: '',
      });
      const [key, setKey] = useState<string>('');
      const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
      const [sliderIndex, setSliderIndex] = useState(1);
      const [customer, setCustomer] = useState<CustomerInfoType>({
         name: '',
         email: '',
         phone: '',
         address1: '',
         address2: '',
         city: '',
         state: '',
         zip: '',
      });
      const [workingTime, setWorkingTime] = useState(null);
      const [selectedServices, setSelectedServices] = useState<number[]>([]);

      const updateSelectedServices = (service_id:number) => {
         if(selectedServices.includes(service_id)){
            selectedServices.splice(selectedServices.indexOf(service_id), 1);
         } else {
            selectedServices.push(service_id);
         }
         setSelectedServices([...selectedServices]);
      }

      const updateCustomer = (newInfo:any) => {
         setCustomer({...customer, ...newInfo});
      }
      const updateKey = (key: string) => {
         setKey(key);
      }

      return (
         <CustomerContext.Provider value={{
            customer, 
            updateCustomer, 
            services, setServices, 
            selectedServices, updateSelectedServices,
            selectedDateTime, setSelectedDateTime,
            sliderIndex, setSliderIndex, 
            key, updateKey, 
            companyInfo, setCompanyInfo,
            workingTime, setWorkingTime
         }}>
               {children}
         </CustomerContext.Provider>
      );
}

export default CustomerProvider;
