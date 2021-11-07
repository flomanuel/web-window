const {app, Tray, Menu} = require('electron');
const nativeImage = require('electron').nativeImage
const path = require('path');
const electronSettings = require('electron-settings');

const ExternalWebsiteController = require('../controller/ExternalWebsiteController');
const SettingsController = require('../controller/SettingsController');
const wwEvents = require('../constants/wwEvents');
const UserDataStructureUpdater = require("./UserDataStructureUpdater");


class WebWindow {
    constructor() {
        this.externalWebsiteControllers = null;
        this.settings = null;
        this.appDir = app.getAppPath();
        this.settingsController = null;
    }

    init() {
        const lock = app.requestSingleInstanceLock();
        process.setFdLimit(8192);
        this.settings = electronSettings.getSync();

        if (!lock) {
            app.quit();
        } else {
            const userDataStructureUpdater = new UserDataStructureUpdater(this.settings);
            this.settings = userDataStructureUpdater.update();

            app.on('second-instance', () => {
                if (this.externalWebsiteControllers !== null) {
                    this.externalWebsiteControllers.forEach(controller => {
                        if (controller instanceof ExternalWebsiteController && controller.openAtStartup) {
                            controller.show();
                        }
                    });
                }
            });
            this.initApp();
        }
    }

    initApp() {
        app.whenReady().then(async () => {
            await this.createControllers();
            this.createTray();
            const lengthExtWs = this.externalWebsiteControllers.length;
            if (lengthExtWs <= 0 || lengthExtWs > 0 && !this.externalWebsiteControllers.some(
                c => c.openAtStartup === true
            )) {
                app.emit(wwEvents.SETTINGS_WINDOW_OPENED.toString());
            }
        })

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin' && (this.externalWebsiteControllers === null || this.externalWebsiteControllers instanceof Array && this.externalWebsiteControllers.length <= 0)) {
                app.quit();
            }
        })

        app.on(wwEvents.SETTINGS_WINDOW_OPENED.toString(), async () => {
            if (this.settingsController === null) {
                this.settingsController = await new SettingsController(null, 'Settings');
            } else {
                this.settingsController.show();
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
            this.settings?.user?.websites?.forEach(async (ws) => {
                const externalWebsiteController = await new ExternalWebsiteController(ws.url, ws.iconPath, ws.title, ws.openAtStartup);
                this.externalWebsiteControllers.push(externalWebsiteController);
            });
            resolve(this.externalWebsiteControllers);
        });
    }

    /**
     *
     * @param iconPath
     * @returns {Electron.NativeImage}
     */
    createTrayIcon(iconPath) {
        return nativeImage.createFromPath(iconPath);
    }

    createTray() {
        const menuTemplate = [];
        if (this.externalWebsiteControllers.length > 0) {
            this.externalWebsiteControllers.forEach(controller => {
                menuTemplate.push({
                        label: controller.title,
                        click: () => controller.show()
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
        this.tray = new Tray(this.createTrayIcon(logoPath));
        this.tray.setContextMenu(context);
    }

    cleanupAndQuit() {
        app.exit(0);
    }
}

module.exports = WebWindow;
