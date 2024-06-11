import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import IconPlus from '../../../components/Icon/IconPlus';

const Images = (props: any) => {
   
	const [selectedFile, setSelectedFile] = useState([]);
   const [uploadingStatus, setUploadingStatus] = useState(false);
	const fileInputRef = useRef(null);

	const handleFileChange = (event: any) => {
		setSelectedFile(event.target.files[0]);
      handleUpload();
	};

	const handleLinkClick = () => {

		if (fileInputRef.current && !uploadingStatus) {
			(fileInputRef.current as HTMLInputElement).click();
		}
	};

	const handleUpload = async () => {
      setUploadingStatus(true);
      console.log('uploading file');
		// if (selectedFile) {
		// 	const formData = new FormData();
		// 	formData.append('file', selectedFile);

		// 	try {
		// 		const response = await axios.post('your-upload-url', formData, {
		// 			headers: {
		// 				'Content-Type': 'multipart/form-data',
		// 			},
		// 		});
		// 		console.log('File uploaded successfully:', response.data);
		// 	} catch (error) {
		// 		console.error('Error uploading file:', error);
		// 	}
		// }
	};

	return (
      <>
			<div className="flex items-center justify-between px-4 py-2">
				<h3 className="font-semibold text-lg dark:text-white-light">Images</h3>
				<button onClick={handleLinkClick} className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
					<IconPlus className="w-4 h-4" />
				</button>
				<input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" multiple />
            
			</div>
			<div className='px-4 py-1 text-center'>
            {uploadingStatus && <div>Uploading...</div>}
         </div>
		</>
	);
};

export default Images;
