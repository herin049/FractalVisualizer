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
        publicPath: '/',
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
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [{ loader: 'url?limit=10000&name=images/[name].[ext]' }],
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'css-hot-loader' },
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' },
                ],
            }
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
