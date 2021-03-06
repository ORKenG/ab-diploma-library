const path = require('path');
const config = require('./package.json');

const webpack = require('webpack');
require('dotenv').config();

/* eslint-disable no-undef*/

const PROD = process.env.NODE_ENV === 'production';

let plugins = [];

PROD ? [
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
    }))
] : '';

module.exports = {
    entry: path.resolve(__dirname, config.main),
    devtool: 'source-map',
    output: {
        library: process.env.NAME,
        libraryTarget: process.env.TARGET,
        path: __dirname,
        filename: (PROD) ? 'build/ab-haze.min.js' : 'build/ab-haze.js'
    },
    plugins: plugins
};
