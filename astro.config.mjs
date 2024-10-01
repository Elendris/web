import { defineConfig } from 'astro/config';
import astroI18next from "astro-i18next";

// Determine if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
    allowImportingTsExtensions: true,
    integrations: [astroI18next()],
    site: 'https://elendris.github.io/web/',
    base: isProduction ? '/web' : '/',
});