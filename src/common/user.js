define(
    function (require) {
        var ajax = require('er/ajax');
        var url = require('url').GET_ACCOUNT;

        var storage = require('common/storage');
        var userModel = storage.get('user') || {
            signed: false,
            data: null
        };

        var Deferred = require('er/Deferred');

        // 判定是否签到的key值
        var SIGNED_KEY = 'mobile';

        var user = {
            checkLogin: function () {
                var request = new Deferred();
                var user = userModel || storage.get('user');
                var data = user && user.data || '';
                if (data && data['open_id']) {
                    // login
                    request.resolve(user);
                    return request.promise;
                }

                ajax.getJSON(url).done(function (result) {
                    
                    console.log('check user data', result);
                    userModel.data = result.data;

                    // 已签到
                    if (data[SIGNED_KEY]) {
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

                if (userModel && userModel['open_id']) {
                    // login
                    
                    if (userModel.signed) {
                        // signed
                        console.log('signed already!');
                    }
                    else {
                        console.log('not signed yet!');
                        // require('er/locator').redirect('/sign');
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
                    if (key == SIGNED_KEY) {
                        userModel.signed = true;

                        require('er/permission').add({
                            'signed': {
                                'SIGN': false,
                                'INDEX': true
                            }
                        });
                    }
                    userModel.data[key] = value;
                });
                
                
                storage.set('user', userModel);

                return userModel;
            }
        };

        return user;
    }
);