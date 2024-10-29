import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';

i18next.use(Backend).init({
  lng: 'cs',
  fallbackLng: 'cs',
  backend: {
    loadPath: join(__dirname, 'locales/{{lng}}/{{ns}}.json')
  }
});

export default i18next;