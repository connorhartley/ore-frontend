import Vue from "vue"
import VueI18n from "vue-i18n"

Vue.use(VueI18n);

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'en',
    messages: {
      'en': import('~/locales/en.json'),
      'de': import('~/locales/de.json')
    }
  });

  // Initializes the regex to check if the route starts with an available language
  let langRegEx = "^\\/(";
  store.state.locales.forEach(locale => langRegEx +=  locale + "|");
  langRegEx = langRegEx.substring(0, langRegEx.length - 1);
  langRegEx += ")(.*)$";

  app.i18nRegEx = langRegEx;

  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${app.i18n.locale}/${link}`
  }
}
