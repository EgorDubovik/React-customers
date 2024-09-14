import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
export const viewCurrency = (amount: number | undefined) => {
	if (typeof amount === 'string') amount = parseFloat(amount);

	if (amount === undefined || isNaN(amount)) return '$0.00';
	return amount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});
};

export const calculateTotalPaid = (payments: any) => {
	return payments.reduce((acc: any, payment: any) => {
		const amount = parseFloat(payment.amount);
		return acc + amount;
	}, 0);
};

export const calculateTaxAndTotal = (services: any, taxRate:number) => {
	let tax = 0;	
	let total = 0;
	services.forEach((service: any) => {
		const price = parseFloat(service.price);
		total += price;
		if (service.taxable) tax += price * taxRate;
	});
	total += tax;
	return { tax, total };
};
export const calculateRemaining = (payments: any, total: number) => {
	const totalPaid = payments.reduce((acc: any, payment: any) => {
		const amount = parseFloat(payment.amount);
		return acc + amount;
	}, 0);
	const remaining = total - totalPaid;
	return Math.round(remaining * 100) / 100;
};
export const getTechAbr = (name: string) => {
	return name
		.split(' ')
		.map((n: string) => n[0])
		.join('');
};

export const manualIsoString = (date: Date) => {
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date
		.getMinutes()
		.toString()
		.padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}Z`;
};

export const showMessage = (msg = '', type = 'success') => {
	const toast: any = Swal.mixin({
		toast: true,
		position: 'top',
		showConfirmButton: false,
		timer: 3000,
		customClass: { container: 'toast' },
	});
	toast.fire({
		icon: type,
		title: msg,
		padding: '10px 20px',
	});
};

export const formatDate = (date: Date | string | undefined, format: string) => {
	if(date === undefined || !date) return '';
	if (typeof date === 'string') date = new Date(date);
	if (!(date instanceof Date)) {
		throw new Error('Invalid date object');
	}

	const zeroPad = (num: number) => num.toString().padStart(2, '0');

	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const dayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// First, handle longer tokens to avoid partial replacements
	const replacements: { [key: string]: string | number } = {
		YYYY: date.getFullYear(),
		YY: date.getFullYear().toString().slice(-2),
		MMMM: monthNames[date.getMonth()],
		MMM: monthAbbreviations[date.getMonth()],
		MM: zeroPad(date.getMonth() + 1), // Months are zero-based in JavaScript
		M: date.getMonth() + 1,
		DDDD: dayNames[date.getDay()],
		DDD: dayAbbreviations[date.getDay()],
		DD: zeroPad(date.getDate()),
		D: date.getDate(),
		HH: zeroPad(date.getHours()),
		H: date.getHours(),
		hh: zeroPad(date.getHours() % 12 || 12),
		h: date.getHours() % 12 || 12,
		mm: zeroPad(date.getMinutes()),
		m: date.getMinutes(),
		A: date.getHours() < 12 ? 'AM' : 'PM',
		ss: zeroPad(date.getSeconds()),
	};

	return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|HH|H|hh|h|mm|m|A|ss/g, (match) => replacements[match as keyof typeof replacements].toString());
};
