const {BrowserWindow, app} = require('electron');
const path = require('path');

class ExternalWebsiteController {

   constructor(externalUrl, iconPath, title) {
        this.externalUrl = externalUrl;
        this.iconPath = iconPath;
        this.title = title;
        this.browserWindowSettings = {
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
        }
        this.init();
    }

    async init() {
        this.win = new BrowserWindow(this.browserWindowSettings);

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

    cleanupAndQuit() {
        app.exit(0);
    }
}

module.exports = ExternalWebsiteController;
