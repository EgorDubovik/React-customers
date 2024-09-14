import { Interface } from "readline";

export interface TechItemProps {
	key: number;
	className: string;
	color: string;
	id: number;
	name: string;
	phone: string;
	roles: any;
	addRemovetechFromList?: (id: number) => void;
	removeTechHandle?: (id: number) => void;
	removeTechStatus: number;
}
export interface ITech {
	id: number;
	name: string;
	phone: string;
	roles: any;
	color: string;
}
export interface TechListBlockProps {
	techs: Itech[];
	companyTechs: any;
	modal: boolean;
	setModal: (modal: boolean) => void;
	techsIds: any;
	removeTech: (id: number) => void;
	removeTechStatus: number;
	addRemovetechFromList: (id: number) => void;
	saveNewTechs: () => void;
	saveNewTechStatus?: boolean;
}

export interface IExpense {
	title: string;
	amount: number;
	id: number;
}

export interface IService {
	id: number;
	title: string;
	description: string;
	price: number;
	taxable: boolean;
}

export interface IPayment {
	id: number;
	appointment_id: number;
	amount: number;
	payment_type: string;
	type_text: string;
	created_at: string;
	updated_at: string;
	company_id: number;
}
export interface ITech {
	id: number;
	name: string;
	color: string;
	created_at: string;
	updated_at: string;
	company_id: number;
}

export interface INote {
	id: number;
	text: string;
	updated_at: string;
	creator: {
		id: number;
		name: string;
	};
}

export interface IJob{
	id: number;
	payments: IPayment[];
	remaining_balance: number;
	total_paid: number;
	total_amount: number;
	appointments: any;
	services: IService[];
}

export interface IAppointment {
	id : number;
	job_id: number;
	status : number;
	start : string;
	end : string;
	notes : INote[];
	customer : any;
	address : any;
	techs: ITech[];
	images: any[];
	expenses: IExpense[];
	company: any;
	job: IJob;
}

export interface IInvoice {
	id: number;
	job: {
		id: number;
		services: IService[];
		payments: IPayment[];
		customer: any;
		total_amount: number;
		total_tax: number;
		total_paid: number;
		remainig_balance: number;
		address: any;
	}
	company: any;
	creator: {
		id: number;
		name: string;
	};
	created_at: string;
	email: string;
	pdf_url: string;
}

export interface ICustomerRecord {
	id: number;
	name: string;
	phone: string;
	email: string;
	address: any;
	created_at: string;
}