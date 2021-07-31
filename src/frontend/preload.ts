import {contextBridge, ipcRenderer} from "electron";
import {wwEvents} from "../constants/wwEvents";
import * as crypto from "crypto";

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
            'saveNewEntry': (title: string, url: string, imgPath: string) => {
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
