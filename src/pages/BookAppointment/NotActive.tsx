import { CompanyInfoType } from "./@types";

const NotActive = ({phone}: {phone: string}) => {
	return (
		<div className="w-full px-4 m-auto md:w-3/5 max-w-6xl mt-5">
			<div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-x-2">
				<div className="col-span-3 bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative" role="alert">
					<strong className="font-bold">Oowps!</strong> Something went wrong.
					<br />
					<span className="block sm:inline text-[20px]">
						Book appointment online is not active for this company.
						<br /> Please contact <b>{phone}</b> for more information.
					</span>
				</div>
			</div>
		</div>
	);
};
export default NotActive;
