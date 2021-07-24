const path = require('path');
// eslint-disable-next-line
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        bundle: './src/index.js',
        worker: './src/worker/worker.js',
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'css-hot-loader' },
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
