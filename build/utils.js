'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const myconf = require('../config/myconf')

exports.assetsPath = function(_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
        config.build.assetsSubDirectory :
        config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
    options = options || {}

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }
    const px2remLoader = {
        loader: 'px2rem-loader',
        options: {
            remUnit: 100,
            remPrecision: 5
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = [cssLoader]

        if (options.usePostCSS) {
            loaders.concat(postcssLoader)
        }

        if (myconf[process.env.NODE_ENV === 'production' ? 'build' : 'dev']['autoPx2rem']) {
            loaders.concat(px2remLoader)
        }

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader',
                publicPath: '../../'
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {
            indentedSyntax: true
        }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
    const output = []
    const loaders = exports.cssLoaders(options)

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output
}

exports.createNotifierCallback = () => {
        const notifier = require('node-notifier')

        return (severity, errors) => {
            if (severity !== 'error') return

            const error = errors[0]
            const filename = error.file && error.file.split('!').pop()

            notifier.notify({
                title: packageConfig.name,
                message: severity + ': ' + error.name,
                subtitle: filename || '',
                icon: path.join(__dirname, 'logo.png')
            })
        }
    }
    //glob是webpack安装时依赖的一个第三方模块，该模块允许你使用*等符号,例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
const glob = require('glob')
    // 页面模板
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
    //取得相应的页面路径，因为之前的配置，所以是src文件夹下的pages文件夹
const PAGE_PATH = path.resolve(__dirname, '../src/pages')
    // 用于做相应的merge处理
const merge = require('webpack-merge')

const PreloadWebpackPligin = require('preload-webpack-plugin')

const developingPages = process.env.NODE_ENV === 'production' ? myconf.build.buildingPages : myconf.dev.developingPages

//多入口配置
//通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
//那么作为入口处理

exports.entries = () => {
        const entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
        const map = {}
            // let developingPages = myconf.dev.developingPages
        entryFiles.forEach((filePath) => {
                const filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))

                //该配置项数组非空时按需编译
                if (!developingPages.length || developingPages.indexOf(filename) > -1) {
                    //页面添加babel-polyfill用于适配到IE9及以上版本浏览器
                    map[filename] = filePath
                }
            })
            // map['flexible'] = path.resolve(__dirname, '../static/js/lib/flexible.js')

        return map
    }
    //多页面输出配置
    //与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = () => {
    const entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
    const arr = []
        // let developingPages = myconf.dev.developingPages
    entryHtml.forEach((filePath) => {
        const filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))

        if (!developingPages.length || developingPages.indexOf(filename) > -1) {
            const chunks = ['mainfest', 'flexible', 'vendor', filename]
            let conf = {
                //模板来源
                template: filePath,
                //文件名称
                filename: filename + '.html',
                //页面模块需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
                chunks,
                inject: true,
                chunksSortMode: (a, b) => chunks.indexOf(a.names[0]) - chunks.indexOf(b.names[0]),
                title: myconf.dev.htmlPath,
                // inlineSource: 'manifest.*.(js)$|flexible.js$'
            }
            if (process.env.NODE_ENV === 'production') {
                conf = merge(conf, {
                    minify: {
                        removeCommemts: true,
                        collapseWhitespace: true,
                        removeAttributrQuotes: true
                    },
                    inlineSource: '(manifest).*.(js)$|(flexible).*.(js)$',
                    title: `${myconf.build.htmlPath}${myconf.build.assetsSubDirectory}/`
                })
            }
            arr.push(new HtmlWebpackPlugin(conf))
        }
    })
    arr.push(new HtmlWebpackInlineSourcePlugin())
    arr.push(new PreloadWebpackPligin({
        rel: 'prefetch',
        include: 'asyncChunks',
        as(entry) {
            if (/\.css$/.test(entry)) return 'style';
            if (/\.woff$/.test(entry)) return 'font';
            if (/\.png$/.test(entry)) return 'image';
            return 'script';
        }
    }))

    return arr
}