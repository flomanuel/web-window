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
     * @return {Promise<unknown>}
     */
    static saveNewWebsiteEntry(title, url, imgPath) {
        return new Promise(resolve => {
            window.electron.saveNewEntry(title ? title : 'Title', url ? url : 'https://www.google.de', imgPath).then((value) => {
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
}

export default UserDataService;
