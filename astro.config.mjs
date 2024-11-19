import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import astroI18next from "astro-i18next";

export default defineConfig({
  i18n: {
    defaultLocale: "cs",
    locales: ["en", "cs"],
  },
  allowImportingTsExtensions: true,
  site: "https://elendris.cz",
  base: "/",
  integrations: [
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
