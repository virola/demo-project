/**
 * @file config
 */
define(
    function (require) {
        var actions = [
            {
                path: '/',
                type: 'index/Index',
                // authority: 'INDEX',
                // noAuthorityLocation: '/sign',
                title: '首页'
            },
            {
                path: '/sign',
                type: 'sign/Form',
                // authority: 'SIGN',
                // noAuthorityLocation: '/',
                title: '签到'
            },
            {
                path: '/message',
                type: 'message/Form',
                // authority: 'INDEX',
                // noAuthorityLocation: '/sign',
                title: '新年祝福'
            },
            {
                path: '/bounce',
                type: 'bounce/Show',
                // authority: 'INDEX',
                // noAuthorityLocation: '/sign',
                title: '新年红包'
            },
            {
                path: '/shake',
                type: 'shake/Show',
                // authority: 'INDEX',
                // noAuthorityLocation: '/sign',
                title: '摇一摇'
            },
            {
                path: '/program',
                type: 'program/Show',
                // authority: 'INDEX',
                // noAuthorityLocation: '/sign',
                title: '年会节目'
            },
            {
                path: '/program/rank',
                type: 'program/Rank',
                title: '排行榜'
            }
        ];

        var controller = require('er/controller');

        for (var i = 0, len = actions.length; i < len; i++ ) {
            controller.registerAction(actions[i]);
        }
    }
);