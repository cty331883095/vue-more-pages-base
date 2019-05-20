'use strict'
module.exports = {
    dev: {
        allowIP: 0,
        useEslist: true,
        htmlPath: '/static/',
        staticPath: '/static',
        developingPages: ['index', 'index2'],
        autoPx2rem: true

    },
    build: {
        htmlPath: '/testdemo/',
        assetsSubDirectory: 'static',
        buildingPages: ['index', 'index2'],
        assetsRoot: 'dist',
        autoPx2rem: true
    }
}