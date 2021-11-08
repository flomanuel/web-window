const {BrowserWindow, ipcMain} = require('electron');
const AbstractController = require('./AbstractController');
const path = require('path');
const electronSettings = require('electron-settings');
const wwEvents = require('../constants/wwEvents')
const fs = require('fs');


class SettingsController extends AbstractController {

    /**
     *
     * @param iconPath
     * @param title
     */
    constructor(iconPath, title) {
        super(iconPath, title, true);
        this.init().catch(e => {
            throw `Error creating SettingsController: ${e}`
        });
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async init() {
        this.win = new BrowserWindow({
            x: 100,
            y: 100,
            width: 1000,
            height: 700,
            autoHideMenuBar: true,
            show: false,
            title: this.title,
            webPreferences: {
                spellcheck: true,
                preload: path.join(this.appDir, 'frontend', 'preload.js'),
            },
            skipTaskbar: true
        });
        super.init();
        this.handleIpcRenderRequests();
        await this.win.loadFile(path.join(this.appDir, 'frontend', 'index.html'));
    }

    handleIpcRenderRequests() {
        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS.toString(), (event) => {
            const userSettings = electronSettings.getSync('user');
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS_RESPONSE.toString(), userSettings);
        });

        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS.toString(), (event, args) => {
            this.saveNewSettingsEntry(args);
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS_RESPONSE.toString(), true);
        });

        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_UPDATE_WEBSITE_ENTRY.toString(), (event, args) => {
            this.updateWebsiteEntry(args);
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_UPDATE_WEBSITE_ENTRY_RESPONSE.toString(), true);
        });

        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES.toString(), (event) => {
            electronSettings.setSync('user.websites', []);
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES_RESPONSE.toString(), true);
        });

        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITE_ENTRY.toString(), (event, id) => {
            const websites = electronSettings.getSync('user.websites');
            const wsFiltered = websites?.filter(ws => ws.id !== id);
            electronSettings.setSync('user.websites', wsFiltered);
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITE_ENTRY_RESPONSE.toString(), true);
        })

        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_SINGLE_WEBSITE_ENTRY.toString(), (event, id) => {
            const websites = electronSettings.getSync('user.websites');
            const website = websites?.filter(ws => ws.id === id);
            event.sender.send(
                wwEvents.SETTINGS_WINDOW_REQ_SINGLE_WEBSITE_ENTRY_RESPONSE.toString(),
                website.length > 0 ? website[0] : false
            );
        })
    }

    /**
     *
     * @param args {title, url, imgPath, externalUrls, openAtStartup}
     */
    saveNewSettingsEntry(args) {
        const userSettings = electronSettings.getSync('user');
        userSettings?.websites.push(
            {
                'url': this.formatUrl(args.url),
                'iconPath': this.convertIconPathToBase64String(args.imgPath),
                'title': args.title,
                'id': args.id,
                'externalUrls': args.externalUrls,
                'openAtStartup': args.openAtStartup
            }
        );
        electronSettings.setSync('user', userSettings);
    }

    /**
     *
     * @param args {title, url, imgPath, externalUrls, id, openAtStartup}
     */
    updateWebsiteEntry(args) {
        let websites = electronSettings.getSync('user.websites');
        websites = websites?.map(ws => {
            if (ws.id === args.id) {
                ws.title = args.title;
                ws.url = args.url;
                ws.iconPath = this.convertIconPathToBase64String(args.imgPath);
                ws.externalUrls = args.externalUrls;
                ws.openAtStartup = args.openAtStartup;
            }
            return ws;
        })
        electronSettings.setSync('user.websites', websites);
    }

    /**
     *
     * @param url
     * @return {string}
     */
    formatUrl(url) {
        if (!url.match(/(http)(s)?(:\/\/)/)) {
            url = 'https://' + url
        }
        return url;
    }

    /**
     *
     * @param filePath
     * @returns {string}
     */
    base64Encode(filePath) {
        const bitmap = fs.readFileSync(filePath);
        return new Buffer(bitmap).toString('base64');
    }

    /**
     *
     * @param imgPath
     * @return {string}
     */
    convertIconPathToBase64String(imgPath) {
        if (!this.isBase64String(imgPath)) {
            let iconPath = '';
            if (typeof imgPath === 'string' && imgPath !== '') {
                iconPath = `data:image/png;base64,${this.base64Encode(imgPath)}`;
            }
            return iconPath;
        } else {
            return imgPath;
        }
    }

    /**
     *
     * @param imgPath
     * @return {boolean}
     */
    isBase64String(imgPath) {
        return imgPath.startsWith('data:image/png;base64');
    }
}

module.exports = SettingsController;
