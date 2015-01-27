/**
 * @file config
 */
define(
    function (require) {
        var actions = [
            {
                path: '/',
                type: 'index/Index',
                authority: 'INDEX',
                noAuthorityLocation: '/sign'
            },
            {
                path: '/sign',
                type: 'sign/Form',
                authority: 'SIGN',
                noAuthorityLocation: '/'
            },
            {
                path: '/message',
                type: 'message/Form',
                authority: 'INDEX',
                noAuthorityLocation: '/sign'
            },
            {
                path: '/bounce',
                type: 'bounce/Show',
                authority: 'INDEX',
                noAuthorityLocation: '/sign'
            },
            {
                path: '/shake',
                type: 'shake/Show',
                authority: 'INDEX',
                noAuthorityLocation: '/sign'
            },
            {
                path: '/program',
                type: 'program/Show',
                authority: 'INDEX',
                noAuthorityLocation: '/sign'
            },
            {
                path: '/program/rank',
                type: 'program/Rank'
            }
        ];

        var controller = require('er/controller');

        for (var i = 0, len = actions.length; i < len; i++ ) {
            controller.registerAction(actions[i]);
        }
    }
);