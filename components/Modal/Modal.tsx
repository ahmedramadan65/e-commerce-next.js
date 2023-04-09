import React, { FC, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

interface ModalProps {
	modalTitle: string;
	modalButtonText?: string;
	children: React.ReactElement;
	icon?: React.ReactElement;
}
const FilterModal: FC<ModalProps> = ({ modalTitle, modalButtonText, icon, children }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const renderChild = () => {
		return React.cloneElement(children as any, {
			handleClose: handleCloseModal,
		});
	};

	const renderIcon = () => {
		return React.cloneElement(icon as any, {
			onClick: handleOpenModal,
		});
	};

	return (
		<>
			{icon ? (
				renderIcon()
			) : (
				<button
					className="px-3 py-2 bg-black border-none rounded-lg font-bold text-white  w-full cursor-pointer"
					onClick={handleOpenModal}
				>
					{modalButtonText}
				</button>
			)}
			<div className={`fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 ${isModalOpen ? 'block' : 'hidden'}`}>
				<div className="flex items-center justify-center min-h-screen">
					<div className="bg-white p-6 rounded-md">
						<div className="flex justify-between">
							<h2 className="text-lg font-bold mb-4">{modalTitle}</h2>
							<AiOutlineCloseCircle onClick={handleCloseModal} fontSize={18} cursor="pointer" />
						</div>
						{renderChild()}
					</div>
				</div>
			</div>
		</>
	);
};

export default FilterModal;
