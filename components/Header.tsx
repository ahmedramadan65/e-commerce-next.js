import React from 'react';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
	return (
		<header className="flex flex-col items-center justify-between py-4 md:flex-row md:items-center md:justify-between">
			<Link href={'/'}>
				<div className="flex items-center">
					<Image src="/images/logo.png" alt="Logo" width={32} height={32} />
					<h1 className="text-4xl font-bold ml-2">E-commerce</h1>
				</div>
			</Link>
			<div className="flex items-center mt-4 md:mt-0">
				<input
					type="text"
					placeholder="Search"
					className="px-4 py-2 rounded-lg border-gray-400 mr-4 focus:outline-none focus:border-blue-500 bg-gray-100"
				/>
				<FaSearch className="text-gray-600 cursor-pointer mr-2" />
				<Link href={'/my-cart'}>
					<Image src="/images/logo.png" alt="Logo" width={32} height={32} />
				</Link>
			</div>
		</header>
	);
};

export default Header;
