import ProductItem from '@/models/product';
import { fetchData, REVALIDATE_IN_DAY } from '@/utils';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { FC, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiAddBoxLine } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import Modal from '@/components/Modal/Modal';
import DeleteProduct from '@/components/Forms/DeleteProduct';
import ProductForm from '@/components/Forms/ProductForm';
import Category from '@/models/category';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface ProductPageProps {
	data: {
		product: ProductItem | null;
		categories: Category[] | null;
	};
}

const Product: FC<ProductPageProps> = ({ data }) => {
	const [selectedPhoto, setSelectedPhoto] = useState(0);

	const productData = useQuery(
		['product', data.product?.id],
		() =>
			fetchData(`products/${data.product?.id}`, 'GET', {
				populate: '*',
			})
				.then((res) => {
					return res.data.data;
				})
				.catch((e) => {
					console.log({ e });
				}),
		{
			refetchOnMount: false,
			initialData: data.product,
		}
	);

	const queryClient = useQueryClient();

	const addToCart = (id?: number) => {
		fetchData(
			`carts`,
			'POST',
			{},
			{
				product: id,
			}
		).then(() => queryClient.invalidateQueries({ queryKey: ['product', data.product?.id] }));
	};

	return productData.data && data.categories ? (
		<>
			<Head>
				<title>{`E-commerce-${productData.data.attributes.name}`}</title>
				<meta name="description" content={productData.data.attributes.description} />
			</Head>
			<div>
				<div className="flex flex-col lg:flex-row">
					<div className="h-full w-full relative mr-20">
						<div className="relative flex justify-center">
							<Image
								src={'https://random.imagecdn.app/640/480'}
								alt={productData.data.attributes.name || ''}
								width={640}
								height={480}
							/>
						</div>
						<div className="flex justify-center mb-5">
							{productData.data.attributes.images.data.map((image: any, index: number) => {
								return (
									<Image
										key={index}
										src={'https://random.imagecdn.app/140/140'}
										width={140}
										height={140}
										alt={productData.data.attributes.name || ''}
										className="flex justify-center mt-4 pb-2 mr-2"
										style={{ borderColor: selectedPhoto === index ? 'black' : 'transparent' }}
										onClick={() => setSelectedPhoto(index)}
									/>
								);
							})}
						</div>
					</div>
					<div className="flex flex-col w-full">
						<div className="flex justify-between items-start mb-30">
							<div>
								<h2 className="text-2xl m-0">{productData.data.attributes.name || ''}</h2>
								<span className="text-lg text-gray-500 font-medium mb-5">
									{productData.data.attributes.price || 0}$
								</span>
							</div>
							<div className="flex">
								<Modal
									modalTitle={'Edit Product'}
									icon={<FiEdit fontSize={18} className="text-black-600 cursor-pointer mr-2" />}
								>
									<ProductForm categories={data.categories} product={productData.data} />
								</Modal>
								<Modal
									modalTitle={'Add Product'}
									icon={<RiAddBoxLine fontSize={18} className="text-black-600 cursor-pointer mr-2" />}
								>
									<ProductForm categories={data.categories} />
								</Modal>
								<Modal
									modalTitle={'Delete Product'}
									icon={<MdDelete fontSize={18} className="text-black-600 cursor-pointer mr-2" />}
								>
									<DeleteProduct productId={productData.data.id} />
								</Modal>
							</div>
						</div>

						<hr />

						<div className="mt-2">
							<button
								className="px-3 py-2 bg-black border-none rounded-lg font-bold text-white  w-full disabled:opacity-50"
								onClick={() => addToCart(data.product?.id)}
								disabled={Boolean(productData.data.attributes.cart?.data?.id)}
							>
								Add to Cart
							</button>
						</div>

						<h4 className="font-bold my-5">Description</h4>
						<p className="">{productData.data.attributes.description}</p>
					</div>
				</div>
			</div>
		</>
	) : (
		<>No Product</>
	);
};

export default Product;

export async function getStaticProps(context: GetStaticPropsContext) {
	//this call to get listed in form
	const categories = await fetchData(`categories`, 'GET')
		.then((res) => {
			return res.data.data;
		})
		.catch((e) => {
			console.log({ e });
		});
	const product = await fetchData(`products/${context?.params?.id}`, 'GET', {
		populate: '*',
	})
		.then((res) => {
			return res.data.data;
		})
		.catch((e) => {
			console.log({ e });
		});

	return {
		props: {
			data: { product, categories },
		}, // will be passed to the page component as props
		revalidate: REVALIDATE_IN_DAY,
	};
}

export async function getStaticPaths() {
	const paths = await fetchData(`products`, 'GET').then((res) => {
		// Get the paths we want to pre-render based on posts
		return res.data.data.map((e: ProductItem) => ({
			params: { id: `${e.id}` },
		}));
	});
	return { paths, fallback: false };
}
