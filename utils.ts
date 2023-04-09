import axios from 'axios';
import { ParsedUrlQuery } from 'querystring';

const REVALIDATE_IN_DAY = 86400; //Day in seconds
const REVALIDATE_IN_MONTH = 2592000; //Month in seconds
const REVALIDATE_EDITORIAL_CONTENT_IN_SECONDS = 1800; // 30min
const REVALIDATE_EDITORIAL_CONTENT_LANDING_IN_SECONDS = 60; // 1min

const handlePriceFilters = (filterObj: ParsedUrlQuery, categoryId?: number) => {
	const priceObject =
		filterObj.minPrice && filterObj.maxPrice
			? { $gte: filterObj.minPrice, $lte: filterObj.maxPrice }
			: filterObj.minPrice
			? { $gte: filterObj.minPrice }
			: filterObj.maxPrice
			? { $lte: filterObj.maxPrice }
			: {};
	return {
		// ...(filterObj.minPrice || filterObj.maxPrice || categoryId
		// 	?
		//  {
		filters: {
			price: { ...priceObject },
			...(categoryId ? { category: { id: { $eq: categoryId } } } : {}),
		},
		...(filterObj.sort ? { sort: [filterObj.sort] } : {}),

		//   }
		// : {}),
	};
};

const fetchData = (
	entity: string,
	method: string,
	params?: { [key: string]: string },
	body?: { [key: string]: any }
) => {
	return axios(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${entity}`, {
		method: method,
		headers: {
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
		},
		params: { ...(params ? params : {}) },
		data: {
			...(method === 'POST' || method === 'PUT' ? { data: { ...body } } : {}),
		},
	});
};

export {
	fetchData,
	handlePriceFilters,
	REVALIDATE_IN_DAY,
	REVALIDATE_IN_MONTH,
	REVALIDATE_EDITORIAL_CONTENT_IN_SECONDS,
	REVALIDATE_EDITORIAL_CONTENT_LANDING_IN_SECONDS,
};
