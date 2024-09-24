import { defineConfig } from 'astro/config';
import astroI18next from "astro-i18next";

// https://astro.build/config
export default defineConfig({
    allowImportingTsExtensions: true,
    integrations: [astroI18next()],
    site: 'https://elendris.github.io/web/',
    base: '/web/',
    vite: {
        base: '/web/',
    },
});