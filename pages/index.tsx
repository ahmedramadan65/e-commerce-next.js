import { FC } from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import ProductItem from '@/models/product';
import { fetchData, handlePriceFilters } from '@/utils';
import ProductCard from '@/components/ProductCard';
import Category from '@/models/category';

interface HomeProps {
	data: {
		products: ProductItem[];
		categories: Category[];
	};
}

const Home: FC<HomeProps> = ({ data }) => {
	return (
		<>
			<Head>
				<title>E-commerce</title>
				<meta name="description" content="this is E-commerce webapp" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{data?.products?.length ? (
				<div className="flex flex-wrap">
					{/* Iterate over products and render each product card */}
					{data.products.map((product) => (
						<div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4 flex justify-center">
							<ProductCard product={product} />
						</div>
					))}
				</div>
			) : (
				<div className="text-center font-bold">No Products</div>
			)}
		</>
	);
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const filters = handlePriceFilters(context.query);
	const products = await fetchData(`products`, 'GET', {
		populate: '*',
		...(filters as any),
	})
		.then((res) => {
			return res.data.data;
		})
		.catch((e) => {
			console.log({ e });
		});

	//get categories for filters
	const categories = await fetchData(`categories`, 'GET')
		.then((res) => {
			return res.data.data;
		})
		.catch((e) => {
			console.log({ e });
		});

	return {
		props: {
			data: { products, categories: categories },
		}, // will be passed to the page component as props
	};
}

export default Home;
