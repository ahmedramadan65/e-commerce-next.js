import { FC } from 'react';
import Head from 'next/head';
import ProductItem from '@/models/product';
import { fetchData, REVALIDATE_IN_DAY } from '@/utils';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';

interface MyCartProps {
	data: {
		cart: {
			id: number;
			attributes: {
				product: { data: ProductItem };
			};
		}[];
	};
}

const MyCart: FC<MyCartProps> = ({ data }) => {
	const cartData = useQuery(
		['cart'],
		() =>
			fetchData(`carts`, 'GET', {
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
			initialData: data,
		}
	);

	return (
		<>
			<Head>
				<title>My Cart</title>
				<meta name="description" content="this is my cart" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			{cartData.data?.cart?.length ? (
				<div className="flex flex-wrap">
					{/* Iterate over products and render each product card */}
					{cartData.data.cart.map((cart: any) => (
						<div key={cart.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4 flex justify-center">
							<ProductCard product={cart.attributes.product.data} />
						</div>
					))}
				</div>
			) : (
				<div className="text-center font-bold">No Products</div>
			)}
		</>
	);
};
export async function getStaticProps() {
	const cart = await fetchData(`carts`, 'GET', {
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
			data: { cart },
		}, // will be passed to the page component as props
		revalidate: REVALIDATE_IN_DAY,
	};
}

export default MyCart;
