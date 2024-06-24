import { CompanyInfoType } from "./@types";

const Header = (props:CompanyInfoType) => {

   // const {companyInfo} = useContext(CustomerContext);

   return (
      <div className='bg-gray-100 py-2 flex items-center justify-between border-b-2 border-gray-300'>
         <div className='pl-4 flex items-center'>
            <img src={props.logo ?? "defoultLogo"} alt='logo' className='h-10' /> 
            <span className='ml-2'>{props.phone ?? ""}</span>
         </div>
         
         <div className='pr-4'>
            <span className='text-right text-gray-500'>Book appointment online</span>
         </div>
      </div>
   );
};

export default Header;