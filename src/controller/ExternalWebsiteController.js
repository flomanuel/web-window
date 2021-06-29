const {BrowserWindow} = require('electron');
const path = require('path');

class ExternalWebsiteController {
    get title() {
        return this._title !== '' && this._title !== undefined ? this._title : 'Element Title';
    }

    set title(value) {
        this._title = value;
    }

    constructor(externalUrl, iconPath, title) {
        this.externalUrl = externalUrl;
        this.iconPath = iconPath;
        this.title = title;
        this.init();
    }

    async init() {
        this.win = new BrowserWindow({
            x: 100,
            y: 100,
            width: 1400,
            height: 900,
            autoHideMenuBar: true,
            show: false,
            title: this.title,
            icon: path.join(__dirname, this.iconPath),
            webPreferences: {
                spellcheck: true
            },
            skipTaskbar: true
        });

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

        await this.win.loadURL(this.externalUrl);
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

    show() {
        this.win.show();
        this.win.focus();
    }
}

module.exports = ExternalWebsiteController;
