define(
    function (require) {

        var Deferred = require('er/Deferred');
        var eajax = require('er/ajax');

        var ajax = {};

        function handleSuccess(result, requesting) {
            if (result.status) {
                requesting.reject(result);
            }
            else {
                requesting.resolve(result.data);
            }
        }

        function handleFail(res, requesting) {
            requesting.reject({
                status: 500,
                message: '请求失败，请稍候再试'
            });
        }

        ajax.get = function (url) {
            var requesting = new Deferred();

            eajax.getJSON(url).done(function (result) {
                handleSuccess(result, requesting);
            }).fail(function (result) {
                handleFail(result, requesting);
            });

            return requesting.promise;
        };

        ajax.post = function (url, data) {
            var requesting = new Deferred();

            eajax.post(url, data).done(function (result) {
                handleSuccess(result, requesting);
            }).fail(function (result) {
                handleFail(result, requesting);
            });

            return requesting.promise;
        };

        ajax.getJSON = ajax.get;

        return ajax;
    }
);