/**
 * @file config
 */
define(
    function (require) {
        var actions = [
            {
                path: '/',
                type: 'index/Index',
                title: '首页'
            },
            {
                path: '/message',
                type: 'message/Form',
                title: '新年祝福'
            },
            {
                path: '/bounce',
                type: 'bounce/Show',
                title: '新年红包'
            },
            {
                path: '/shake',
                type: 'shake/Show',
                title: '摇一摇'
            }
        ];

        var controller = require('er/controller');

        for (var i = 0, len = actions.length; i < len; i++ ) {
            controller.registerAction(actions[i]);
        }
    }
);