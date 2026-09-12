/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		'@exhuma/cards',
		'@exhuma/layouts',
		'@exhuma/router',
		'@exhuma/core',
	],
};

module.exports = nextConfig;
