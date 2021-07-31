import {BrowserWindow, ipcMain} from "electron";
import * as path from "path";
import * as fs from "fs";
import AbstractController from "./AbstractController";
import * as electronSettings from "electron-settings";
import {wwEvents} from "../constants/wwEvents";

export default class SettingsController extends AbstractController {

    /**
     *
     * @param iconPath
     * @param title
     */
    constructor(iconPath: string, title: string) {
        super(iconPath, title);
        this.init();
    }

    /**
     *
     * @protected
     */
    protected init() {
        this.win = new BrowserWindow({
            x: 100,
            y: 100,
            width: 700,
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
        this.handleRenderProcessRequests();
        this.win.loadFile(path.join(this.appDir, 'frontend', 'index.html'));
    }

    /**
     *
     * @private
     */
    private handleRenderProcessRequests() {
        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS.toString(), (event) => {
            const userSettings = electronSettings.getSync('user');
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS_RESPONSE.toString(), userSettings);
        });

        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS.toString(), (event, args) => {
            SettingsController.saveNewSettingsEntry(args);
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS_RESPONSE.toString(), true);
        });

        ipcMain.on(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES.toString(), (event) => {
            electronSettings.setSync('user.websites', []);
            event.sender.send(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES_RESPONSE.toString(), true);
        });
    }

    /**
     *
     * @param args
     * @private
     */
    private static saveNewSettingsEntry(args: { title: string, url: string, imgPath: string, id: string }) {
        const userSettings: any = electronSettings.getSync('user');
        let iconPath = '';
        if (typeof args.imgPath === 'string') {
            iconPath = `data:image/png;base64,${SettingsController.base64Encode(args.imgPath)}`;
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
     * @private
     */
    private static base64Encode(filePath: string) {
        const bitmap = fs.readFileSync(filePath);
        return new Buffer(bitmap).toString('base64');
    }
}
