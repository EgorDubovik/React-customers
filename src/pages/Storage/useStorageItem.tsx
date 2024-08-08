import { useEffect, useState } from 'react';
import axiosClient from '../../store/axiosClient';

interface IRecords {
	id: number;
	title: string;
	quantity: number;
	updated_at: string;
	expexted_quantity: number;
}

const useStorageItem = () => {
	const [loadingStatus, setLoadingStatus] = useState('loading');
	const [loadingDataForm, setLoadingDataForm] = useState(false);
	const [modal, setModal] = useState(false);
	const [initialRecords, setInitialRecords] = useState<IRecords[]>([]);
	const [dataForm, setDataForm] = useState({
		id: 0,
		title: '',
		quantity: 0,
		expexted_quantity: 0,
	});
	const [removeId, setRemoveId] = useState(0);

	useEffect(() => {
		setLoadingStatus('loading');
		axiosClient
			.get('/storage')
			.then((res: any) => {
				console.log('data:', res.data);
				setInitialRecords(res.data.storageItems);
				setLoadingStatus('success');
			})
			.catch((err: any) => {
				setLoadingStatus('error');
				console.log(err);
			});
	}, []);

	const storeItem = () => {
		if (loadingDataForm) return;

		if (dataForm.id !== 0) updateItem(dataForm.id);
		else {
			setLoadingDataForm(true);
			axiosClient
				.post('/storage', dataForm)
				.then((res: any) => {
					if (res.status === 200) setModal(false);

					let newRecords = [...initialRecords];
					newRecords.unshift(res.data.storageItem);
					setInitialRecords(newRecords);
				})
				.catch((err: any) => {
					console.log(err);
				})
				.finally(() => {
					setLoadingDataForm(false);
				});
		}
	};

	const updateItem = (id: number) => {
		if (loadingDataForm) return;
		setLoadingDataForm(true);
		axiosClient
			.put(`/storage/${id}`, dataForm)
			.then((res: any) => {
				if (res.status === 200) setModal(false);
				const index = initialRecords.findIndex((item) => item.id === id);
				const newRecords = [...initialRecords];
				newRecords[index] = res.data.storageItem;
				setInitialRecords(newRecords);
			})
			.catch((err: any) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingDataForm(false);
			});
	};

	const removeItem = (id: number) => {
		if (removeId !== 0) return;
		setRemoveId(id);
		axiosClient
			.delete(`/storage/${id}`)
			.then((res: any) => {
				if (res.status === 200) {
					const newRecords = initialRecords.filter((item) => item.id !== id);
					setInitialRecords(newRecords);
				}
			})
			.catch((err: any) => {
				console.log(err);
			})
			.finally(() => {
				setRemoveId(0);
			});
	};

	const changeValue = (e: any) => {
		setDataForm({ ...dataForm, [e.target.name]: e.target.value });
	};

	const openModal = (itemID: number) => {
		if (itemID === 0) {
			setDataForm({
				id: 0,
				title: '',
				quantity: 0,
				expexted_quantity: 0,
			});
		} else {
			const item = initialRecords.find((item) => item.id === itemID);
			setDataForm(item!);
		}
		setModal(true);
	};

	return { openModal, modal, setModal, removeItem, storeItem, changeValue, loadingDataForm, initialRecords, dataForm, loadingStatus, updateItem, removeId };
};

export default useStorageItem;
