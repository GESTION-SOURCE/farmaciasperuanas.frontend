module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage')
        ],
        client: {
            jasmine: {},
            clearContext: false,
            captureConsole: false
        },
        jasmineHtmlReporter: {
            suppressAll: true
        },
        coverageReporter: {
            // Actualizamos la carpeta al nombre de tu proyecto actual
            dir: require('path').join(__dirname, './coverage/farmaciasperuanas-frontend'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'lcovonly' },
                { type: 'text-summary' }
            ]
        },
        reporters: ['progress', 'kjhtml', 'coverage'],
        browsers: ['ChromeHeadlessCI'],
        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu']
            }
        },
        restartOnFileChange: true
    });
};