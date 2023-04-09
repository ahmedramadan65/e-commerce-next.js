import Category from './category';

interface ProductItem {
	id: number;
	attributes: {
		name: string;
		price: number;
		description: string;
		createdAt: string;
		updatedAt: string;
		images: {
			data: {
				id: number;
				attributes: {
					url: string;
				};
			}[];
		};
		category: {
			data: Category;
		};
		cart?: {
			data: { id: number };
		};
	};
}

export default ProductItem;
