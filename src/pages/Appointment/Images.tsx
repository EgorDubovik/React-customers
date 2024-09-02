import React, { useState, useRef, useEffect } from 'react';
import IconPlus from '../../components/Icon/IconPlus';
import axiosClient from '../../store/axiosClient';
import { useAppointmentContext } from '../../context/AppointmentContext';
const Images = (props: any) => {
	const { appointment, updateImages } = useAppointmentContext();
	
	const appointmentId = appointment?.id;
	const [images, setImages] = useState<any[]>(appointment?.images || []);
	const [uploadingStatus, setUploadingStatus] = useState(false);
	const fileInputRef = useRef(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [showGallery, setShowGallery] = useState(false);
	const [showImageIndex, setShowImageIndex] = useState(0);

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
			try {
				const response = await axiosClient.post('appointment/images/' + appointmentId, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				console.log('File uploaded successfully:', response.data);
				setImages([...images, response.data]);
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

	const openGallery = (index:number) => {
		console.log('open gallery');
		setShowImageIndex(index);
		setShowGallery(true);
	};
	const setNextImage = () => {
		if(showImageIndex < images.length - 1){
			setShowImageIndex(showImageIndex + 1);
		} else {
			setShowImageIndex(0);
		}
	}

	const setPrevImage = () => {
		if(showImageIndex > 0){
			setShowImageIndex(showImageIndex - 1);
		} else {
			setShowImageIndex(images.length - 1);
		}
	}


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
						<img src={image.path} className="w-full h-20 object-cover rounded-lg cursor-pointer" onClick={() => openGallery(index)} />
					</div>
				))}
			</div>
			{showGallery && (
				<>
					<div className="z-60 fixed bottom-0 top-0 left-0 right-0 bg-black bg-opacity-80 "></div>
					<div className="z-80 fixed top-0 left-0 w-10 md:w-20 h-full cursor-pointer bg-black bg-opacity-80 hover:bg-opacity-100" onClick={setPrevImage}>
						<div className="flex items-center justify-center h-full">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-9-7 9-7" />
							</svg>
						</div>
					</div>
					<div className="z-70 fixed bottom-0 top-0 left-0 right-0" onClick={() => setShowGallery(false)}>
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<img src={images[showImageIndex]?.path} className="w-full h-full object-cover rounded-lg" />
						</div>
					</div>
					<div className="z-80 fixed right-0 top-0 w-10 md:w-20 h-full cursor-pointer bg-black bg-opacity-80 hover:bg-opacity-100" onClick={setNextImage}>
						<div className="flex items-center justify-center h-full">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Images;
