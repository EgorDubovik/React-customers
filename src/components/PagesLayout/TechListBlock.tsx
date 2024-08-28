import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import TechItem from './TechItem';
import IconPlus from '../Icon/IconPlus';
import { TechListBlockProps } from '../../types';

const TechListBlock = (props: TechListBlockProps) => {
   const {modal, setModal} = props;
	const isTechAdded = (techId: number) => {
		return props.techsIds.includes(techId);
	};
	return (
		<div>
			<ul className="mt-2">
				{props.techs.map((tech: any, index: number) => (
					<TechItem
						key={index}
						className="p-2 mb-2 flex items-center dark:bg-gray-900 bg-gray-100 rounded"
						color={tech.color}
						id={tech.id}
						name={tech.name}
						phone={tech.phone}
						roles={tech.roles}
						removeTechHandle={props.removeTech}
						removeTechStatus={props.removeTechStatus}
					/>
				))}
			</ul>
			<div className="flex justify-center mt-4">
				<span className={'flex cursor-pointer border-b dark:border-gray-800 border-gray-200 py-2'} onClick={() => setModal(true)}>
					<IconPlus className="mr-2" />
					Add Tech
				</span>
			</div>

			<Transition appear show={modal} as={Fragment}>
				<Dialog as="div" open={modal} onClose={() => setModal(false)}>
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<div className="fixed inset-0" />
					</Transition.Child>
					<div id="login_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
						<div className="flex items-start justify-center min-h-screen px-4">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
									<div className="py-4 px-0 md:p-4">
										<ul className="list-group">
											{props.companyTechs.map((tech: any, index: number) => (
												<TechItem
													key={index}
													className={'p-2 mb-2 flex items-center  ' + (isTechAdded(tech.id) ? 'dark:bg-[#050b14] bg-gray-100 text-primary' : '') + ' rounded cursor-pointer'}
													color={tech.color}
													id={tech.id}
													name={tech.name}
													phone={tech.phone}
													roles={tech.roles}
													addRemovetechFromList={props.addRemovetechFromList}
													removeTechStatus={-1}
												/>
											))}
										</ul>
										<div className="mt-10">
											<button type="button" className="btn btn-primary w-full" onClick={props.saveNewTechs}>
												{props.saveNewTechStatus ? 'Saving...' : 'Save'}
											</button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};

export default TechListBlock;
