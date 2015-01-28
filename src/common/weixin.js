define(
    function (require) {
        var exports = {};

        // sdk对象存储
        var wx;

        exports.init = function () {
            require(['wxsdk'], function (sdk) {
                wx = sdk;
            });
        };

        var options = {
            debug: true,
            jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        };

        var curUrl = window.location.href;


        exports.config = function (params) {


            if (curUrl.indexOf('94uv.com') > -1 || curUrl.indexOf('94uv.cn') > -1) {
                options.debug = false;
            }
            wx.config($.extend(options, params));
        };

        return exports;
    }
);