const path = require('path');
const {app} = require('electron');


class AbstractController {

    /**
     *
     * @return {boolean}
     */
    get openAtStartup() {
        return this._openAtStartup;
    }

    /**
     *
     * @param value
     */
    set openAtStartup(value) {
        this._openAtStartup = value;
    }

    /**
     *
     * @returns {string}
     */
    get iconPath() {
        return this._iconPath !== '' ? this._iconPath : path.join(this.appDir, 'assets', '512x512.png');
    }

    /**
     *
     * @param value
     */
    set iconPath(value) {
        this._iconPath = value;
    }

    /**
     *
     * @returns {string}
     */
    get title() {
        return this._title !== '' && this._title !== undefined ? this._title : 'Element Title';
    }

    /**
     *
     * @param value
     */
    set title(value) {
        this._title = value;
    }

    /**
     *
     * @param iconPath
     * @param title
     * @param openAtStartup
     */
    constructor(iconPath, title, openAtStartup) {
        this.appDir = app.getAppPath();
        this.iconPath = iconPath;
        this.title = title;
        this.win = null;
        this.openAtStartup = openAtStartup
    }

    init() {
        this.win.webContents.on('dom-ready', () => {
            if (this.openAtStartup) {
                this.show();
            }
        });

        this.win.on('close', (e) => {
            if (this.win.isVisible()) {
                e.preventDefault();
                this.win.minimize();
            }
        });

        this.win.on('closed', () => {
            this.win = null
        });
    }

    show() {
        this.win.show();
        this.win.focus();
    }
}

module.exports = AbstractController;
