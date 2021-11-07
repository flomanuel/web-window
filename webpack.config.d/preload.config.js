const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const webpack = require("webpack");

const appName = process.env.npm_package_name;
const appVersion = process.env.npm_package_version;
const buildMode = process.env.NODE_ENV;
const isDev = buildMode === 'development';

module.exports = {
    mode: buildMode,
    target: 'electron-preload',

    entry: path.join(__dirname, '..', 'src', 'frontend', 'preload.js'),

    output: {
        path: path.join(__dirname, '..', 'dist', 'frontend'),
        filename: "preload.js",
    },
    resolve: {
        extensions: ['.jsx', '.js'],
    },
    optimization: {
        minimize: !isDev,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ],
    },
    plugins: [
        new ESLintPlugin({
            files: path.join(__dirname, '..', 'src', 'frontend', 'preload.js'),
        }),
        new webpack.DefinePlugin({appName: JSON.stringify(appName)}),
        new webpack.DefinePlugin({appVersion: JSON.stringify(appVersion)}),
    ],
    externalsPresets: {
        node: true,
        electronPreload: true
    }
}
