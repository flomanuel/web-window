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
        super(iconPath, title);
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
            width: 700,
            height: 700,
            autoHideMenuBar: true,
            show: false,
            title: this.title,
            // icon: this.iconPath,
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

        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES.toString(), (event) => {
            electronSettings.setSync('user.websites', []);
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES_RESPONSE.toString(), true);
        });
    }

    /**
     *
     * @param args {title, url, imgPath}
     */
    saveNewSettingsEntry(args) {
        const userSettings = electronSettings.getSync('user');
        let iconPath = '';
        if (typeof args.imgPath === 'string' && args.imgPath !== '') {
            iconPath = `data:image/png;base64,${this.base64Encode(args.imgPath)}`;
        }
        userSettings?.websites.push(
            {
                'url': args.url,
                'iconPath': iconPath,
                'title': args.title,
                'id': args.id
            }
        );
        electronSettings.setSync('user', userSettings);
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
}

module.exports = SettingsController;
