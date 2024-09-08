import { useState, useEffect, useRef } from 'react';
import { DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import axiosClient from '../../../store/axiosClient';
import { useNavigate } from 'react-router-dom';
import { ICustomerRecord } from '../../../types';
export const useCustomersList = () => {
   const [viewType, setViewType] = useState<string>(localStorage.getItem('customerViewType') || 'grid');
   const navigator = useNavigate();

	const changeViewType = (type: string) => {
		localStorage.setItem('customerViewType', type);
		setViewType(type);
	};

	const [search, setSearch] = useState<any>('');
	const [page, setPage] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const PAGE_SIZES = [10, 20, 30, 50, 100];
	const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
	const [initialRecords, setInitialRecords] = useState([]);
	const [loadingStatus, setLoadingStatus] = useState('loading');
	const [records, setRecords] = useState<ICustomerRecord[]>(initialRecords);
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
		columnAccessor: 'firstName',
		direction: 'asc',
	});

	useEffect(() => {
		setPage(1);
	}, [pageSize]);

	useEffect(() => {
		const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
		setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
	}, [sortStatus, initialRecords]);

	// load Ivocies
	useEffect(() => {
		setLoadingStatus('loading');
		axiosClient
			.get('/customers?page=' + page + '&limit=' + pageSize)
			.then((res: any) => {
				console.log('data:', res.data);
				setInitialRecords(res.data.data);
				setTotalRecords(res.data.total);
				setLoadingStatus('success');
			})
			.catch((err) => {
				setLoadingStatus('error');
				console.log(err);
			});
	}, [page, pageSize]);

	const editUser = (customer: any = null) => {
		navigator('/customer/update/' + customer.id);
	};

	const debounceRef = useRef<NodeJS.Timeout | null>(null);
	const [searchLoading, setSearchLoading] = useState(false);

	const searchData = async (s: string) => {
		console.log('sending:', s);
		setSearchLoading(true);
		const respons = await axiosClient.get('/customers', {
			params: { search: s },
		});
		setSearchLoading(false);
		setInitialRecords(respons.data.data);
		setTotalRecords(respons.data.total);
	};

	const searchHandler = (e: any) => {
		setSearch(e.target.value);
		const s = e.target.value.trim();
		if (s.length < 3)
			if (s.length === 0) searchData('');
			else return;

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			searchData(s);
		}, 300);
	};

   return { viewType, changeViewType, search, setSearch, page, setPage, totalRecords, setTotalRecords, PAGE_SIZES, pageSize, setPageSize, initialRecords, setInitialRecords, loadingStatus, setLoadingStatus, records, setRecords, sortStatus, setSortStatus, editUser, searchLoading, setSearchLoading, searchData, searchHandler };
}