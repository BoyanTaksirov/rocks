var webpack = require("webpack");
var path = require("path");

var DIST_DIR = path.resolve(__dirname, "public");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
    entry: SRC_DIR + "/js/index.js",
    output: {
        path: DIST_DIR,
        filename: "RocksBundle.js",
        publicPath: "./",
    },
    //devtool: 'eval-source-map',
    mode: "production",
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                include: SRC_DIR,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env"
                    ],
                    plugins: ["@babel/plugin-proposal-class-properties"]
                }
            },
            {
                test: /\.(gif|png|jpg|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },

    optimization: {
        minimize: true,
    }

};

module.exports = config;