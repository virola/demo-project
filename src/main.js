/**
 * @file 
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require, exports, module) {

    var permission = require('er/permission');
    var events = require('er/events');

    var weixin = require('common/weixin');

    /**
     * main
     */
    function main(env) {

        events.on(
            'error',
            function(error) {
                console.log(error);
            }
        );

        var user = require('common/user');
        user.checkLogin().done(function (data) {
            
            require('common/hookajax')();
            require('./config');
            require('er').start();
        });

        // 引入微信模板
        require('er/tpl!common/weixin.html');

        
    }


    // return模块
    return main;
});
