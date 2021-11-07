class HashGeneratorFrontend {

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
        /* https://stackoverflow.com/a/7616484 */
        const string = HashGeneratorFrontend.getRandomString();
        let hash = 0, i, chr;
        if (string.length === 0) return hash < 0 ? (-1 * hash).toString() : hash.toString();
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash < 0 ? (-1 * hash).toString() : hash.toString();
    }
}

export default HashGeneratorFrontend;
