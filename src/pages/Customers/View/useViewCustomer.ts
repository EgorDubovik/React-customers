import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../../store/axiosClient';
export const useViewCustomer = () => {
   const { id } = useParams();
	const [customer, setCustomer] = useState<any>({});
	const [loadingStatus, setLoadingStatus] = useState('loading');

	useEffect(() => {
		axiosClient
			.get(`/customers/${id}`)
			.then((res) => {
				setLoadingStatus('success');
				console.log('data:', res.data.jobs);
				setCustomer(res.data);
			})
			.catch((err) => {
				setLoadingStatus('error');
				console.log(err);
			})
			.finally(() => {
				console.log('finally');
			});
	}, []);
   return { customer, loadingStatus };
}