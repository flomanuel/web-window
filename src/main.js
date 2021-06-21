const {app, Tray, Menu} = require('electron');
const ExternalWebsiteController = require('./controller/ExternalWebsiteController');
const {nativeImage} = require("electron");
const path = require('path');

class WebWindow {
    constructor() {
        this.externalWebsiteControllers = null;
    }

    init() {
        const lock = app.requestSingleInstanceLock();
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
        app.on('ready', () => {
            this.createControllers();
        })

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin' && (this.externalWebsiteControllers === null || this.externalWebsiteControllers instanceof Array && this.externalWebsiteControllers.length <= 0)) {
                app.quit();
            }
        })

        app.on('activate', () => {
            if (this.externalWebsiteControllers === null) {
                this.createControllers();
                this.createTray();
            } else {
                this.externalWebsiteControllers.forEach(controller => {
                    if (controller instanceof ExternalWebsiteController) {
                        controller.show();
                    }
                });
            }
        })
    }

    createControllers() {
        this.externalWebsiteControllers = [];
        this.externalWebsiteControllers.push(new ExternalWebsiteController('https://www.onenote.com/notebooks?auth=1', '../../assets/oneNote/512x512.png', 'OneNote Wrapper'));
        this.externalWebsiteControllers.push(new ExternalWebsiteController('https://to-do.microsoft.com/tasks/?auth=1', '../../assets/toDo/512x512.png', 'ToDo Wrapper'));
    }

    createTrayIcon(externalWebsiteController) {
        return externalWebsiteController ? nativeImage.createFromPath(path.join(__dirname, externalWebsiteController.iconPath)) : null;
    }

    createTray() {
        const menuTemplate = [
            {label: 'add new entry', click: () => "to stuff"}, //ToDo: add mechanism for adding new URL
            {label: 'list all entries', click: () => "to more fancy stuff"}, //ToDo: add mechanism for listing and editing all URLs
            {label: 'Separator', type: 'separator'},
        ];

        if (this.externalWebsiteControllers.length > 0) {
            this.externalWebsiteControllers.forEach(extWebCont => {
                menuTemplate.concat({
                        submenu: [
                            {icon: this.createTrayIcon(extWebCont)},
                            {label: 'show me', click: () => extWebCont.toggleWindow()},
                            {label: 'quit', click: () => extWebCont.cleanupAndQuit()},
                        ],
                    },
                );
            });
        }

        console.log(menuTemplate);
        const context = Menu.buildFromTemplate(menuTemplate);
        this.tray = new Tray(path.join(__dirname, '../assets/512x512.png')); //ToDo: create real logo
        this.tray.setContextMenu(context);
    }
}

new WebWindow().init();
