import React, { useState } from 'react';
import { ButtonLoader } from '../../components/loading/ButtonLoader';
import axiosClient from '../../store/axiosClient';
import { Link, useNavigate } from 'react-router-dom';
import { parseAddress } from 'vladdress';

const CreateCustomer = () => {
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
	const [openParse, setOpenParse] = useState(false);
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

	const handleCreateCustomer = (e: any) => {
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

	const handleChangeFomr = (e: any) => {
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
		axiosClient.get('/customers', { params: { search } }).then((res) => {
			if (res.data.data.length > 0) {
				setSuggestionResult(res.data.data);
			}
		});
	};
	const searchSuggestionsByPhone = () => {
		searchSuggestions(dataForm.phone);
	};

	return (
		<div>
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h2 className="text-xl">Create new customer</h2>
			</div>
			<div className="container w-full md:w-1/2 lg:w-1/3 mx-auto px-4 sm:px-8">
				<div className="panel">
					<div className="flex items-center justify-between mb-5">
						<h5 className="font-semibold text-lg dark:text-white-light">Enter customer infromation</h5>
					</div>
					{error && (
						<div className="flex mt-6 mb-2 items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
							<span className="ltr:pr-2 rtl:pl-2">
								<strong className="ltr:mr-1 rtl:ml-1">Whoops!</strong>Somthing went wrong. Please try again.
							</span>
						</div>
					)}
					<form className="space-y-6">
						<div>
							<label>Customer name</label>
							<input type="text" placeholder="Name" name="name" className="form-input w-full" value={dataForm.name} onChange={handleChangeFomr} />
						</div>
						<div className={`${phoneError && 'has-error'}`}>
							<label>Customer number</label>
							<input type="text" placeholder="Phone" name="phone" className="form-input w-full" value={dataForm.phone} onChange={handleChangeFomr} onBlur={searchSuggestionsByPhone} />
							{phoneError && <span className="text-danger text-[11px]">Phone number must be 10 digits</span>}
						</div>
						<div>
							<label>Customer Email</label>
							<input type="email" autoComplete='off' placeholder="Email" name="email" className="form-input w-full" value={dataForm.email} onChange={handleChangeFomr} />
						</div>
						<div className={`${addressError && 'has-error'}`}>
							<div className="flex justify-between">
								<label htmlFor="gridAddress1">Address </label>
								<span className="text-primary ml-2 cursor-pointer" onClick={() => setOpenParse(!openParse)}>
									(parse)
								</span>
							</div>
							{openParse && (
								<div className="mb-5">
									<textarea
										name="parseAddress"
										className="form-input w-full"
										placeholder="Parsed address"
										rows={2}
										value={parseAddressValue}
										onChange={handleChangeParse}
										onBlur={handleParseAddress}
									/>
								</div>
							)}
							<input id="gridAddress1" type="text" placeholder="1234 Main St" name="address1" className="form-input" value={dataForm.address1} onChange={handleChangeFomr} />
							{addressError && <span className="text-danger text-[11px]">Address must be at least 5 characters</span>}
						</div>

						<div>
							<label htmlFor="gridAddress2">Address2</label>
							<input id="gridAddress2" type="text" placeholder="Apartment, studio, or floor" name="address2" className="form-input" value={dataForm.address2} onChange={handleChangeFomr} />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
							<div className="md:col-span-2">
								<label htmlFor="gridCity">City</label>
								<input id="gridCity" type="text" placeholder="Enter City" name="city" className="form-input" value={dataForm.city} onChange={handleChangeFomr} />
							</div>
							<div>
								<label htmlFor="gridState">State</label>
								<input id="gridState" type="text" placeholder="Enter State" name="state" className="form-input" value={dataForm.state} onChange={handleChangeFomr} />
							</div>
							<div>
								<label htmlFor="gridZip">Zip</label>
								<input id="gridZip" type="text" placeholder="Enter Zip" name="zip" className="form-input" value={dataForm.zip} onChange={handleChangeFomr} />
							</div>
						</div>
						{suggestionResult.length > 0 && (
							<div className="my-2">
								<p>Suggetion customer</p>
								{suggestionResult.map((customer: any) => (
									<Link to={`/customer/${customer.id}`} key={customer.id}>
										<div className="dark:bg-zinc-900 p-2 rounded mt-2">
											<p>
												<span className="font-bold">{customer.name}</span>
												<span className="ml-2">{customer.phone}</span>
											</p>
											<p className="mt-1">{customer.address[0].full}</p>
										</div>
									</Link>
								))}
							</div>
						)}

						<div className="button">
							<button type="submit" className="btn btn-primary w-full" onClick={handleCreateCustomer}>
								Create
								{loading && <ButtonLoader />}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateCustomer;
