import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import IconPlus from '../../../components/Icon/IconPlus';
import axiosClient from '../../../store/axiosClient';

const Images = (props: any) => {
   const appointmentId = props.appointmentId || 0;
	const [uploadingStatus, setUploadingStatus] = useState(false);
	const fileInputRef = useRef(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


   useEffect(() => {
      handleUpload();
   }, [selectedFiles]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedFiles([...event.target.files!]);
	};

	const handleLinkClick = () => {
		if (fileInputRef.current && !uploadingStatus) {
			(fileInputRef.current as HTMLInputElement).click();
		}
	};

	const handleUpload = async () => {
		setUploadingStatus(true);
      
		const uploadPromises = selectedFiles.map(async (file) => {
			const formData = new FormData();
			formData.append('image', file);
         console.log('start uploading file:');
			try {
				const response = await axiosClient.post('appointment/images/'+appointmentId, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				console.log('File uploaded successfully:', response.data);
				return response.data;
			} catch (error) {
				console.error('Error uploading file:', error);
				throw error;
			}
		});

		try {
			const results = await Promise.all(uploadPromises);
			console.log('All files uploaded successfully:', results);
		} catch (error) {
			console.error('Error uploading one or more files:', error);
		}
      finally {
         setUploadingStatus(false);
      }
      
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
			<div className="px-4 py-1 text-center">{uploadingStatus && <div>Uploading...</div>}</div>
		</>
	);
};

export default Images;
