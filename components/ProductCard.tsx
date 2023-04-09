import React, { FC } from 'react';
import Link from 'next/link';
import ProductItem from '@/models/product';
import Image from 'next/image';

interface ProductCardProps {
	product: ProductItem;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
	return (
		<Link href={`/product/${product.id}`}>
			<div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<Image
					src={'https://random.imagecdn.app/640/580'}
					alt={product.attributes.name}
					className="rounded-t-lg"
					width={640}
					height={580}
				/>
				<div className="px-5 py-3 text-center">
					<h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
						{product.attributes.name}
					</h5>

					<div className="flex items-center justify-center">
						<span className="text-xl font-bold text-gray-900 dark:text-white">${product.attributes.price}</span>
						{/* <a
							href="#"
							class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Add to cart
						</a> */}
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;
