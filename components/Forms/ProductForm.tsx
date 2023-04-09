import { fetchData } from '@/utils';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Category from '@/models/category';
import ProductItem from '@/models/product';
import { useQueryClient } from '@tanstack/react-query';

interface ProductFormProps {
	categories: Category[];
	product?: ProductItem;
	handleClose?: () => void;
}

type Inputs = {
	name: string;
	price: number;
	description: string;
	images: Blob[];
	category: number;
};

const schema = yup
	.object({
		name: yup.string().required().min(3).max(100), //this depends on my backend validations
		price: yup.number().positive().integer().required(),
		description: yup.string().required().min(3).max(1000),
		category: yup.number().positive().integer().required(),
	})
	.required();

const ProductForm: FC<ProductFormProps> = ({ handleClose, categories, product }) => {
	const [serverError, setServerError] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		watch,
	} = useForm<Inputs>({
		resolver: yupResolver(schema),
		defaultValues: {
			name: product?.id ? product.attributes.name : '',
			category: product?.id ? product.attributes.category.data.id : undefined,
			description: product?.id ? product.attributes.description : '',
			price: product?.id ? product.attributes.price : undefined,
		},
	});
	const watchedCategories = watch(['category']);
	useEffect(() => {}, [watchedCategories]);

	const queryClient = useQueryClient();

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		// const formData = new FormData();
		// formData.append('images', data.images.map((e)=>e));

		product?.id
			? fetchData(
					`products/${product.id}`,
					'PUT',
					{},
					{
						// data: {
						name: data.name,
						price: data.price,
						description: data.description,
						category: data.category,
						// },
					}
			  )
					.then(() => {
						queryClient.invalidateQueries({ queryKey: ['product', product?.id] });
						return handleClose && handleClose();
					})
					.catch((e) => {
						setServerError(e.response.data.error.message);
					})
			: fetchData(
					'products',
					'POST',
					{},
					{
						// data: {
						name: data.name,
						price: data.price,
						description: data.description,
						category: data.category,
						// },
					}
			  )
					.then(() => handleClose && handleClose())
					.catch((e) => {
						setServerError(e.response.data.error.message);
					});
	};

	return (
		<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
					Name
				</label>
				<input
					type="text"
					id="name"
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
					placeholder="Name"
					{...register('name', { required: true })}
				/>
				<p className="text-red-400">{errors.name?.message}</p>
			</div>
			<div>
				<label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
					Price
				</label>
				<input
					type="number"
					id="price"
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
					{...register('price', { required: true })}
				/>
				<p className="text-red-400">{errors.price?.message}</p>
			</div>
			<div>
				<label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
					Description
				</label>
				<textarea
					id="description"
					cols={40}
					rows={5}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
					placeholder="Description"
					{...register('description', { required: true })}
				/>
				<p className="text-red-400">{errors.description?.message}</p>
			</div>
			<div {...register('category', { required: true })}>
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

				<p className="text-red-400">{errors.category && 'please select 1 category'}</p>
			</div>
			<div>
				<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black" htmlFor="images">
					Upload images
				</label>
				<input
					className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					id="images"
					multiple
					type="file"
					{...register('images', { required: true })}
				/>
				{errors.images && <p className="text-red-400">Please select an image</p>}
				{/* i didnt upload images because i got an issue with my server so i neglect it */}
			</div>

			<button
				type="submit"
				className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				{product?.id ? 'Edit' : 'Add'}
			</button>
			{serverError && <p className="text-red-400">{serverError}</p>}
		</form>
	);
};

export default ProductForm;
