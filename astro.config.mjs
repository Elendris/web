import { defineConfig } from 'astro/config';
import astroI18next from "astro-i18next";

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    allowImportingTsExtensions: true,
    integrations: [astroI18next()],
    site: 'https://elendris.github.io/web/',
    base: isProduction ? '/web' : '/',
});