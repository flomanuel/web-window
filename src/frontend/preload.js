const {contextBridge, ipcRenderer} = require('electron')
const wwEvents = require('../constants/wwEvents')
const HashGeneratorBackend = require("../classes/HashGeneratorBackend");


class SettingsPreload {

    init() {
        this.prepareEvents();
    }

    prepareEvents() {
        ipcRenderer.setMaxListeners(0);
        contextBridge.exposeInMainWorld('electron', {
            'userSettings': () => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS.toString());
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS_RESPONSE.toString(), (e, args) => {
                        resolve(args ? args : {})
                    })
                });
            },
            'getSingleWebsiteEntry': (id) => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_SINGLE_WEBSITE_ENTRY.toString(), id);
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_SINGLE_WEBSITE_ENTRY_RESPONSE.toString(), (e, args) => {
                        resolve(args);
                    })
                })
            },
            'clearWebsites': () => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES.toString())
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES_RESPONSE.toString(), (e, args) => {
                        resolve(args);
                    })
                })
            },
            'removeWebsiteEntry': (id) => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITE_ENTRY.toString(), id)
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITE_ENTRY_RESPONSE.toString(), (e, args) => {
                        resolve(args);
                    })
                })
            },
            'saveNewEntry': (title, url, imgPath, externalUrls, openAtStartup) => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS.toString(), {
                    title: title,
                    url: url,
                    imgPath: imgPath,
                    id: HashGeneratorBackend.generateHashFromString(Date.now().toString() + Math.random(), Date.now().toString() + Math.random() + title),
                    externalUrls: externalUrls,
                    openAtStartup: openAtStartup
                })
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS_RESPONSE.toString(), (e, args) => {
                        resolve(args);
                    })
                })
            },
            'updateWebsiteEntry': (title, url, imgPath, externalUrls, id, openAtStartup) => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_UPDATE_WEBSITE_ENTRY.toString(), {
                    title: title,
                    url: url,
                    imgPath: imgPath,
                    id: id,
                    externalUrls: externalUrls,
                    openAtStartup: openAtStartup,
                })
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_UPDATE_WEBSITE_ENTRY_RESPONSE.toString(), (e, args) => {
                        resolve(args);
                    })
                })
            }
        });
    }
}

new SettingsPreload().init();
