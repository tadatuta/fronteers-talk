var techs = {
    fileProvider: require('enb/techs/file-provider'),
    fileMerge: require('enb/techs/file-merge'),
    htmlToBemjson: require('enb-html-to-bemjson/techs/html-to-bemjson'),
    borschik: require('enb-borschik/techs/borschik'),
    stylus: require('enb-stylus/techs/stylus'),
    browserJs: require('enb-js/techs/browser-js'),
    bemhtml: require('enb-bemxjst-2/techs/bemhtml'),
    bemjsonToHtml: require('enb-bemxjst-2/techs/html-from-bemjson'),
    htmlBeautify: require('enb-beautify/techs/enb-beautify-html')
};
var enbBemTechs = require('enb-bem-techs');

module.exports = function(config) {
    var isProd = process.env.YENV === 'production';

    config.nodes('pages/*', function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: ['blocks'] }],
            [techs.fileProvider, { target: '?.src.html' }],
            [techs.htmlToBemjson, { source: '?.src.html', target: '.tmp.bemjson.js' }],
            [enbBemTechs.bemjsonToBemdecl, { source: '.tmp.bemjson.js', target: '.tmp.bemdecl.js' }],
            [enbBemTechs.deps, { bemdeclFile: '.tmp.bemdecl.js', target: '.tmp.deps.js' }],
            [enbBemTechs.files, { depsFile: '.tmp.deps.js' }],

            // css
            [techs.stylus, {
                target: '.tmp.css',
                autoprefixer: { browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%'] }
            }],

            // bemhtml
            [techs.bemhtml, { target: '.tmp.bemhtml.js' }],

            // html
            [techs.bemjsonToHtml, {
                bemhtmlFile: '.tmp.bemhtml.js',
                bemjsonFile: '.tmp.bemjson.js',
                target: '.tmp.html'
            }],
            [techs.htmlBeautify, { source: '.tmp.html',  target: '?.html' }],

            // js
            [techs.browserJs, { target: '.tmp.browser.js' }],
            [techs.fileMerge, {
                target: '.tmp.js',
                sources: ['.tmp.browser.js', '.tmp.bemhtml.js']
            }],

            // borschik
            [techs.borschik, { source: '.tmp.js', target: '?.js', minify: isProd }],
            [techs.borschik, { source: '.tmp.css', target: '?.css', tech: 'cleancss', minify: isProd }]
        ]);

        nodeConfig.addTargets(['?.html', '?.css', '?.js']);
    });
};
