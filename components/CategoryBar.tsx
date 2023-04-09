import CategoryItem from '@/models/category';
import Link from 'next/link';
import { FC } from 'react';

interface CategoriesBarProps {
	categories: CategoryItem[];
}

const CategoriesBar: FC<CategoriesBarProps> = ({ categories }) => {
	return (
		<div className="flex flex-col h-full text-sm font-medium md:w-1/4 ">
			<Link href={'/'}>
				<h2 className="text-3xl font-bold m-0 md:mb-6 min-w-150 ">Explore</h2>
			</Link>
			<ul className="list-none p-0 flex overflow-x-auto scrollbar-none md:flex-col flex-row justify-around">
				{categories.map((category) => (
					<li key={category.id} className="py-4 md:flex md:flex-row md:items-center md:justify-between">
						<Link
							href={`/category/${category.id}` || '/'}
							className="flex flex-col items-center w-full min-w-100px md:flex-row md:min-w-auto"
						>
							<span>{category.attributes.name}</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CategoriesBar;
