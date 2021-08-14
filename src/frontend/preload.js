const {contextBridge, ipcRenderer} = require('electron')
const wwEvents = require('../constants/wwEvents')
const crypto = require("crypto")

class SettingsPreload {
    init() {
        this.prepareEvents();
    }

    prepareEvents() {
        contextBridge.exposeInMainWorld('electron', {
            'websiteEntries': () => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS.toString());
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS_RESPONSE.toString(), (e, args) => {
                        resolve(args && args.websites ? args.websites : [])
                    })
                });
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
            'saveNewEntry': (title, url, imgPath) => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS.toString(), {
                    title: title,
                    url: url,
                    imgPath: imgPath,
                    id: crypto.createHmac('md5', Date.now().toString() + Math.random()).update(Date.now().toString() + Math.random() + title).digest('hex')
                })
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS_RESPONSE.toString(), (e, args) => {
                        resolve(args);
                    })
                })
            }
        });
    }
}

new SettingsPreload().init();
