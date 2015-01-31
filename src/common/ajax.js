define(
    function (require) {

        var Deferred = require('er/Deferred');
        var ajax = require('er/ajax');
        var util = require('er/util');

        /**
         * ajax成功处理函数
         * 
         * @param {Deferred} ejsonResult 给调用者的promise寄主
         * @param {Object} data ajax返回结果（已转为json）
         */
        function success(ejsonResult, data) {

            var bizStatusCode = this.getEjsonStatus(data);
            var bizStatusInfo;


            // 未签到
            
            if (!bizStatusCode) {
                ejsonResult.resolve(data.data || {});
                return;
            }


            // 系统级失败，包括后端服务崩溃、网络不可用、请求失败
            // 此时会弹出一个警告框，reject掉ajax结果
            if (bizStatusCode > 200) {

                // 处理一下错误信息
                // 如果后端没有给出错误信息，使用内置的错误信息
                bizStatusInfo = data.message
                    ? data.message
                    : this.BIZ_STATUS_TEXT[bizStatusCode];
                    
                showAlert(bizStatusCode, bizStatusInfo);
                ejsonResult.reject({
                    status: bizStatusCode,
                    message: bizStatusInfo
                });

                return;

            }

            // 普通业务错误
            bizStatusInfo = data.message;
            ejsonResult.resolve({
                bizError: true,
                status: bizStatusCode,
                message: bizStatusInfo
            });
        }

        /**
         * ajax失败时处理函数
         * 
         * 将500、408包装成业务逻辑错误
         * 
         * @param {Deferred} ejsonResult 给调用者的promise寄主
         * @param {FakeXHR} fakeXHR ajax返回的xhr包装
         */
        function failure(ejsonResult, fakeXHR) {

            var bizStatusCode;
            var bizStatusInfo;

            // 处理网络异常和系统异常
            // 目前只处理500和408
            switch (fakeXHR.status) {
                case 500: // 请求失败，后端异常
                    bizStatusCode = 1004;
                    bizStatusInfo = this.BIZ_STATUS_TEXT[1004];
                    break;
                case 408: // 请求超时
                    bizStatusCode = 1002;
                    bizStatusInfo = this.BIZ_STATUS_TEXT[1002];
                    break;
            }

            bizStatusCode > 999 && showAlert(bizStatusCode);

            ejsonResult.resolve({
                bizError: true,
                status: bizStatusCode,
                message: bizStatusInfo
            });

        }

        /**
         * 显示一个警告框
         * 
         * @param {Number} bizStatusCode 业务逻辑错误码
         * @param {String|Object} bizStatusInfo 业务逻辑错误提示信息
         */
        function showAlert(bizStatusCode, bizStatusInfo) {

            var dialog = require('common/dialog');

            switch (bizStatusCode) {

                // 未登录或者未签署协议，不弹框，直接跳转
                case 302:
                    window.location.href = bizStatusInfo;
                    return;

                // 未登录或者未签署协议，直接按redirect跳转
                case 1000: case 1001: 
                    console.log('not signed!');
                    window.location.href = require('url').USER_LOGIN;
                    return;

                // 系统崩溃，直接跳转到系统不可用
                case 1003:
                    options.onok = function () {
                        window.location.href = '/error/1003.html';
                    };
                    break;
            }

            dialog.alert(ejson.BIZ_STATUS_TEXT[bizStatusCode]);

        }

        var ejson = {

            /**
             * 发起一个GET请求并获取JSON数据
             * 
             * EJSON模式下
             * 
             * 当后端正常返回，返回数据格式符合EJSON规范，并且status=0时会resolve。
             * 其他情况一律reject。网络超时/系统异常会被包装成1000+的异常
             *
             * @param {string} url 请求的地址
             * @param {Object=} data 请求的数据
             * @param {boolean=} cache 决定是否允许缓存
             * @return {Object} 该对象有Promise的所有方法，以及一个`abort`方法
             */
            get: function (url, data, cache) {

                var options = {
                    method: 'GET',
                    url: url,
                    data: data,
                    cache: cache || ajax.config.cache
                };

                return this.request(options);

            },

            /**
             * 发起一个POST请求
             *
             * @param {string} url 请求的地址
             * @param {Object=} data 请求的数据
             * @return {Object} 该对象有Promise的所有方法，以及一个`abort`方法
             */
            post: function (url, data) {

                var options = {
                    method: 'POST',
                    url: url, 
                    data: data
                };

                return this.request(options);

            },

            /**
             * 发起XMLHttpRequest请求
             *
             * @param {Object} options 相关配置
             * @param {string} options.url 请求的地址
             * @param {string=} options.method 请求的类型
             * @param {Object=} options.data 请求的数据
             * 可以为**json**或**text**，默认为**responseText**
             * @param {number=} options.timeout 超时时间
             * @param {boolean=} options.cache 决定是否允许缓存
             * @return {FakeXHR} 该对象有Promise的所有方法，以及一个`abort`方法
             */
            request: function (options) {

                var me = this;

                // ejson接口中返回值类型一定是json格式的
                options.dataType = 'json';

                var requesting = ajax.request(options);
                var ejsonResult = new Deferred();

                requesting.then(
                    util.bind(success, me, ejsonResult), 
                    util.bind(failure, me, ejsonResult)
                );

                ejsonResult.abort = util.bind(requesting.abort, requesting);

                return ejsonResult;

            },

            /**
             * 获取一个Object的EJSON状态码
             * 
             * 如果Object不符合EJSON的规范，会得到相应的错误码
             * 如果Object的业务逻辑错误，会得到相应的业务错误码
             * 
             * 如果返回值为0，表示即满足EJSON格式规范并且后端业务处理正常
             * 
             * @param {Object} obj
             * @return {Number} 状态码
             */
            getEjsonStatus: function (obj) {

                var me = this;
                var bizErrorCode = 0;

                if (!obj) {
                    bizErrorCode = me.BIZ_STATUS_CODE.EMPTY_RESPONSE;
                }
                else if (typeof obj.status === 'undefined') {
                    bizErrorCode = me.BIZ_STATUS_CODE.NO_STATUS;
                }
                else if (isNaN(obj.status - 0)) {
                    bizErrorCode = me.BIZ_STATUS_CODE.NAN_STATUS;
                }
                else if (obj.status > 0) {
                    bizErrorCode = obj.status;

                    if (obj.status == 302) {
                        obj.message = obj.redirect;
                    }
                }
                else if (obj.status == -1 && obj['is_login'] == 0) {
                    bizErrorCode = me.BIZ_STATUS_CODE.UNAUTHORIZED;
                }

                return bizErrorCode;

            },

            /**
             * 一些常用的biz异常码
             * 
             * @type {Object}
             * @const
             */
            BIZ_STATUS_CODE: {
                COMMON_ERROR: 1,
                EMPTY_RESPONSE: 2000, // 空的返回数据
                NO_STATUS: 2001, // 不存在status字段
                NAN_STATUS: 2002,  // 不能转化为数字的status字段

                UNLOGIN: 302,                  // 未认证/未登录
                UNAUTHORIZED: 1001,             // 未授权/未签用户协议
                TIMEOUT: 1002,                  // 请求超时 原408
                SYSTEM_FATAL: 1003,             // 系统异常
                REQURET_FATAL: 1004,            // 本次请求失败 原500
                UNAUTHERIZED_DIRECT_JUMP: 1005, // 未认证，并直接跳转
                EJSON_EMPTY_RESPONSE: 1100,     // 空的返回数据
                EJSON_NO_STATUS: 1101,          // 不存在status字段
                EJSON_NAN_STATUS: 1102          // 不能转化为数字的status字段

            },

            /**
             * 一些常用的Biz异常提示话术
             * 
             * @type {Object}
             * @const
             */
            BIZ_STATUS_TEXT: {
                1000: '尚未登录，请登录',
                1001: '您还没有签到哦',
                1002: '网络异常，请稍后再试',
                1003: '服务异常，请稍后再试',
                1004: '服务异常，请稍后重试',
                1100: '数据异常，请稍后再试',
                1101: '数据异常，请稍后再试',
                1102: '数据异常，请稍后再试'
            }

        };

        ejson.getJSON = ejson.get;

        return ejson;
    }
);