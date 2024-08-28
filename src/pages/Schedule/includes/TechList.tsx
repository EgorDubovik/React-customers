import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axiosClient from '../../../store/axiosClient'
import IconPlus from '../../../components/Icon/IconPlus'
import TechItem from '../../../components/PagesLayout/TechItem'
import TechListBlock from '../../../components/PagesLayout/TechListBlock'

const TechList = (props:any) => {
   const [removeTechStatus, setRemovingTechStatus] = useState(0); 
   const [companyTechs, setCompanyTechs] = useState([]);
   const {modal, setModal, techsIds, onAddRemovetechFromList,onSaveTeachs, onRemoveTech} = props;
   const [techs, setTechs]  = useState([]);

   const isTechAdded = (techId:number) => {
      return techsIds.includes(techId);
   }
   const loadCompanyTechs = () => {
      axiosClient.get(`company/techs`)
         .then((res) => {
            setCompanyTechs(res.data.techs);
         })
         .catch((err) => {
            console.log(err);
         })
         .finally(() => {
            
         });
   }

   useEffect(() => {
      loadCompanyTechs();
   }, []);

   useEffect(() => {
      
      setTechs(companyTechs.filter((tech:any) => techsIds.includes(tech.id)));
      setRemovingTechStatus(0);
   }, [techsIds, companyTechs]);
   
   const removeTechHandle = (techId:number) => {
      setRemovingTechStatus(techId);
      onRemoveTech(techId);
   }

   const saveNewTechs = () => {
      onSaveTeachs();
   }

   const addRemovetechFromList = (techId:number) => {
      onAddRemovetechFromList(techId);
   }

   return (
      <>
         <TechListBlock
            techs={techs}
            companyTechs={companyTechs}
            modal={modal}
            setModal={setModal}
            techsIds={techsIds}
            removeTech={removeTechHandle}
            removeTechStatus={removeTechStatus}
            addRemovetechFromList={addRemovetechFromList}
            saveNewTechs={saveNewTechs}
            
         />
      </>
   )
}

export default TechList