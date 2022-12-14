/** @type {import('next').NextConfig} */
// @ts-check
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: i18n
}

module.exports = nextConfig
