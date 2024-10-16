import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown'
import sitemap from '@astrojs/sitemap';
import astroI18next from "astro-i18next";

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    allowImportingTsExtensions: true,
    integrations: [
        astroI18next(),
        sitemap(),
        partytown({
            config: {
              forward: ["dataLayer.push"],
            },
        }),
    ],
    site: 'https://elendris.cz/',
    base: isProduction ? '/web' : '/',
});