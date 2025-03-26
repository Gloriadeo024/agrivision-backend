const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const { join } = require("path");

i18next.use(Backend).init({
    lng: "en",
    fallbackLng: "en",
    backend: {
        loadPath: join(__dirname, "../locales/{{lng}}.json"),
    },
});

module.exports = i18next;

