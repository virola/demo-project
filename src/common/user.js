define(
    function (require) {
        var ajax = require('er/ajax');
        var url = require('url');

        var storage = require('common/storage');

        // 存储用户信息
        // 格式是：
        //  {
        //      wx_openid: '',
        //      wx_avatar: '',
        //      wx_name: '' 
        //  }
        var userModel = storage.get('user') || {
            signed: false,
            data: null
        };

        var Deferred = require('er/Deferred');

        // 判定是否签到的key值
        var SIGNED_KEY = 'is_login';

        var WX_KEY = 'wx_openid';

        var user = {
            checkLogin: function () {
                var request = new Deferred();
                var user = userModel || storage.get('user');
                var data = user && user.data || '';
                if (data && data[WX_KEY]) {
                    // login
                    request.resolve(user);
                    return request.promise;
                }

                ajax.getJSON(url.GET_ACCOUNT).done(function (result) {
                    
                    console.log('check user data', result);
                    userModel.data = result.data;

                    // 已签到
                    if (result[SIGNED_KEY]) {
                        userModel.signed = 1;
                    }

                    storage.set('user', userModel);

                    request.resolve(userModel);
                });

                return request.promise;
            },

            checkSign: function () {
                var request = new Deferred();
                userModel = userModel || storage.get('user');

                if (userModel && userModel[WX_KEY]) {
                    // login
                    
                    if (userModel.signed) {
                        console.log('signed already!');
                    }
                    else {
                        console.log('not signed yet!');
                    }
                    request.resolve(userModel);
                }
                else {
                    user.checkLogin().done(function (data) {
                        request.resolve(data);
                    });
                }

                return request.promise;
            },

            get: function () {
                return userModel || storage.get('user');
            },

            store: function (options) {
                $.each(options, function (key, value) {
                    userModel.data[key] = value;
                });
                
                
                storage.set('user', userModel);

                return userModel;
            },

            updateSign: function (flag) {
                userModel.signed = flag;
                storage.set('user', userModel);
            }
        };

        return user;
    }
);