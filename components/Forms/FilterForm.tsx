import Category from '@/models/category';
import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';

interface FilterFormProps {
	handleClose?: () => void;
	categories: Category[];
}

type Inputs = {
	minPrice: number;
	maxPrice: number;
	category: number;
};

const FilterForm: FC<FilterFormProps> = ({ handleClose, categories }) => {
	const { register, handleSubmit, getValues, setValue, watch } = useForm<Inputs>({});
	const router = useRouter();

	const watchedCategories = watch(['category']);
	useEffect(() => {}, [watchedCategories]);

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		let path = '/';
		if (data.category) {
			path = `/category/${data.category}`;
		}
		Router.push({
			pathname: path,
			query: {
				...(data.minPrice ? { minPrice: data.minPrice } : {}),
				...(data.maxPrice ? { maxPrice: data.maxPrice } : {}),
				...(router.query.sort ? { sort: router.query.sort } : {}),
			},
		}).then(() => handleClose && handleClose());
	};

	return (
		<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex">
				<div className="mr-2">
					<label htmlFor="minPrice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
						Minimum Price
					</label>
					<input
						type="number"
						id="minPrice"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500  dark:text-white"
						{...register('minPrice')}
					/>
				</div>
				<div>
					<label htmlFor="maxPrice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
						Maximum Price
					</label>
					<input
						type="number"
						id="maxPrice"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
						{...register('maxPrice')}
					/>
				</div>
			</div>
			<div>
				<label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
					Category
				</label>
				<div className="flex">
					{categories.map((e) => (
						<div
							className={`p-5 rounded-lg mr-2 cursor-pointer text-white bg-slate-500 ${
								getValues('category') === e.id ? 'bg-slate-900' : ''
							}`}
							onClick={() => setValue('category', e.id)}
							key={e.id}
						>
							{e.attributes.name}
						</div>
					))}
				</div>
			</div>

			<button
				type="submit"
				className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Apply
			</button>
		</form>
	);
};

export default FilterForm;
