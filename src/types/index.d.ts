export interface TechItemProps {
	key: number;
	className: string;
	color: string;
	id: number;
	name: string;
	phone: string;
	roles: any;
	addRemovetechFromList?: (id:number) => void;
	removeTechHandle?: (id: number) => void;
	removeTechStatus: number;
}

export interface TechListBlockProps {
   techs: any;
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