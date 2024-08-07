import { createContext, useContext, useState, ReactNode } from 'react';

interface Payments{
  id: number,
  appointment_id: number,
  amount: number,
  payment_type: string,
  created_at: string,
  updated_at: string,
  company_id: number,
}
interface Techs{
  id: number,
  name: string,
  color: string,
  created_at: string,
  updated_at: string,
  company_id: number,
}

interface Appointment {
  id : number;
  status : number;
  start : string;
  end : string;
  notes : any[];
  payments : Payments[];  
  services : any[];
  customer : any;
  address : any;
  techs: Techs[];
  images: any[];
  expanse: any[];
}

interface AppointmentContextType {
  appointment: Appointment | null;
  setAppointment: (appointment: Appointment | null) => void;
  updateStatus: (status: number) => void;
  updateNotes: (notes: any[]) => void;
  updatePayments: (payments: Payments[]) => void;
  updateServices: (services: any[]) => void;
  updateTime: (start: string, end: string) => void;
  updateImages: (images: any[]) => void;
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentContext must be used within an AppointmentProvider');
  }
  return context;
};

// Appointment provider component
const AppointmentProvider = ({ children, appointmentData }: { children: ReactNode, appointmentData: Appointment | null }) => {
  const [appointment, setAppointment] = useState<Appointment | null>(appointmentData);
  
  const updateStatus = (status: number) => {
    if (appointment) {
      setAppointment({ ...appointment, status:status });
    }
  };
  const updateNotes = (notes: any[]) => {
    if (appointment) {
      setAppointment({ ...appointment, notes:notes });
    }
  }

  const updatePayments = (payments: Payments[]) => {
    if (appointment) {
      setAppointment({ ...appointment, payments:payments });
    }
  }
  const updateServices = (services: any[]) => {
    if (appointment) {
      setAppointment({ ...appointment, services:services });
    }
  }

  const updateTime = (start: string, end: string) => {
    if (appointment) {
      setAppointment({ ...appointment, start:start, end:end });
    }
  }
  const updateImages = (images: any[]) => {
    if (appointment) {
      setAppointment({ ...appointment, images:images });
    }
  }

  const value: AppointmentContextType = {
    appointment,
    setAppointment,
    updateStatus,
    updateNotes,
    updatePayments,
    updateServices,
    updateTime,
    updateImages,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export { AppointmentContext, useAppointmentContext, AppointmentProvider };