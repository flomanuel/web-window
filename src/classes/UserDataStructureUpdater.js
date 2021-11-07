const electronSettings = require("electron-settings");
const HashGeneratorBackend = require("./HashGeneratorBackend");

class UserDataStructureUpdater {

    /**
     *
     * @param userData
     */
    constructor(userData) {
        this.userData = userData;
    }

    /**
     *
     * @return {any}
     */
    update() {
        if (!this.userData.user) {
            electronSettings.setSync('user', {'websites': []});
            electronSettings.setSync('version', process.env.npm_package_version);
        } else {
            this.updateUserData();
        }
        return electronSettings.getSync();
    }

    updateUserData() {
        this.updateApplicationVersion()
        this.updateWebsiteData();
    }

    updateApplicationVersion() {
        if (!this.userData.version || this.userData.version !== process.env.npm_package_version) {
            this.userData.version = process.env.npm_package_version;
            electronSettings.setSync('version', this.userData.version);
        }
    }

    updateWebsiteData() {
        this.userData.user.websites?.forEach(website => {
            if (!website.id) {
                website.id = HashGeneratorBackend.generateRandomHash();
            }
            if (!website.externalUrls) {
                website.externalUrls = [];
            }
            if (typeof website.openAtStartup !== "boolean") {
                website.openAtStartup = false;
            }
        });

        if (this.userData.user.websites.length > 0) {
            electronSettings.setSync('user.websites', this.userData.user.websites)
        }
    }
}

module.exports = UserDataStructureUpdater;
