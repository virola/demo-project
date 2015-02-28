/**
 * @file 
 * @author virola(virola.zhu@gmail.com)
 */

define(function (require) {

    var permission = require('er/permission');
    var events = require('er/events');

    var weixin = require('common/weixin');

    function bindWxShare() {
        var wxData = {
            title: $('#wx-title').val() || document.title,
            desc: $('#wx-desc').val() || '',
            imgUrl: $('#wx-img').val() || '',
            link: $('#wx-link').val() || window.location.href
        };
        weixin.bindShare(wxData);
    }

    /**
     * main
     */
    function main(env) {

        events.on('error', function(error) {
            console.log(error.error);
        });

        events.on('enteractioncomplete', function () {
            $('#splash-screen').hide();
        });

            
        require('common/hookajax')();
        require('./config');
        require('er').start();

        // weixin 参数设置
        // weixin.init(function () {
        //     bindWxShare();

        //     // 在所有action完成时设定微信分享的数据
        //     events.on(
        //         'enteractioncomplete',
        //         function(args) {
        //             weixin.update(bindWxShare);
        //         }
        //     );

        //     // debugger
        //     // weixin.enableDebug();  
        // });

        
        // 引入微信模板
        require('er/tpl!common/weixin.html');
        
    }

    // return模块
    return main;
});
