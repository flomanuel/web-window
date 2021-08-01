const path = require('path');
const {app} = require('electron');

class AbstractController {
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
     */
    constructor(iconPath, title) {
        this.appDir = app.getAppPath();
        this.iconPath = iconPath;
        this.title = title;
        this.win = null;
    }

    init() {
        this.win.webContents.on('dom-ready', () => {
            this.show();
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

    toggleWindow() {
        if (!this.win.isMinimized()) {
            if (!this.win.isFocused()) {
                this.win.focus();
            } else {
                this.win.minimize();
            }
        } else {
            this.show();
        }
    }
}

module.exports = AbstractController;
