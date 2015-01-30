define(
    function (require) {

        // 活动状态缓存时间1min
        var STATUS_CACHE = 60000;

        var Deferred = require('er/Deferred');

        var STATE_MAP = {
            'xnhb': ['xnhb1', 'xnhb2'],
            'xnhk': 'xnhk',
            'zfq': 'zfq',
            'nhjm': 'nhjm',
            'yyy': ['yyy1', 'yyy2', 'yyy3']
        };

        var exports = {};

        var URL_STATE = require('url').GET_ACT_STATUS;

        /**
         * 获取活动状态
         * 
         * @return {Object|Deferred} Promise请求，完成时可以判断活动状态
         */
        exports.get = function () {
            var status = exports.actStatus;

            var request = new Deferred();

            if (status && status.timestamp) {
                var now = (new Date()).getTime();

                // cache gap 内不用重复请求
                if (now - status.timestamp < STATUS_CACHE) {
                    request.resolve(status.data);
                    return request.promise;
                }
            }

            require('common/ajax').getJSON(URL_STATE).done(function (result) {
                exports.actStatus = {
                    timestamp: (new Date()).getTime(),
                    status: result
                };
                request.resolve();
                
            })
            .fail(function (result) {
                request.reject(result.message);
            });

            return request.promise;
        };

        /**
         * 判断活动是否已经开始
         * 
         * @param {string} actName 活动名key
         * @return {boolean} 是否开始
         */
        exports.judge = function (actName) {
            var states = STATE_MAP[actName] || null;
            if (!states) {
                return false;
            }

            var begin;
            var sts = exports.actStatus.status || {};
            if (states instanceof Array) {
                $.each(states, function (i, key) {
                    begin = begin || sts[key];
                });
            }
            else {
                begin = sts[states];
            }

            return begin;
        };

        return exports;
    }
);