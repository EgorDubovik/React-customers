import { createContext, useContext, useState, ReactNode } from 'react';
import { IExpense } from '../types';
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

interface Notes{
  id: number,
  text: string,
  updated_at: string,
  creator: {
    id: number,
    name: string,
  }
}

interface Appointment {
  id : number;
  job_id: number;
  status : number;
  start : string;
  end : string;
  notes : Notes[];
  payments : Payments[];  
  services : any[];
  customer : any;
  address : any;
  techs: Techs[];
  images: any[];
  expenses: IExpense[];
}

interface AppointmentContextType {
  appointment: Appointment | null;
  setAppointment: (appointment: Appointment | null) => void;
  updateStatus: (status: number) => void;
  updateNotes: (notes: Notes[]) => void;
  updatePayments: (payments: Payments[]) => void;
  updateServices: (services: any[]) => void;
  updateTime: (start: string, end: string) => void;
  updateImages: (images: any[]) => void;
  updateTechs: (techs: Techs[]) => void;
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
  const updateNotes = (notes: Notes[]) => {
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
  const updateTechs = (techs: Techs[]) => {
    if (appointment) {
      setAppointment({ ...appointment, techs:techs });
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
    updateTechs,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export { AppointmentContext, useAppointmentContext, AppointmentProvider };