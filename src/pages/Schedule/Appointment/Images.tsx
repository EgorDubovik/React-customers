import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import IconPlus from '../../../components/Icon/IconPlus';
import axiosClient from '../../../store/axiosClient';
import { useAppointmentContext } from '../../../context/AppointmentContext';

const Images = (props: any) => {
	const appointmentId = props.appointmentId || 0;
	const { appointment, updateImages } = useAppointmentContext();
	const [images, setImages] = useState<any[]>(appointment?.images || []);
	const [uploadingStatus, setUploadingStatus] = useState(false);
	const fileInputRef = useRef(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [showGallery, setShowGallery] = useState(false);
	const [showImage, setShowImage] = useState<string>('');

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
				const response = await axiosClient.post('appointment/images/' + appointmentId, formData, {
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
		} finally {
			setUploadingStatus(false);
		}
	};

	const openGallery = (path:string) => {
		console.log('open gallery');
		setShowImage(path);
		setShowGallery(true);

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
			<div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4">
				{images.map((image: any, index: number) => (
					<div key={index} className="relative">
						<img src={image.path} className="w-full h-20 object-cover rounded-lg cursor-pointer" onClick={()=>openGallery(image.path)} />
					</div>
				))}
			</div>
			{showGallery && (
				<>
					<div className="z-30 fixed bottom-0 top-0 left-0 right-0 bg-black bg-opacity-80" ></div>
					<div className="z-30 fixed bottom-0 top-0 left-0 right-0" onClick={() => setShowGallery(false)}>
						<div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<img src={showImage} className="w-full h-full object-cover rounded-lg" />
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Images;
