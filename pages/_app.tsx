import { ChangeEvent, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { fetchData } from '@/utils';
import Modal from '@/components/Modal/Modal';
import FilterForm from '@/components/Forms/FilterForm';
import Router, { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function App({ Component, pageProps }: AppProps) {
	const [categories, setCategories] = useState([]);
	const queryClient = new QueryClient();
	const router = useRouter();
	useEffect(() => {
		fetchData('categories', 'GET')
			.then((res) => {
				setCategories(res.data.data);
			})
			.catch((e) => {});
	}, []);

	const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
		const sortOrder = e.target.value;
		if (sortOrder !== 'none') {
			Router.push({
				pathname: router.asPath.split('?')[0],
				query: {
					...router.query,
					sort: e.target.value,
				},
			});
		} else {
			const query = router.query;
			if (query.sort) delete query.sort;
			Router.push({
				pathname: router.asPath.split('?')[0],
				query: { ...query },
			});
		}
	};

	return (
		<QueryClientProvider client={queryClient}>
			<Layout categories={categories}>
				<div className="w-full">
					<main className="pb-40 mt-5">
						{!router.asPath.includes('my-cart') && (
							<div className="flex mb-10 justify-center md:justify-end">
								<div className="flex items-center text-sm font-bold">
									{!router.asPath.includes('product') && (
										<div className="mr-5">
											<select
												className="appearance-none px-6 py-2 bg-black border-none rounded-lg font-bold text-white  cursor-pointer text-center focus:outline-none "
												id="sortOrder"
												onChange={handleSort}
											>
												<option value="none">Sort By</option>
												<option value="name">Ascending-Alphabetically</option>
												<option value="name:desc">Descending-Alphabetically</option>
												<option value="price">Ascending-Price</option>
												<option value="price:desc">Descending-Price</option>
												<option value="createdAt">Ascending-Creation Date</option>
												<option value="createdAt:desc">Descending-Creation Date</option>
											</select>
										</div>
									)}

									<Modal modalTitle={'Select your Filters'} modalButtonText={'Filter'}>
										<FilterForm categories={categories} />
									</Modal>
								</div>
							</div>
						)}
						<Component {...pageProps} />
					</main>
				</div>
			</Layout>
		</QueryClientProvider>
	);
}
