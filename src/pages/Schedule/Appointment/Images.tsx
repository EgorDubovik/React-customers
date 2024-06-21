import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import IconPlus from '../../../components/Icon/IconPlus';
import axiosClient from '../../../store/axiosClient';
import { useAppointmentContext } from '../../../context/AppointmentContext';

const Images = (props: any) => {
   const appointmentId = props.appointmentId || 0;
	const { appointment, updateImages } = useAppointmentContext();
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
			<div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4">
				{appointment?.images?.map((image: any, index: number) => (
					
					<div key={index} className="relative">

						<img src={image.path} alt={image.name} className="w-full h-20 object-cover rounded-lg" />
						<Link to={image.url} target="_blank" className="absolute top-0 right-0 p-1 bg-white bg-opacity-50 rounded-bl-lg rounded-tr-lg">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
							</svg>
						</Link>
					</div>)
				)}
			</div>
		</>
	);
};

export default Images;
