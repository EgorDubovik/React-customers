export interface CustomerContextType {
   key : string;
   updateKey: (key: string) => void;
   customer: CustomerInfoType;
   updateCustomer: (newInfo: CustomerInfoType) => void;
   services: ServiceType[];
   setServices: (services: ServiceType[]) => void;
   companyInfo: CompanyInfoType;
   setCompanyInfo: (companyInfo: CompanyInfoType) => void;
   selectedServices: number[];
   updateSelectedServices: (service_id: number) => void;
   selectedDateTime: Date | null;
   setSelectedDateTime: (date: Date) => void;
   sliderIndex: number;
   setSliderIndex: (index: number) => void;
   workingTime: any;
   setWorkingTime: (workingTime: any) => void;
}
export interface CustomerInfoType {
   name: string;
   email: string;
   phone: string;
   address1: string;
   address2: string;
   city: string;
   state: string;
   zip: string;
}
export interface ICustomerInfoType {
   name: string;
   email: string;
   phone: string;
   address: string;
}
export interface ServiceType {
   id: number;
   title: string;
   description: number;
   price: number;
}

export interface CompanyInfoType {
   name: string;
   phone: string;
   logo: string;
}

export interface SelectedTimeType {
   title: string;
   value: number;
   isActive: boolean;
}
export interface AppointmentTimeType {
   time1: string;
   time2: string;
   time3: string;
}

export interface AppointmentInfoType {
   company: CompanyInfoType;
   customer: ICustomerInfoType;
   appointment: AppointmentTimeType;
   services: ServiceType[];
}
