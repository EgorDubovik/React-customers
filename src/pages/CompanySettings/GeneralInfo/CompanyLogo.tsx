import '../../../assets/css/file-upload-preview.css';
import { useEffect, useRef, useState } from 'react';
import axiosClient from '../../../store/axiosClient';
import { PageCirclePrimaryLoader } from '../../../components/loading/PageLoading';
import { alertError, alertSuccsess } from '../../../helpers/helper';
const CompanyLogo = (props: any) => {
	const { company, setCompany } = props;
	const fileInputRef = useRef(null);
	const [uploadingStatus, setUploadingStatus] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File>();
	const handleLinkClick = () => {
		if (fileInputRef.current && !uploadingStatus) {
			(fileInputRef.current as HTMLInputElement).click();
		}
	};
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]; // Get the first file selected
		if (file) {
			setSelectedFile(file);
		}
	};
	const handleUpload = async () => {
		if (!selectedFile) {
			console.error('No file selected');
			return;
		}

      console.log('File uploaded successfully:', selectedFile);
		setUploadingStatus(true);

		const file = selectedFile;
		const formData = new FormData();
		formData.append('logo', file);

		try {
			const response = await axiosClient.post(`company/settings/logo`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			alertSuccsess('Company Logo Updated');
			console.log('File uploaded successfully:', response.data);
			setCompany({ ...company, logo: response.data.newPath });
		} catch (error) {
			alertError('Something went wrong, Please try again later');
			console.error('Error uploading file:', error);
		} finally {
			setUploadingStatus(false);
			setSelectedFile(undefined);
		}
	};
   useEffect(() => {
      if(selectedFile){
         handleUpload();
      }
   }, [selectedFile]);
	return (
		<div className="panel">
			<div className="panel-header">Company Logo</div>
			<div className="panel-body">
				<div className="flex justify-center items-center">
					<div className="flex justify-center items-center w-3/4 py-4">
						{uploadingStatus 
							? <PageCirclePrimaryLoader /> 
							: <img src={company.logo ?? '/assets/images/file-preview.svg' } alt="company logo" className="w-full" />
						}
					</div>
				</div>
				<div className="flex justify-center items-center mt-3">
					<div className="w-full">
						<button onClick={handleLinkClick} className="btn btn-primary w-full">
							Change Logo
						</button>
						<input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CompanyLogo;
