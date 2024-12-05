const TerserPlugin = require('terser-webpack-plugin') // 引入压缩插件
const path = require('path')
module.exports = {
    mode: 'none', // 因为默认是production 默认会进行压缩
    entry: {
        "index": ['./index.js'],
        "index.min": ['./index.js']
    },
    output: {
        filename: "[name].js",
        // library: {
        //     type: "module"
        // }
        library: 'previewImage', // 为你的库指定一个全局变量名
        libraryTarget: 'umd', // 将你的库以 UMD 格式导出
        clean:true,
        path: path.resolve(__dirname, './dist'),
        libraryExport: 'default',
        umdNamedDefine: true,
        environment: {
            // 是否使用箭头函数
            arrowFunction: false,
        },
    },
    // experiments: {
    //     outputModule: true,
    // },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({ // 使用压缩插件
                include: /\.min\.js$/,
                parallel: true, // 多线程进行压缩
                terserOptions: {
                    compress: {
                        drop_console: true // 去除console语句
                    }
                    // 可以根据需要添加更多的Terser配置项
                }
            })
        ]
    },
    // 模块的加载规则
    module: {
        rules: [
            {
                test: /\.js$/, // 匹配所有.js文件
                exclude: /node_modules/, // 排除node_modules目录下的文件
                use: {
                    loader: 'babel-loader', // 使用babel-loader
                    options: {
                        presets: ['@babel/preset-env'] // 使用的Babel预设
                    }
                }
            }
            // 可以根据需要添加更多的规则，比如处理CSS或图片等
        ]
    }
}