import React, { FC } from 'react';
import Header from './Header';
import CategoriesBar from './CategoryBar';
import CategoryItem from '@/models/category';

interface LayoutProps {
	children: React.ReactNode;
	categories: CategoryItem[];
}

const Layout: FC<LayoutProps> = ({ children, categories }) => {
	return (
		<div className="flex items-center justify-center">
			<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen">
				<Header />
				<div className="flex flex-col overflow-hidden mt-30 md:flex-row md:mt-50">
					<CategoriesBar categories={categories} />
					{children}
				</div>
			</div>
		</div>
	);
};

export default Layout;
