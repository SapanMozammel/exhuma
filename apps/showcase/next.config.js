/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@exhuma/cards', '@exhuma/layouts', '@exhuma/router', '@exhuma/core', '@exhuma/registry'],
};

module.exports = nextConfig;
