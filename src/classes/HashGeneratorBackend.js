const crypto = require("crypto")


class HashGeneratorBackend {

    /**
     *
     * @return {string}
     */
    static getRandomString() {
        return Date.now().toString() + Math.random().toString();
    }

    /**
     *
     * @return {string}
     */
    static generateRandomHash() {
        return crypto.createHmac('md5', HashGeneratorBackend.getRandomString()).update(HashGeneratorBackend.getRandomString()).digest('hex')
    }

    /**
     *
     * @param key
     * @param data
     * @return {string}
     */
    static generateHashFromString(key, data) {
        return crypto.createHmac('md5', key).update(data).digest('hex')
    }
}

module.exports = HashGeneratorBackend;
