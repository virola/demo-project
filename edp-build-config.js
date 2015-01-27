exports.input = __dirname;

var path = require( 'path' );
exports.output = path.resolve( __dirname, 'output' );

var moduleEntries = 'html,htm,phtml,tpl,vm,js';
var pageEntries = 'html,htm,phtml,tpl,vm';

var today = new Date();
var version = today.getFullYear() * 10000 
    + ( today.getMonth() + 1 ) * 100 
    + today.getDate();

exports.getProcessors = function () {
    var lessProcessor = new LessCompiler({
        entryExtnames: pageEntries
    });
    var cssProcessor = new CssCompressor();
    var moduleProcessor = new ModuleCompiler({
        configFile: 'module.conf',
        entryExtnames: moduleEntries
    });
    var jsProcessor = new JsCompressor();
    var pathMapperProcessor = new PathMapper({
        replacements: [
            { type: 'html', tag: 'link', attribute: 'href', extnames: pageEntries },
            { type: 'html', tag: 'img', attribute: 'src', extnames: pageEntries },
            { type: 'html', tag: 'script', attribute: 'src', extnames: pageEntries },
            { extnames: 'html', replacer: 'module-config' },
            { extnames: 'less,css', replacer: 'css' }
        ],
        from: 'src',
        to: 'asset' + '-' + version
    });
    var addCopyright = new AddCopyright();

    var tplMerge = new TplMerge({
        outputType: 'js',
        outputPluginId: 'tpl'
    });

    return {
        'default': [ lessProcessor, moduleProcessor, pathMapperProcessor ],
        'release': [
            lessProcessor, cssProcessor, moduleProcessor,
            jsProcessor, tplMerge, pathMapperProcessor, addCopyright
        ]
    };
};

exports.exclude = [
    'tool',
    'doc',
    'test',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp'
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

