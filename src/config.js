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
                path: '/about',
                type: 'index/About',
                title: '关于我们'
            }
        ];

        var controller = require('er/controller');

        for (var i = 0, len = actions.length; i < len; i++ ) {
            controller.registerAction(actions[i]);
        }
    }
);