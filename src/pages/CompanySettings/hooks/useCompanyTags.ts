import { useState, useEffect } from 'react';
import axiosClient from '../../../store/axiosClient';
interface ITag {
	id: number;
	title: string;
	color: string;
	company_id: number;
}
export const useCompanyTags = () => {
   const [tags, setTags] = useState<ITag[]>([]);
	const [loadingStatus, setLoadingStatus] = useState<string>('loading');
	const [newTagTitle, setNewTagTitle] = useState<string>('');
	const [storeStatus, setStoreStatus] = useState<boolean>(false);
   const [deleteStatus, setDeleteStatus] = useState<number>(0);
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
      setDeleteStatus(tagId);
      axiosClient.delete(`company/settings/tags/${tagId}`)
         .then((res) => {
            console.log(res);
            if(res.status === 200){
               setTags(tags.filter((tag) => tag.id !== tagId));
            }
         })
         .catch((err) => {
            alert('Something went wrong. Please try again later');
            console.log(err);
         })
         .finally(() => {
            setDeleteStatus(0);
         });
   }
   return { tags, loadingStatus, newTagTitle, setNewTagTitle, storeNewTag, isDropdownOpen, handleColorClick, colors, selectColor, selectedColor, storeStatus, deleteStatus, handelEditTag, handleDeleteTag };
}
