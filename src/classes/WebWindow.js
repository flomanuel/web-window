const {app, Tray, Menu} = require('electron');
const nativeImage = require('electron').nativeImage
const ExternalWebsiteController = require('../controller/ExternalWebsiteController');
const SettingsController = require('../controller/SettingsController');
const path = require('path');
const electronSettings = require('electron-settings');
const wwEvents = require('../constants/wwEvents');

class WebWindow {
    constructor() {
        this.externalWebsiteControllers = null;
        this.settings = null;
        this.appDir = app.getAppPath();
        this.settingsController = null;
    }

    init() {
        const lock = app.requestSingleInstanceLock();
        this.settings = electronSettings.getSync();

        if (!this.settings.user) {
            electronSettings.setSync('user', {'websites': []});
            this.settings = electronSettings.getSync();
        }

        if (!lock) {
            app.quit();
        } else {
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
            this.settings?.user?.websites?.forEach(async (ws) => {
                const externalWebsiteController = await new ExternalWebsiteController(ws.url, ws.iconPath, ws.title);
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
                        // icon: controller.iconPath,
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
                // icon: path.join(this.appDir, 'dist', 'assets', 'icons', 'close.png'),
                click: () => this.cleanupAndQuit()
            },
        );

        const context = Menu.buildFromTemplate(menuTemplate);
        const logoPath = path.join(this.appDir, 'dist', 'assets', '512x512.png');
        this.tray = new Tray(this.createTrayIcon(logoPath));
        this.tray.setContextMenu(context);
    }

    cleanupAndQuit() {
        app.exit(0);
    }
}

module.exports = WebWindow;
