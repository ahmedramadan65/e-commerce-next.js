import ProductItem from './product';

interface Category {
	id: number;
	attributes: {
		name: string;
		creationAt: string;
		updatedAt: string;
		products: {
			data: ProductItem[];
		};
	};
}

export default Category;
