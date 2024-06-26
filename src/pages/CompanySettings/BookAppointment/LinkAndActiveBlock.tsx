import { useState, useRef } from 'react';
import IconCopy from '../../../components/Icon/IconCopy';
import axiosClient from '../../../store/axiosClient';
import {ButtonLoader} from '../../../components/loading/ButtonLoader';

const LinkAndActiveBlock = (props: any) => {
	const [settings, setSettings] = useState<any>(props.settings);
	const linkRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);
	const coppyLink = () => {
		linkRef.current?.select();
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(linkRef.current?.value || '')
				.then(() => {
					console.log('copied');
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const changeActive = (e: any) => {
		setLoading(true);
		axiosClient.post('/company/settings/book-appointment/update', { active: e.target.checked })
			.then((res) => {
				console.log(res.data);
				setSettings({ ...settings, active: res.data.active });
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	return (
		<div className="panel p-4">
			<div className="mb-5">
				<div className="mb-4">{settings.active ? <p className="text-green-500">Book appointment online is active</p> : <p className="text-red-500">Book appointment online is inactive</p>}</div>
				<div className="flex items-center">
					<div className='flex items-center'>
						<label className="w-12 h-6 relative mt-2">
							<input
								type="checkbox"
								className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
								id="custom_switch_checkbox1"
								checked={settings.active}
								onChange={changeActive}
							/>
							<span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
						</label>
						{loading && <div className="w-5 h-5 ml-2"><ButtonLoader /></div>}
						
					</div>
					<div className="flex w-full ml-10">
						<input
							disabled={settings.active ? false : true}
							ref={linkRef}
							readOnly
							id="addonsRight"
							type="text"
							placeholder=""
							className="form-input ltr:rounded-r-none rtl:rounded-l-none"
							value={window.location.origin + '/appointment/book/' + settings.key}
						/>
						<button type="button" className="btn btn-secondary ltr:rounded-l-none rtl:rounded-r-none" onClick={coppyLink}>
							<IconCopy />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LinkAndActiveBlock;
