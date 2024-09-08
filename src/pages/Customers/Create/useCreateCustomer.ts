import { useState } from 'react';
import axiosClient from '../../../store/axiosClient';
import { useNavigate } from 'react-router-dom';
import { parseAddress } from 'vladdress';

export const useCreateCustomer = () => {
   const [dataForm, setDataForm] = useState({
		name: '',
		phone: '',
		email: '',
		address1: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [phoneError, setPhoneError] = useState(false);
	const [addressError, setAddressError] = useState(false);
	const [parseAddressValue, setParseAddressValue] = useState('');
	const navigate = useNavigate();

	const validateForm = () => {
		let isValid = true;

		if (dataForm.phone.length < 10) {
			setPhoneError(true);
			isValid = false;
		} else {
			setPhoneError(false);
		}

		if (dataForm.address1.length < 5) {
			setAddressError(true);
			isValid = false;
		} else {
			setAddressError(false);
		}

		return isValid;
	};

	const storeCustomer = (e: any) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		axiosClient
			.post('/customers', dataForm)
			.then((res) => {
				navigate('/appointment/create/' + res.data.id);
			})
			.catch((err) => {
				setError(true);
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleChangeForm = (e: any) => {
		if (e.target.name === 'phone') setPhoneError(false);
		if (e.target.name === 'address1') setAddressError(false);
		setDataForm({ ...dataForm, [e.target.name]: e.target.value });
	};

	const handleChangeParse = (e: any) => {
		setParseAddressValue(e.target.value);
	};
	const handleParseAddress = () => {
		const result = parseAddress(parseAddressValue);
		if (result.addressLine1) {
			dataForm.address1 = result.addressLine1;
			searchSuggestions(result.addressLine1);
		}
		if (result.addressLine2) dataForm.address2 = result.addressLine2;
		if (result.placeName) dataForm.city = result.placeName;
		if (result.stateAbbreviation) dataForm.state = result.stateAbbreviation;
		if (result.zipCode) dataForm.zip = result.zipCode;
		setDataForm({ ...dataForm });
	};

	const [suggestionResult, setSuggestionResult] = useState([]);
	const searchSuggestions = (search: string) => {
		if(search.length < 5) return;
		axiosClient.get('/customers', { params: { search } }).then((res) => {
			if (res.data.data.length > 0) {
				setSuggestionResult(res.data.data);
			}
		});
	};
	const searchSuggestionsByPhone = () => {
		searchSuggestions(dataForm.phone);
	};
	const searchSuggestionsByAddress = () => {
		searchSuggestions(dataForm.address1);
	};

   return { error, phoneError, addressError, parseAddressValue, suggestionResult, storeCustomer, handleChangeForm, handleChangeParse, handleParseAddress, searchSuggestionsByPhone, searchSuggestionsByAddress, dataForm, loading };
}
