exports.port = 8118;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
var path = require('path');
var fs = require('fs');

exports.getLocations = function () {
    return [
        { 
            location: /\/$/, 
            handler: home( 'index.html' )
        },
        {
            location: function (request) {

                if (request.pathname.indexOf('index.php') > -1) {
                    console.log('card!');
                    return true;
                }

                var pathname = request.pathname;
                var extname = path.extname(pathname);

                pathname = extname 
                     ? path.basename(pathname, extname) : pathname;

                var handlerPath = path.join(
                     exports.documentRoot, 'data', pathname
                );

                return fs.existsSync(handlerPath + '.js');
        
            },
            handler: [function (context) {
                if (context.request.pathname.indexOf('index.php') > -1) {
                    require(path.join(
                        exports.documentRoot, 'data', 'user/card'
                    )).execute(context);
                    return;
                }

                var request = context.request;
                var pathname = request.pathname;
                var extname = path.extname(pathname);

                pathname = extname 
                    ? path.basename(pathname, extname) : pathname;

                var handlerPath = path.join(
                    exports.documentRoot, 'data', pathname
                );

                var handler = require(handlerPath + '.js');

                handler.execute(context);

            }]
        },
        { 
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        { 
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss()
            ]
        },
        { 
            location: /\.less($|\?)/, 
            handler: [
                file(),
                less()
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus()
            ]
        },
        { 
            location: /^.*$/, 
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
