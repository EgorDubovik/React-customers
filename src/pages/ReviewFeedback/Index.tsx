import { useParams } from 'react-router-dom';
import { useState } from 'react';
import IconStar from '../../components/Icon/IconStar';

export default function ReviewFeedback(props: any) {

	const { paramKey } = useParams();
   const [mouseOverat, setMouseOverAt] = useState(0);
   const [rating, setRating] = useState(0);

	return (
		<div>
			{/* Header */}
			<div className="bg-gray-100 py-2 flex items-center justify-between border-b-2 border-gray-300">
				<div className="pl-4 flex items-center">
					<img src={props.logo ?? 'defoultLogo'} alt="logo" className="h-10" />
					<span className="ml-2">{props.phone ?? ''}</span>
				</div>

				<div className="pr-4">
					<span className="text-right text-gray-500">View appointment info</span>
				</div>
			</div>

			{/* END Header */}

			{/* Main */}
			<div className="w-full sm:w-3/4 m-auto">
				<div className="header border-b border-gray-300 p-2 pb-4 mt-10">
					<h2 className="font-bold">
						<div className="flex items-center justify-center">
							<span className="text-xl">Review Feedback</span>
						</div>
					</h2>
				</div>
				<div className="p-4">
					<div className="flex items-center justify-center">
						<div className="w-full sm:w-3/4">
                     <div className='flex items-center justify-center mb-4'>
                        <div className='w-1/2 flex gap-2'>
                           <label className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
                           {
                              [1,2,3,4,5].map((i) => (
                                 <span onMouseOver={()=>{setMouseOverAt(i)}} onMouseOut={()=>{if(mouseOverat === 1) setMouseOverAt(0)}} onClick={()=>{setRating(i)}} className='cursor-pointer'>
                                    <IconStar key={i} className={`text-warning ${mouseOverat >= i || rating>=i ? 'fill-warning' : ''}`}/>
                                 </span>
                              ))
                           }
                           
                        </div>
                     </div>
							<div className="flex items-center justify-center">
								<div className="w-1/2">
									<label className="block text-gray-700 text-sm font-bold mb-2">Review:</label>
									<textarea className="shadow appearance-none border rounded w-full h-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
								</div>
							</div>
							<div className="flex items-center justify-center mt-4">
								<div className="w-1/2">
									<button className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
										Submit
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* END Main */}
		</div>
	);
}
