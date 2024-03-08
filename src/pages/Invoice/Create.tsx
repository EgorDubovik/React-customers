import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSend from '../../components/Icon/IconSend';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconDownload from '../../components/Icon/IconDownload';
import IconEdit from '../../components/Icon/IconEdit';
import IconPlus from '../../components/Icon/IconPlus';


const Create = () => {
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(setPageTitle('Invoice Preview'));
   });
   const exportTable = () => {
      window.print();
   };
   return (
      <div className="conteiner">
         <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
            <button type="button" className="btn btn-info gap-2">
               <IconSend />
               Send Invoice
            </button>

            <button type="button" className="btn btn-primary gap-2" onClick={() => exportTable()}>
               <IconPrinter />
               Print
            </button>

            <button type="button" className="btn btn-success gap-2">
               <IconDownload />
               Download
            </button>
         </div>
      </div>
   )
}

export default Create