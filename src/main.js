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

            // 跳转到签到
            if (!data.signed) {
                console.log('not signed!');
                require('er/locator').redirect('/sign');
            }

            // weixin init
            weixin.init(function () {
                bindWxShare();

                events.on(
                    'enteractioncomplete',
                    function(args) {
                        weixin.update(bindWxShare);
                    }
                );

                // debugger
                // weixin.enableDebug();  
            });
        });

        function bindWxShare() {
            var wxData = {
                title: $('#wx-title').val() || document.title,
                desc: $('#wx-desc').val() || '',
                imgUrl: $('#wx-img').val() || '',
                link: $('#wx-link').val() || window.location.href
            };
            weixin.bindShare(wxData);
        }

        // 引入微信模板
        require('er/tpl!common/weixin.html');

        
    }


    // return模块
    return main;
});
