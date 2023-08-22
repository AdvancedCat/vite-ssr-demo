export default class Base {
    constructor(app) {
        this.app = app;

        this.config = app.config;
        this.service = app.service;
    }

    get helper() {
        return this.app.helper;
    }
}
