const {contextBridge, ipcRenderer} = require('electron')
const wwEvents = require('../constants/wwEvents')

class SettingsPreload {
    init() {
        this.prepareEvents();
    }

    prepareEvents() {
        ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS.toString());
        const websites = new Promise(resolve => {
            ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_SETTINGS_RESPONSE.toString(), (e, args) => {
                resolve(args && args.websites ? args.websites : [])
            })
        });

        contextBridge.exposeInMainWorld('electron', {
            'websiteEntries': websites,
            'clearWebsites': () => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES.toString(),)
                return new Promise(resolve => {
                    ipcRenderer.on(wwEvents.SETTINGS_WINDOW_REQ_REMOVE_WEBSITES_RESPONSE.toString(), (e, args) => {
                        resolve(args);
                    })
                })
            },
            'saveNewEntry': (title, url, imgPath) => {
                ipcRenderer.send(wwEvents.SETTINGS_WINDOW_REQ_SAVE_SETTINGS.toString(), {
                    title: title,
                    url: url,
                    imgPath: imgPath
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
