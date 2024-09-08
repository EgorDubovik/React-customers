import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../../store/axiosClient';
import { parseAddress } from 'vladdress';
interface Address {
	id: string;
	line1: string;
	line2: string;
	city: string;
	state: string;
	zip: string;
	full: string;
}
interface Customer {
	name: string;
	phone: string;
	email: string;
	address: Address[];
}
export const useUpdateCustomer = () => {
   const customerId = useParams().id ?? 0;
	
	// const [loadingPage, setLoadingPage] = useState(true);
	const [loadingStatus, setLoadingStatus] = useState('loading');
	const [modal, setModal] = useState(false);
	const [addressFormLoading, setAddressFormLoading] = useState(false);
	const [removeAddressLoading, setRemoveAddressLoading] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [phoneError, setPhoneError] = useState(false);
	const [addressError, setAddressError] = useState(false);
	const [parseAddressValue, setParseAddressValue] = useState('');
	const [dataAddress, setDataAddress] = useState({
		id: '',
		address1: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
	});
	const [customer, setCustomer] = useState<Customer>({
		name: '',
		phone: '',
		email: '',
		address: [],
	});
	const navigate = useNavigate();

	useEffect(() => {
		setLoadingStatus('loading');
		axiosClient
			.get('/customers/' + customerId)
			.then((res) => {
				console.log(res.data);
				setCustomer(res.data);
				setLoadingStatus('success');
			})
			.catch((err) => {
				console.log(err);
				setLoadingStatus('error');
			})
			
	}, []);

	const addAddress = () => {
		setDataAddress({
			id: '',
			address1: '',
			address2: '',
			city: '',
			state: '',
			zip: '',
		});
		setModal(true);
	};

	const editAddress = (address: any) => {
		console.log(address);
		dataAddress.id = address.id;
		dataAddress.address1 = address.line1;
		dataAddress.address2 = address.line2;
		dataAddress.city = address.city;
		dataAddress.state = address.state;
		dataAddress.zip = address.zip;
		setDataAddress(dataAddress);
		setModal(true);
	};

	const saveAddress = () => {
		if (!validateAddressForm()) return;
		const url = dataAddress.id ? '/customers/' + customerId + '/address/' + dataAddress.id : '/customers/' + customerId + '/address';
		const methos = dataAddress.id ? 'put' : 'post';

		setAddressFormLoading(true);
		axiosClient[methos](url, dataAddress)
			.then((res) => {
				console.log(res.data);
				setCustomer(res.data.customer);
				setModal(false);
			})
			.catch((err) => {
				setError(true);
				console.log(err);
			})
			.finally(() => {
				setAddressFormLoading(false);
			});
	};

	const removeAddress = (addressId: string) => {
		setRemoveAddressLoading(Number(addressId));
		axiosClient
			.delete('/customers/' + customerId + '/address/' + addressId)
			.then((res) => {
				console.log(res.data);
				setCustomer(res.data.customer);
			})
			.catch((err) => {
				setError(true);
				console.log(err);
			})
			.finally(() => {
				setRemoveAddressLoading(0);
			});
	};

	const validateAddressForm = () => {
		if (dataAddress.address1.length < 5) {
			setAddressError(true);
			return false;
		}
		return true;
	};

	const validateForm = () => {
		if (customer.phone.length < 10) {
			setPhoneError(true);
			return false;
		}
		return true;
	};

	const handleChangeAddressData = (e: any) => {
		setDataAddress({ ...dataAddress, [e.target.name]: e.target.value });
	};

	const handleChangeFomr = (e: any) => {
		let value = e.target.value;
		if (e.target.name === 'phone') setPhoneError(false);
		if(e.target.name === 'email') value = value.toLowerCase();
		setCustomer({ ...customer, [e.target.name]: value });
	};

	const handleChangeParse = (e: any) => {
		setParseAddressValue(e.target.value);
	};
	const handleParseAddress = () => {
		const result = parseAddress(parseAddressValue);
		if (result.addressLine1) {
			dataAddress.address1 = result.addressLine1;
			
		}
		if (result.addressLine2) dataAddress.address2 = result.addressLine2;
		if (result.placeName) dataAddress.city = result.placeName;
		if (result.stateAbbreviation) dataAddress.state = result.stateAbbreviation;
		if (result.zipCode) dataAddress.zip = result.zipCode;
		setDataAddress({ ...dataAddress });
	};

	const updateCustomer = (e: any) => {
		e.preventDefault();
		if (!validateForm()) return;
		setLoading(true);
		axiosClient
			.put('/customers/' + customerId, customer)
			.then((res) => {
				const queryParams = new URLSearchParams(window.location.search);
				const redirectTo = queryParams.get('redirectTo');
				if (redirectTo) navigate(redirectTo);
				else navigate('/customers');
			})
			.catch((err) => {
				setError(true);
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};
   return { customer, loadingStatus, modal, setModal, addressFormLoading, removeAddressLoading, loading, error, phoneError, addressError, parseAddressValue, dataAddress, addAddress, editAddress, saveAddress, removeAddress, handleChangeAddressData, handleChangeFomr, handleChangeParse, handleParseAddress, updateCustomer };
}