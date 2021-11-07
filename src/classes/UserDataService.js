import {Subject} from 'rxjs';

class UserDataService {

    static get subject() {
        if (!UserDataService._subject) {
            UserDataService._subject = new Subject();
        }
        return UserDataService._subject;
    }

    static load() {
        window.electron.userSettings().then(result => {
            UserDataService.subject.next(result);
        }).catch(e => {
            throw `Error loading user data: ${e}`
        })
    }

    static onDataChange() {
        return UserDataService.subject.asObservable();
    }


    /**
     *
     * @param id
     * @return {Promise<{url, iconPath, title, id, externalUrls, openAtStartup}|boolean>}
     */
    static getSingleWebsiteEntry(id) {
        return window.electron.getSingleWebsiteEntry(id);
    }

    /**
     *
     * @param id
     * @return {Promise<void>}
     */
    static async removeWebsiteEntry(id) {
        if (id) {
            await window.electron.removeWebsiteEntry(id)
            UserDataService.load();
        }
    }

    /**
     *
     * @param title
     * @param url
     * @param imgPath
     * @param externalUrls
     * @param openAtStartup
     * @return {Promise<boolean>}
     */
    static saveNewWebsiteEntry(title, url, imgPath, externalUrls, openAtStartup) {
        return new Promise(resolve => {
            window.electron.saveNewEntry(title || 'Title', url || 'https://www.google.de', imgPath, externalUrls, openAtStartup).then(value => {
                if (value) {
                    UserDataService.load();
                    resolve(true);
                } else {
                    resolve(false);
                    throw `Error saving new entry.`
                }
            })
        });
    }

    /**
     *
     * @param title
     * @param url
     * @param imgPath
     * @param externalUrls
     * @param id
     * @param openAtStartup
     */
    static updateWebsiteEntry(title, url, imgPath, externalUrls, id, openAtStartup) {
        return new Promise(resolve => {
            window.electron.updateWebsiteEntry(title, url, imgPath, externalUrls, id, openAtStartup).then(value => {
                resolve(value);
            })
        })
    }

}

export default UserDataService;
