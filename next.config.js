/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.arweave.net', 'arweave.net', 'ipfs.io']
  }
}

module.exports = nextConfig
