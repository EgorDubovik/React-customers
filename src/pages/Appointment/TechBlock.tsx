import { useState, useEffect } from 'react';
import axiosClient from '../../store/axiosClient';
import TechListBlock from '../../components/PagesLayout/TechListBlock';
import { useAppointmentContext } from '../../context/AppointmentContext';

const TechBlock = () => {

	const { appointment, updateTechs } = useAppointmentContext();
	
	const techs = appointment?.techs || [];
	const appointmentId = appointment?.id;

	const [techsIds, setTechsIds] = useState<Number[]>([]);
	const [companyTechs, setCompanyTechs] = useState([]);
	const [modal, setModal] = useState(false);
	const [removeTechStatus, setRemovingTechStatus] = useState(0);
	const [saveNewTechStatus, setSaveNewTechStatus] = useState(false);

	const isTechAdded = (techId: number) => {
		return techsIds.includes(techId);
	};

	const loadCompanyTechs = () => {
		axiosClient
			.get(`company/techs`)
			.then((res) => {
				setCompanyTechs(res.data.techs);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const saveNewTechs = () => {
		setSaveNewTechStatus(true);
		axiosClient
			.post(`appointment/tech/${appointmentId}`, { techs: techsIds })
			.then((res) => {
				console.log(res);
				if (res.status === 200) {
					updateTechs(companyTechs.filter((tech: any) => techsIds.includes(tech.id)));
				}
				setModal(false);
			})
			.catch((err) => {
				alert('Something went wrong. Please try again later');
				console.log(err);
			})
			.finally(() => {
				setSaveNewTechStatus(false);
			});
	};

	const initTechsIds = () => {
		setTechsIds(techs.map((tech: any) => tech.id));
	};
	const addRemovetechFromList = (techId: number) => {
		if (isTechAdded(techId)) {
			setTechsIds(techsIds.filter((id) => id !== techId));
		} else {
			setTechsIds([...techsIds, techId]);
		}
	};

	useEffect(() => {
		loadCompanyTechs();
	}, []);

	useEffect(() => {
		initTechsIds();
	}, [techs]);

	const removeTech = (techId: number) => {
		setRemovingTechStatus(techId);
		axiosClient
			.delete(`appointment/tech/${appointmentId}/${techId}`)
			.then((res) => {
				if (res.status === 200) {
					updateTechs(techs.filter((tech: any) => tech.id !== techId));
				}
			})
			.catch((err) => {
				alert('Something went wrong. Please try again later');
				console.log(err);
			})
			.finally(() => {
				setRemovingTechStatus(0);
			});
	};
	return (
		<div className="">
			<h3 className="font-semibold text-lg dark:text-white-light">Technical</h3>
         <TechListBlock
            techs={techs}
            modal={modal}
            setModal={setModal}
            techsIds={techsIds}
            companyTechs={companyTechs}
            removeTech={removeTech}
            removeTechStatus={removeTechStatus}
            saveNewTechs={saveNewTechs}
            saveNewTechStatus={saveNewTechStatus}
            addRemovetechFromList={addRemovetechFromList}
         />
		</div>
	);
};

export default TechBlock;
