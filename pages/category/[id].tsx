import ProductCard from '@/components/ProductCard';
import Category from '@/models/category';
import ProductItem from '@/models/product';
import { fetchData, handlePriceFilters, REVALIDATE_IN_DAY } from '@/utils';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { FC } from 'react';

interface CategoryPageProps {
	data: {
		category: Category;
		products: ProductItem[];
	};
}

const CategoryPage: FC<CategoryPageProps> = ({ data }) => {
	return data.category && data.products ? (
		<>
			<Head>
				<title>{`E-commerce-${data.category.attributes.name}`}</title>
				<meta name="description" content={data.category.attributes.name} />
			</Head>

			<div className="flex flex-wrap">
				{/* Iterate over products and render each product card */}
				{data.products.map((product) => (
					<div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4 flex justify-center">
						<ProductCard product={product} />
					</div>
				))}
			</div>
		</>
	) : (
		<div className="text-center font-bold">No Products</div>
	);
};

export default CategoryPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const filters = handlePriceFilters(context.query, Number(context?.params?.id));
	const category = await fetchData(`categories/${context?.params?.id}`, 'GET', {
		populate: '*',
	})
		.then((res) => {
			return res.data.data;
		})
		.catch((e) => {
			console.log({ e });
		});
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

	return {
		props: {
			data: { category, products },
		}, // will be passed to the page component as props
	};
}
