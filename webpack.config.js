const appName = process.env.npm_package_name;
const appVersion = process.env.npm_package_version;

const configMainProcess = require("./webpack.config.d/main.config");
const configRenderProcess = require("./webpack.config.d/render.config");
const configPreloadScript = require("./webpack.config.d/preload.config");

console.info('\n\n\n\n\n\n\n\n============ Building', appName, appVersion, ' ============', '\n');


module.exports = [
    configMainProcess,
    configRenderProcess,
    configPreloadScript
]
