define(
    function (require) {
        var exports = $({});

        // sdk对象存储
        var wx;

        exports.init = function () {
            require(['wxsdk'], function (sdk) {
                wx = sdk;
            });
        };

        var options = {
            debug: true,
            jsApiList: [
                'getNetworkType',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ]
        };

        var curUrl = window.location.href;

        var domain = '94uv.com';
        if (curUrl.indexOf('94uv.test') > -1) {
            domain = '94uv.test';
        }
        else if (curUrl.indexOf('94uv.dev') > -1) {
            domain = '94uv.dev';
        }

        // 请求微信sdk的
        var URL_TOKEN = 'http://m.plus.' + domain + '/index.php?app=wechat';

        exports.config = function (params) {
            if (curUrl.indexOf('94uv.com') > -1 || curUrl.indexOf('94uv.cn') > -1) {
                options.debug = false;
            }
            wx && wx.config($.extend(options, params));
        };

        var networkType;

        exports.ready = function () {
            wx && wx.ready(function(){
                wx.getNetworkType({
                    success: function (res) {

                        // 返回网络类型2g，3g，4g，wifi
                        exports.fire('networkType', res.networkType);

                        networkType = res.networkType;
                    }
                });

                exports.bindShare({
                    // todo
                });
            });
        };

        var wxDataDefault = {
            title: document.title,
            link: window.location.href,
            imgUrl: '',
            desc: '...'
        };

        exports.bindShare = function (data) {
            if (!wx) {
                return;
            }

            var params = $.extend({
                success: function () { 
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () { 
                    // 用户取消分享后执行的回调函数
                }
            }, wxDataDefault, data);

            wx.onMenuShareTimeline(params);

            wx.onMenuShareAppMessage(params);

            wx.onMenuShareQQ(params);

            wx.onMenuShareWeibo(params);
        };


        exports.update = function () {
            $.ajax({
                url: URL_TOKEN, 
                dataType: 'jsonp',
                success: function (data) {
                    if (data.timestamp && data.noncestr && data.signature) {
                        exports.config(data);
                    }
                }
            });

            // 数据更新
        };

        exports.getNetworkType = function () {
            return networkType;
        };

        return exports;
    }
);