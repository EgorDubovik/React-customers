import { useEffect, useState } from 'react';
import axiosClient from '../../store/axiosClient';
import { PageCirclePrimaryLoader } from '../../components/loading/PageLoading';
import { PageLoadError } from '../../components/loading/Errors';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import Dropdown from '../../components/Dropdown';
import IconEdit from '../../components/Icon/IconEdit';
import IconTrash from '../../components/Icon/IconTrash';
interface ITag {
	id: number;
	title: string;
	color: string;
	company_id: number;
}

const CompanyTags = () => {
	const [tags, setTags] = useState<ITag[]>([]);
	const [loadingStatus, setLoadingStatus] = useState<string>('loading');
	const [newTagTitle, setNewTagTitle] = useState<string>('');
	const [storeStatus, setStoreStatus] = useState<boolean>(false);
	useEffect(() => {
		setLoadingStatus('loading');
		axiosClient
			.get('company/settings/tags')
			.then((res) => {
				setTags(res.data);
				setLoadingStatus('success');
			})
			.catch((err) => {
				setLoadingStatus('error');
				console.log(err);
			});
	}, []);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedColor, setSelectedColor] = useState('primary'); // Default color

	const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
	const handleColorClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const selectColor = (color: string) => {
		setSelectedColor(color);
		setIsDropdownOpen(false); // Close the dropdown after selecting
	};

	const storeNewTag = () => {
		if (storeStatus) return;
		const data = {
			title: newTagTitle,
			color: selectedColor,
		};
		setStoreStatus(true);
		axiosClient
			.post('company/settings/tags', data)
			.then((res) => {
				setTags([...tags, res.data]);
				setNewTagTitle('');
			})
			.catch((err) => {
				alert('Something went wrong. Please try again later');
				console.log(err);
			})
			.finally(() => {
				setStoreStatus(false);
			});
	};
   const handelEditTag = (tagId:number) => {

   }

   const handleDeleteTag = (tagId:number) => {
      axiosClient.delete(`company/settings/tags/${tagId}`)
         .then((res) => {
            if(res.status === 200){
               setTags(tags.filter((tag) => tag.id !== tagId));
            }
         })
         .catch((err) => {
            alert('Something went wrong. Please try again later');
            console.log(err);
         });
   }
	return (
		<div>
			{loadingStatus === 'loading' && <PageCirclePrimaryLoader />}
			{loadingStatus === 'error' && <PageLoadError />}
			{loadingStatus === 'success' && (
				<div className="panel md:w-1/2 w-full m-auto">
					<h3 className="font-semibold text-lg dark:text-white-light">Create or remove company tags</h3>
					<div className="flex items-center gap-2">
						<input type="text" value={newTagTitle} onChange={(e) => setNewTagTitle(e.target.value)} className="form-input w-3/4" placeholder="Enter tag title" />
						<div id="color" className={`w-1/4 bg-${selectedColor} h-10 rounded cursor-pointer relative`} onClick={handleColorClick}>
							{isDropdownOpen && (
								<div className="absolute w-full top-8 shadow-lg mt-2 rounded">
									{colors.map(
										(color, index) => selectedColor !== color && <div key={index} className={`p-2 mt-2 cursor-pointer bg-${color} h-10 rounded`} onClick={() => selectColor(color)}></div>
									)}
								</div>
							)}
						</div>
						<button className="btn btn-primary" onClick={storeNewTag}>
							{storeStatus ? <ButtonLoader /> : 'Add'}
						</button>
					</div>
					<div className="mt-4">
						{tags.map((tag, index: number) => (
							<div className="inline-flex ml-4">
								<button className={`btn btn-sm btn-${tag.color} ltr:rounded-r-none rtl:rounded-l-none`}>{tag.title}</button>
								<div className="dropdown">
									<Dropdown
										placement={'bottom-start'}
										btnClassName={`btn btn-sm dropdown-toggle btn-${tag.color} ltr:rounded-l-none rtl:rounded-r-none before:border-[5px] before:border-l-transparent before:border-r-transparent before:border-t-inherit before:border-b-0 before:inline-block before:border-t-white-light h-full`}
										button={<span className="sr-only">Toggle dropdown</span>}
									>
										<ul className="!min-w-[170px]">
											<li>
												<button type="button" onClick={()=>handelEditTag(tag.id)}><IconEdit/> <span className='ml-2'>Edit</span></button>
											</li>
											<li>
												<button type="button" onClick={()=>handleDeleteTag(tag.id)}><IconTrash/> <span className='ml-2'>Delete</span></button>
											</li>
											
										</ul>
									</Dropdown>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default CompanyTags;
