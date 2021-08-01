import SettingsController from "../controller/SettingsController";
import AbstractController from "../controller/AbstractController";
import ExternalWebsiteController from "../controller/ExternalWebsiteController";
import {wwEvents} from "../constants/wwEvents";

import {app, Tray, Menu, nativeImage} from "electron";
import * as path from "path";
import * as electronSettings from "electron-settings";
import * as crypto from "crypto";


export default class WebWindow {
    externalWebsiteControllers: AbstractController[] = null;
    settings: any = null;
    appDir: string;
    settingsController: SettingsController = null;


    constructor() {
        this.appDir = app.getAppPath();
    }

    init() {
        const lock = app.requestSingleInstanceLock();
        this.settings = electronSettings.getSync();

        if (!lock) {
            app.quit();
        } else {
            if (!this.settings.user) {
                electronSettings.setSync('user', {'websites': []});
                electronSettings.setSync('version', process.env.npm_package_version);
                this.settings = electronSettings.getSync();
            } else {
                this.migrateUserData();
            }

            app.on('second-instance', () => {
                if (this.externalWebsiteControllers !== null) {
                    this.externalWebsiteControllers.forEach(controller => {
                        if (controller instanceof ExternalWebsiteController) {
                            controller.show();
                        }
                    });
                }
            });
            this.initApp();
        }
    }

    migrateUserData() {
        if (!this.settings.version || this.settings.version !== process.env.npm_package_version) {
            this.settings.version = process.env.npm_package_version;
            electronSettings.setSync('version', this.settings.version);
        }

        this.settings.user.websites?.forEach((website: any) => {
            if (!website.id) {
                website.id = crypto.createHmac('md5', Date.now().toString() + Math.random()).update(Date.now().toString() + Math.random()).digest('hex')
            }
        });
        if (this.settings.user.websites.length > 0) {
            electronSettings.setSync('user.websites', this.settings.user.websites)
        }
    }


    initApp() {
        app.whenReady().then(async () => {
            await this.createControllers();
            this.createTray();
            if (this.externalWebsiteControllers.length <= 0) {
                app.emit(wwEvents.SETTINGS_WINDOW_OPENED.toString());
            }
        })

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin' && (this.externalWebsiteControllers === null || this.externalWebsiteControllers instanceof Array && this.externalWebsiteControllers.length <= 0)) {
                app.quit();
            }
        })

        // @ts-ignore
        app.on(wwEvents.SETTINGS_WINDOW_OPENED.toString(), async () => {
            if (this.settingsController === null) {
                this.settingsController = await new SettingsController(null, 'Settings');
            } else {
                this.settingsController.toggleWindow();
            }
        })
    }

    /**
     *
     * @returns {Promise<ExternalWebsiteController[]>}
     */
    createControllers() {
        this.externalWebsiteControllers = [];
        return new Promise(resolve => {
            this.settings?.user?.websites?.forEach(async (ws: any) => {
                const externalWebsiteController = await new ExternalWebsiteController(ws.url, ws.iconPath, ws.title);
                this.externalWebsiteControllers.push(externalWebsiteController);
            });
            resolve(this.externalWebsiteControllers);
        });
    }

    /**
     *
     * @param iconPath
     */
    createTrayIcon(iconPath: string) {
        return nativeImage.createFromPath(iconPath);
    }

    createTray() {
        const menuTemplate: any[] = [];
        let tray: Tray;
        if (this.externalWebsiteControllers.length > 0) {
            this.externalWebsiteControllers.forEach(controller => {
                menuTemplate.push({
                        label: controller.title,
                        submenu: [
                            {label: 'show me', click: () => controller.toggleWindow()},
                        ],
                    },
                );
            });
        }

        menuTemplate.push(
            {label: 'Separator', type: 'separator'},
            {label: 'settings', click: () => app.emit(wwEvents.SETTINGS_WINDOW_OPENED.toString())},
            {
                label: 'quit',
                click: () => this.cleanupAndQuit()
            },
        );

        const context = Menu.buildFromTemplate(menuTemplate);
        const logoPath = path.join(this.appDir, 'assets', '512x512.png');
        tray = new Tray(this.createTrayIcon(logoPath));
        tray.setContextMenu(context);
    }

    cleanupAndQuit() {
        app.exit(0);
    }
}
